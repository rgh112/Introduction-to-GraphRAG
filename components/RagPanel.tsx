import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, RagInsight, GraphNode } from '../types';

interface RagPanelProps {
  messages: ChatMessage[];
  onSendMessage: (msg: string) => void;
  insight: RagInsight;
  allNodes: GraphNode[];
  currentDataset?: string;
}

// Example questions for each dataset
const EXAMPLE_QUESTIONS: Record<string, string[]> = {
  'primekg': [
    "What is the relationship between Aspirin and COX enzymes?",
    "How does Metformin affect blood glucose levels?",
    "What drugs target the dopamine pathway?",
    "Explain the mechanism of beta-blockers.",
  ],
  'mentalhealth': [
    "How does childhood trauma affect the HPA axis?",
    "What's the relationship between serotonin and depression?",
    "How do social factors contribute to anxiety disorders?",
    "Explain the dopamine hypothesis of ADHD.",
    "What biological factors link PTSD and substance abuse?",
  ],
  'moviekg': [
    "What movies has Christopher Nolan directed?",
    "Which actors appeared in The Dark Knight?",
    "What are some sci-fi movies about AI?",
    "How is Hans Zimmer connected to Inception?",
  ],
  'default': [
    "What are the main concepts in this graph?",
    "How are the central nodes connected?",
    "Explain the relationships in this knowledge graph.",
  ]
};

