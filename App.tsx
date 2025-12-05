import React, { useState, useCallback, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import GraphVisualizer from './components/GraphVisualizer';
import RagPanel from './components/RagPanel';
import DocsModal from './components/DocsModal';
import LandingPage from './components/LandingPage'; // New Import
import { 
  GraphData, 
  SystemConfig, 
  RetrievalMethod, 
  EmbeddingModel, 
  SynthesisModel,
  ResponseStyle,
  ChatMessage, 
  LogStep,
  RagInsight,
  GraphNode,
  GraphLink,
  GroupLegend
} from './types';
import { 
  DEFAULT_TOPIC, 
  INITIAL_NODES, 
  INITIAL_LINKS,
  INITIAL_LEGEND,
  PRIME_KG_SAMPLE,
  PRIME_KG_LEGEND,
  MOVIE_KG_SAMPLE,
  MOVIE_KG_LEGEND,
  MENTAL_HEALTH_KG_SAMPLE,
  MENTAL_HEALTH_KG_LEGEND
} from './constants';
import { generateGraphFromTopic, generateGraphFromPaperTopic, performGraphRag, embedGraphNodes } from './services/geminiService';

const App: React.FC = () => {
  // --- View State ---
  const [showLanding, setShowLanding] = useState(true);

  // --- State Management ---
  const [config, setConfig] = useState<SystemConfig>({
    retrievalMethod: RetrievalMethod.VECTOR_SIMILARITY, // Default to REAL vector search
    embeddingModel: EmbeddingModel.GEMINI_EMBEDDING,
    synthesisModel: SynthesisModel.GEMINI_FLASH,
    responseStyle: ResponseStyle.CONCISE,
    topK: 3,
    graphDepth: 1
  });

  const [graphData, setGraphData] = useState<GraphData>({
    nodes: INITIAL_NODES,
    links: INITIAL_LINKS
  });

  const [currentLegend, setCurrentLegend] = useState<GroupLegend>(INITIAL_LEGEND);

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'system',
      content: 'Welcome to KG-RAG Platform. Use the sidebar to Generate a new graph or Connect to an external data source.',
      timestamp: Date.now()
    }
  ]);

  const [ragInsight, setRagInsight] = useState<RagInsight>({
    isActive: false,
    visualState: 'idle',
    logs: [],
    reasoning: null,
    retrievedNodeIds: [], // Union of seeds + traversed
    seedNodeIds: [],
    traversedNodeIds: []
  });

  // State for Documentation Modal
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  
  // Track current dataset for example questions
  const [currentDataset, setCurrentDataset] = useState<string>('default');

  // --- Handlers ---

  // Helper to handle the embedding process for any new data
  const processAndSetGraphData = async (data: GraphData, legend?: GroupLegend, sourceName: string = "Data") => {
    // 1. Set Initial Structure
    setGraphData(data);
    if (legend) setCurrentLegend(legend);

    // 2. Start Background Embedding
    setRagInsight(prev => ({
        ...prev,
        logs: [{ id: 'embed_init', stepName: 'Indexing', detail: `Calculating ${data.nodes.length} vector embeddings...`, status: 'active' }]
    }));

    try {
        const nodesWithEmbeddings = await embedGraphNodes(data.nodes);
        setGraphData(prev => ({ ...prev, nodes: nodesWithEmbeddings }));
        
        setChatHistory(prev => [
            ...prev,
            {
                id: Date.now().toString(),
                role: 'system',
                content: `Loaded ${sourceName}. Indexed ${nodesWithEmbeddings.length} nodes with ${config.embeddingModel}.`,
                timestamp: Date.now()
            }
        ]);
        setRagInsight(prev => ({ ...prev, logs: [], isActive: false }));
    } catch (e) {
        console.error("Embedding failed", e);
        setChatHistory(prev => [
            ...prev,
            { id: Date.now().toString(), role: 'system', content: `Warning: Failed to generate embeddings. Vector search may not work.`, timestamp: Date.now() }
        ]);
        setRagInsight(prev => ({ ...prev, logs: [], isActive: false }));
    }
  };


  const handleGenerateGraph = async (topic: string, isPaperMode: boolean) => {
    // Clear chat and set to default for generated graphs
    setChatHistory([]);
    setCurrentDataset('default');
    
    setRagInsight(prev => ({
       ...prev, 
       isActive: true,
       visualState: 'scanning',
       logs: [{ id: 'g1', stepName: 'Graph Gen', detail: isPaperMode ? `Simulating literature review on "${topic}"...` : `Constructing ontology for "${topic}"...`, status: 'active' }]
    }));
    
    try {
      const newData = isPaperMode 
        ? await generateGraphFromPaperTopic(topic) 
        : await generateGraphFromTopic(topic);
      
      // Generic legend for generated content
      let generatedLegend = {
        1: "Primary Concept",
        2: "Secondary Concept",
        3: "Related Entity",
        4: "Context"
      };

      if (isPaperMode) {
        generatedLegend = {
          1: "Core Disorder/Phenomenon",
          2: "Biological Factor",
          3: "Psychological Factor",
          4: "Social/Environmental Factor"
        };
      }

      const sourceLabel = isPaperMode ? `Research Model: "${topic}"` : `Generated Graph: "${topic}"`;
      await processAndSetGraphData(newData, generatedLegend, sourceLabel);
      
    } catch (err) {
      console.error(err);
      setChatHistory(prev => [
        ...prev,
        { id: Date.now().toString(), role: 'system', content: 'Failed to generate graph. Check API Key.', timestamp: Date.now() }
      ]);
      setRagInsight(prev => ({ ...prev, isActive: false, visualState: 'idle' }));
    }
  };

  const handleLoadDataset = async (type: 'primekg' | 'moviekg' | 'mentalhealth') => {
    let dataset = PRIME_KG_SAMPLE;
    let legend = PRIME_KG_LEGEND;
    let name = "PrimeKG (Expanded)";
    
    if (type === 'moviekg') {
      dataset = MOVIE_KG_SAMPLE;
      legend = MOVIE_KG_LEGEND;
      name = "IMDB Knowledge Graph";
    } else if (type === 'mentalhealth') {
      dataset = MENTAL_HEALTH_KG_SAMPLE;
      legend = MENTAL_HEALTH_KG_LEGEND;
      name = "Mental Health (Biopsychosocial)";
    }

    // Set current dataset for example questions
    setCurrentDataset(type);
    
    // Clear chat history for fresh start with new dataset
    setChatHistory([]);

    // Need to clone deep to avoid mutating constants during embedding
    const cleanNodes = dataset.nodes.map(n => ({...n}));
    const cleanLinks = dataset.links.map(l => ({...l}));
    
    await processAndSetGraphData({ nodes: cleanNodes, links: cleanLinks }, legend, name);
  };

  // Run initial embedding on mount for default data
  useEffect(() => {
     // Trigger embedding for initial nodes if they don't have it
     if (!showLanding && graphData.nodes.length > 0 && !graphData.nodes[0].embedding) {
         processAndSetGraphData(graphData, INITIAL_LEGEND, "Default Data");
     }
  }, [showLanding]); // Run when landing is closed

  const handleSendMessage = async (msg: string) => {
    // 1. User Message
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: msg, timestamp: Date.now() };
    setChatHistory(prev => [...prev, userMsg]);
    
    // 2. Init RAG State
    setRagInsight({
      isActive: true,
      visualState: 'scanning', // Start scanning animation
      logs: [],
      reasoning: null,
      retrievedNodeIds: [],
      seedNodeIds: [],
      traversedNodeIds: []
    });

    const logId1 = 'step_embed';
    const logId2 = 'step_retrieve';
    const logId3 = 'step_synth';

    // Log Step 1: Embedding
    setRagInsight(prev => ({
      ...prev,
      logs: [{ id: logId1, stepName: 'Vector Search', detail: `Embedding Query & Calculating Cosine Similarity...`, status: 'active' }]
    }));

    try {
      // NOTE: No fake delay here. We await the actual calculation.
      
      // 3. Call Real Algorithm
      const result = await performGraphRag(msg, graphData, config);
      
      setRagInsight(prev => ({
        ...prev,
        logs: prev.logs.map(l => l.id === logId1 ? { ...l, status: 'completed' } : l)
      }));

      const allActiveIds = [...(result.seedNodeIds || []), ...(result.traversedNodeIds || [])];

      // Log Step 2: Retrieval Results
      setRagInsight(prev => ({
        ...prev,
        logs: [...prev.logs, { id: logId2, stepName: 'Graph Traversal', detail: `Found ${result.seedNodeIds.length} Seeds, ${result.traversedNodeIds.length} Neighbors`, status: 'completed' }]
      }));

      // --- VISUALIZATION SEQUENCE ---
      
      // Phase A: Highlight Seeds (Blue)
      setRagInsight(prev => ({
        ...prev,
        visualState: 'seeds',
        seedNodeIds: result.seedNodeIds || [],
      }));

      await new Promise(r => setTimeout(r, 800)); // Short visual pause to let user see seeds

      // Phase B: Highlight Neighbors (Orange) - "Traversal"
      setRagInsight(prev => ({
        ...prev,
        visualState: 'traversing',
        traversedNodeIds: result.traversedNodeIds || [],
        retrievedNodeIds: allActiveIds, // Show edges now
      }));

      await new Promise(r => setTimeout(r, 800));

      // Phase C: Synthesis
      setRagInsight(prev => ({
        ...prev,
        visualState: 'complete',
        logs: [...prev.logs, { id: logId3, stepName: 'LLM Synthesis', detail: 'Generating answer from vectors...', status: 'active' }]
      }));

      // 4. Final Answer is already ready from performGraphRag, just displaying it
      const modelMsg: ChatMessage = { id: (Date.now() + 10).toString(), role: 'model', content: result.answer, timestamp: Date.now() };
      setChatHistory(prev => [...prev, modelMsg]);

      setRagInsight(prev => ({
        ...prev,
        isActive: false,
        reasoning: result.reasoning,
        logs: prev.logs.map(l => l.id === logId3 ? { ...l, status: 'completed' } : l)
      }));

    } catch (err) {
      console.error(err);
      setChatHistory(prev => [...prev, { id: Date.now().toString(), role: 'system', content: "Error in RAG pipeline.", timestamp: Date.now() }]);
      setRagInsight(prev => ({ ...prev, isActive: false, visualState: 'idle' }));
    }
  };

  const handleNodeClick = (nodeId: string) => {
    // Optional: Add logic to inspect node details
  };

  // --- RENDER ---
  // Refactored to allow DocsModal to overlay both Landing and Main App
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-black text-white font-sans selection:bg-blue-500 selection:text-white relative">
      
      {showLanding ? (
        <LandingPage 
            onEnter={() => setShowLanding(false)} 
            onOpenDocs={() => setIsDocsOpen(true)}
        />
      ) : (
        <div className="flex h-full w-full">
            <Sidebar 
                config={config} 
                setConfig={setConfig} 
                onGenerateGraph={handleGenerateGraph}
                onLoadDataset={handleLoadDataset}
                isGenerating={ragInsight.isActive && ragInsight.logs.some(l => l.stepName === 'Graph Gen')}
                onOpenDocs={() => setIsDocsOpen(true)}
            />

            <div className="flex-1 flex flex-col relative h-full">
                {/* Graph Area */}
                <div className="flex-1 bg-gray-950 relative">
                <GraphVisualizer 
                    data={graphData} 
                    activeNodeIds={ragInsight.retrievedNodeIds} 
                    seedNodeIds={ragInsight.seedNodeIds}
                    traversedNodeIds={ragInsight.traversedNodeIds}
                    visualState={ragInsight.visualState}
                    legend={currentLegend}
                    onNodeClick={handleNodeClick}
                />
                </div>
            </div>

            <RagPanel 
                messages={chatHistory} 
                onSendMessage={handleSendMessage}
                insight={ragInsight}
                allNodes={graphData.nodes || []}
                currentDataset={currentDataset}
            />
        </div>
      )}

      {/* Documentation Modal - Global Overlay */}
      <DocsModal isOpen={isDocsOpen} onClose={() => setIsDocsOpen(false)} />
    </div>
  );
};

export default App;