const RagPanel: React.FC<RagPanelProps> = ({ messages, onSendMessage, insight, allNodes, currentDataset }) => {
  const [input, setInput] = useState("");
  const [activeTab, setActiveTab] = useState<'process' | 'reasoning' | 'sources'>('process');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Get example questions for current dataset
  const exampleQuestions = EXAMPLE_QUESTIONS[currentDataset || 'default'] || EXAMPLE_QUESTIONS['default'];

  // Auto-switch to process tab when processing starts
  useEffect(() => {
    if (insight.isActive) {
      setActiveTab('process');
    } else if (insight.reasoning && !insight.isActive) {
      // Optional: switch to reasoning when done, or keep user on current tab
      // setActiveTab('reasoning');
    }
  }, [insight.isActive, insight.reasoning]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !insight.isActive) {
      onSendMessage(input);
      setInput("");
    }
  };

  const retrievedNodesData = allNodes.filter(n => insight.retrievedNodeIds.includes(n.id));

  return (
    <div className="flex flex-col h-full bg-gray-900 border-l border-gray-800 w-[420px] shadow-2xl z-10 font-sans">
      
      {/* 1. TOP: Chat Area (60% height) */}
      <div className="flex-1 flex flex-col min-h-0 border-b border-gray-800">
        {/* Chat Header */}
        <div className="p-3 bg-gray-950 border-b border-gray-800 flex justify-between items-center">
           <h3 className="text-sm font-bold text-gray-200">Q&A Interface</h3>
           <span className={`text-[10px] px-2 py-0.5 rounded-full ${insight.isActive ? 'bg-blue-900 text-blue-200 animate-pulse' : 'bg-gray-800 text-gray-500'}`}>
             {insight.isActive ? 'RAG Running...' : 'Ready'}
           </span>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900/50">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div 
                className={`max-w-[90%] rounded-lg p-3 text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none shadow-md' 
                    : msg.role === 'system'
                    ? 'bg-gray-800 text-gray-400 text-xs border border-gray-700 italic'
                    : 'bg-gray-800 text-gray-200 rounded-bl-none border border-gray-700 shadow-sm'
                }`}
              >
                {msg.content}
              </div>
              <span className="text-[10px] text-gray-600 mt-1 px-1">
                {msg.role === 'user' ? 'You' : msg.role === 'model' ? 'KG-RAG AI' : 'System'}
              </span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Example Questions (shown above input when no conversation yet) */}
        {messages.filter(m => m.role !== 'system').length === 0 && (
          <div className="px-3 py-2 bg-gray-900 border-t border-gray-800 max-h-[140px] overflow-y-auto">
            <div className="text-[10px] text-gray-500 mb-2">Try asking:</div>
            <div className="flex flex-wrap gap-1.5">
              {exampleQuestions.slice(0, 4).map((question, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (!insight.isActive) {
                      onSendMessage(question);
                    }
                  }}
                  disabled={insight.isActive}
                  className="px-2.5 py-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-blue-500/50 rounded-full text-[10px] text-gray-400 hover:text-white transition-all disabled:opacity-50 truncate max-w-full"
                  title={question}
                >
                  {question.length > 40 ? question.slice(0, 40) + '...' : question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-3 bg-gray-950 border-t border-gray-800">
          <form onSubmit={handleSubmit} className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={insight.isActive}
              placeholder="Ask a question..."
              className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-full py-2.5 px-4 pr-10 focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
            />
            <button 
              type="submit" 
              disabled={!input.trim() || insight.isActive}
              className="absolute right-1.5 top-1/2 transform -translate-y-1/2 w-7 h-7 flex items-center justify-center bg-blue-600 rounded-full text-white hover:bg-blue-500 disabled:opacity-0 transition-all"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></svg>
            </button>
          </form>
        </div>
      </div>

      {/* 2. BOTTOM: RAG Analysis Tabs (40% height) */}
      <div className="h-[40%] flex flex-col bg-gray-950 border-t-4 border-gray-900">
        {/* Tab Headers */}
        <div className="flex border-b border-gray-800 bg-gray-900">
          <button 
            onClick={() => setActiveTab('process')}
            className={`flex-1 py-2 text-xs font-medium border-b-2 transition-colors ${activeTab === 'process' ? 'border-blue-500 text-white bg-gray-800' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
          >
            Process Log
          </button>
          <button 
            onClick={() => setActiveTab('reasoning')}
            className={`flex-1 py-2 text-xs font-medium border-b-2 transition-colors ${activeTab === 'reasoning' ? 'border-purple-500 text-white bg-gray-800' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
          >
            Reasoning Path
          </button>
          <button 
            onClick={() => setActiveTab('sources')}
            className={`flex-1 py-2 text-xs font-medium border-b-2 transition-colors ${activeTab === 'sources' ? 'border-amber-500 text-white bg-gray-800' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
          >
            Sources ({retrievedNodesData.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-950">
          
          {/* TAB: PROCESS */}
          {activeTab === 'process' && (
            <div className="space-y-3">
              {insight.logs.length === 0 ? (
                 <div className="text-gray-600 text-xs italic text-center mt-4">Waiting for query...</div>
              ) : (
                insight.logs.map((log) => (
                  <div key={log.id} className="flex items-start gap-3 text-xs font-mono group">
                    <div className="mt-0.5">
                      {log.status === 'completed' && <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>}
                      {log.status === 'active' && <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></div>}
                      {log.status === 'pending' && <div className="w-2 h-2 rounded-full bg-gray-700"></div>}
                    </div>
                    <div className="flex-1">
                      <div className={`font-bold ${log.status === 'active' ? 'text-blue-400' : 'text-gray-300'}`}>
                        {log.stepName}
                      </div>
                      <div className="text-gray-500 mt-0.5">{log.detail}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB: REASONING */}
          {activeTab === 'reasoning' && (
            <div className="text-sm text-gray-300 leading-relaxed font-mono whitespace-pre-wrap">
              {insight.reasoning ? (
                <div className="p-3 bg-gray-900 rounded border border-gray-800/50">
                  <div className="text-xs text-purple-400 mb-2 font-bold uppercase tracking-wider">Logic Trace</div>
                  {insight.reasoning}
                </div>
              ) : (
                <div className="text-gray-600 text-xs italic text-center mt-4">
                  {insight.isActive ? "Generating reasoning..." : "No reasoning data available."}
                </div>
              )}
            </div>
          )}

          {/* TAB: SOURCES */}
          {activeTab === 'sources' && (
            <div className="space-y-2">
              {retrievedNodesData.length > 0 ? (
                retrievedNodesData.map(node => (
                  <div key={node.id} className="p-3 bg-gray-900 rounded border border-gray-800 hover:border-amber-500/50 transition-colors cursor-default">
                    <div className="flex justify-between items-start mb-1">
                      <div className="text-sm font-bold text-amber-500">{node.label}</div>
                      <div className="text-[10px] bg-gray-800 px-1.5 py-0.5 rounded text-gray-400">Group {node.group}</div>
                    </div>
                    <div className="text-xs text-gray-400 leading-snug">{node.description || "No description available."}</div>
                  </div>
                ))
              ) : (
                <div className="text-gray-600 text-xs italic text-center mt-4">
                   {insight.isActive ? "Searching knowledge graph..." : "No nodes retrieved."}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RagPanel;