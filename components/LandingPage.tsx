import React, { useEffect, useState } from 'react';

declare global {
  interface Window {
    katex?: {
      render: (tex: string, element: HTMLElement, options?: object) => void;
      renderToString: (tex: string, options?: object) => string;
    };
  }
}

interface LandingPageProps {
  onEnter: () => void;
  onOpenDocs: () => void;
}

// LaTeX Math Component using KaTeX
const Math: React.FC<{ children: string; display?: boolean }> = ({ children, display = false }) => {
  const [html, setHtml] = useState<string | null>(null);
  
  useEffect(() => {
    let cancelled = false;
    let intervalId: ReturnType<typeof setInterval> | null = null;
    
    const tryRender = () => {
      const katex = (window as any).katex;
      if (katex && typeof katex.renderToString === 'function') {
        try {
          const rendered = katex.renderToString(children, {
            throwOnError: false,
            displayMode: display,
          });
          if (!cancelled) {
            setHtml(rendered);
          }
          return true;
        } catch (e) {
          console.warn('KaTeX render error:', e);
        }
      }
      return false;
    };

    // Try immediately
    if (!tryRender()) {
      // Poll for KaTeX to load
      intervalId = setInterval(() => {
        if (tryRender() && intervalId) {
          clearInterval(intervalId);
        }
      }, 100);
      
      // Give up after 5 seconds
      setTimeout(() => {
        if (intervalId) {
          clearInterval(intervalId);
        }
      }, 5000);
    }
    
    return () => {
      cancelled = true;
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [children, display]);
  
  // Show fallback while loading or if failed
  if (html === null) {
    if (display) {
      return <div className="my-4 text-center text-lg font-mono text-gray-500">{children}</div>;
    }
    return <span className="font-mono text-gray-500">{children}</span>;
  }
  
  if (display) {
    return <div className="my-4 text-center" dangerouslySetInnerHTML={{ __html: html }} />;
  }
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
};


const LandingPage: React.FC<LandingPageProps> = ({ onEnter, onOpenDocs }) => {
  const handleScrollToFeatures = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-gray-300 font-sans overflow-y-auto selection:bg-blue-500/30 selection:text-blue-200 scroll-smooth">
      
      {/* Background Grid & Gradient */}
      <div className="fixed inset-0 pointer-events-none opacity-10" 
           style={{ 
             backgroundImage: 'linear-gradient(#30363d 1px, transparent 1px), linear-gradient(90deg, #30363d 1px, transparent 1px)', 
             backgroundSize: '30px 30px',
             maskImage: 'radial-gradient(circle at center, black 50%, transparent 100%)'
           }}>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-gray-800 bg-[#0d1117]/80 backdrop-blur-md sticky top-0">
        <div className="w-full px-6 md:px-10 lg:px-16 xl:px-24 h-16 flex items-center justify-between">
          <div className="text-lg font-bold flex items-center gap-3 font-mono">
            <div className="w-6 h-6 bg-gradient-to-tr from-blue-600 to-purple-600 rounded flex items-center justify-center text-[10px] text-white">KG</div>
            <span className="text-gray-100">graph-rag-platform</span>
            <span className="px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 text-[10px] border border-gray-700">v2.0.0 (Edu-Edition)</span>
          </div>
          <div className="flex items-center gap-6">
            <button 
                onClick={onOpenDocs}
                className="text-sm font-medium text-gray-400 hover:text-white transition-colors hover:underline decoration-blue-500 decoration-2 underline-offset-4"
            >
                System Architecture
            </button>
            <button 
                onClick={onEnter}
                className="px-4 py-2 bg-[#238636] hover:bg-[#2ea043] text-white text-sm font-bold rounded-md border border-[rgba(240,246,252,0.1)] transition-all shadow-sm"
            >
                Start Demo
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative z-10 pt-24 pb-20 px-6 md:px-10 lg:px-16 xl:px-24 text-center border-b border-gray-800">
        <div className="w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/20 border border-blue-800/50 text-blue-400 text-xs font-mono mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Logic for LLMs
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-white">
            Connecting the Dots <br/> in <span className="text-blue-400 font-mono">Artificial Intelligence</span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10">
            Why do smart chatbots make mistakes? Because they lack a map. <br/>
            <strong>Graph RAG</strong> gives AI a structured brain to reason with.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
             <button 
              onClick={onEnter}
              className="px-8 py-3 bg-white text-gray-900 hover:bg-gray-100 rounded-md font-bold transition-all"
            >
              Run Interactive Demo
            </button>
            <button
              onClick={handleScrollToFeatures}
              className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-md font-medium border border-gray-700 transition-all font-mono text-sm"
            >
              Read the Concept Guide ↓
            </button>
          </div>
        </div>
      </header>

      {/* Deep Dive Content */}
      <section id="how-it-works" className="relative z-10 py-20 px-6 md:px-10 lg:px-16 xl:px-24">
        <div className="w-full">
          
          <div className="mb-12 border-b border-gray-800 pb-4">
             <h2 className="text-3xl font-bold text-white flex items-center gap-3">
               <span className="text-blue-500">#</span> The Logic Behind GraphRAG
             </h2>
             <p className="text-gray-500 mt-2 font-mono text-sm">A plain-english guide to the next generation of AI search.</p>
          </div>

          <article className="prose prose-invert max-w-none prose-headings:text-gray-200 prose-p:text-gray-400 prose-strong:text-white prose-code:text-blue-300">
             
             {/* 1. LLM Basics */}
             <div className="mb-20">
               <h3 className="text-2xl font-bold mb-6 text-white border-l-4 border-blue-500 pl-4">1. Why do we need "RAG"?</h3>
               
               <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800 mb-6">
                  <h4 className="font-bold text-white mb-2">The "Autocomplete" Problem</h4>
                  <p className="text-gray-400 mb-4">
                    Think of an LLM (Large Language Model) like a super-advanced <strong>autocomplete</strong> on your phone. 
                    It is incredibly good at predicting the next word to make a smooth sentence.
                  </p>
                  <ul className="list-disc pl-5 text-sm text-gray-400 space-y-2">
                    <li>It <strong>can</strong> write a poem or summarize a generic topic.</li>
                    <li>It <strong>cannot</strong> know about your private company data or news that happened today.</li>
                    <li>When it doesn't know, it often <strong>hallucinates</strong> (makes things up convincingly).</li>
                  </ul>
               </div>

               <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
                  <h4 className="font-bold text-white mb-2">The Solution: RAG (Chatbot + Librarian)</h4>
                  <p className="text-gray-400 mb-4">
                    <strong>RAG (Retrieval-Augmented Generation)</strong> is like giving the chatbot a library card.
                  </p>
                  <ol className="list-decimal pl-5 text-sm text-gray-400 space-y-2">
                     <li>You ask a question.</li>
                     <li>The "Librarian" (Retriever) runs to the bookshelf and pulls out relevant pages.</li>
                     <li>The "Chatbot" (Generator) reads those pages and summarizes the answer.</li>
                  </ol>
               </div>

               {/* Figure 1: RAG Process */}
               <div className="mt-8">
                 <div className="bg-[#161b22] border border-gray-700 rounded-xl p-4 overflow-hidden">
                   <img 
                     src="/fig1.PNG" 
                     alt="RAG Process: Indexing, Retrieval, and Generation" 
                     className="w-full rounded-lg"
                   />
                   <div className="mt-4 px-2">
                     <p className="text-xs text-gray-500 font-mono mb-2">Figure 1: The RAG Process</p>
                     <p className="text-sm text-gray-400">
                       A representative instance of the RAG process: <strong className="text-blue-400">1) Indexing</strong> — Documents are split into chunks, encoded into vectors, and stored. 
                       <strong className="text-emerald-400"> 2) Retrieval</strong> — Find the Top-k most relevant chunks based on semantic similarity. 
                       <strong className="text-purple-400"> 3) Generation</strong> — Input the question and retrieved chunks into LLM to generate the answer.
                     </p>
                   </div>
                 </div>
               </div>
             </div>

             {/* RAG Evolution Section */}
             <div className="mb-20">
               <h3 className="text-2xl font-bold mb-6 text-white border-l-4 border-indigo-500 pl-4">2. The Evolution of RAG</h3>
               <p className="mb-6 leading-relaxed">
                 RAG has evolved through three major paradigms, each addressing limitations of the previous approach.
               </p>

               {/* Figure 2: Three RAG Paradigms */}
               <div className="bg-[#161b22] border border-gray-700 rounded-xl p-4 overflow-hidden mb-8">
                 <img 
                   src="/fig2.PNG" 
                   alt="Comparison of Naive RAG, Advanced RAG, and Modular RAG" 
                   className="w-full rounded-lg"
                 />
                 <div className="mt-4 px-2">
                   <p className="text-xs text-gray-500 font-mono mb-2">Figure 2: The Three Paradigms of RAG</p>
                   <div className="grid md:grid-cols-3 gap-4 mt-4">
                     <div className="text-xs">
                       <span className="text-blue-400 font-bold">Naive RAG:</span>
                       <span className="text-gray-400"> Simple chain — indexing → retrieval → generation</span>
                     </div>
                     <div className="text-xs">
                       <span className="text-emerald-400 font-bold">Advanced RAG:</span>
                       <span className="text-gray-400"> Adds pre/post-retrieval optimization strategies</span>
                     </div>
                     <div className="text-xs">
                       <span className="text-purple-400 font-bold">Modular RAG:</span>
                       <span className="text-gray-400"> Flexible modules, iterative & adaptive retrieval</span>
                     </div>
                   </div>
                 </div>
               </div>

               {/* Figure 3: RAG vs Other Methods */}
               <div className="bg-[#161b22] border border-gray-700 rounded-xl p-4 overflow-hidden">
                 <img 
                   src="/fig3.PNG" 
                   alt="RAG compared with Prompt Engineering and Fine-tuning" 
                   className="w-full rounded-lg"
                 />
                 <div className="mt-4 px-2">
                   <p className="text-xs text-gray-500 font-mono mb-2">Figure 3: RAG in the Model Optimization Landscape</p>
                   <p className="text-sm text-gray-400">
                     Comparison across two dimensions: <strong className="text-amber-400">"External Knowledge Required"</strong> and <strong className="text-rose-400">"Model Adaptation Required"</strong>. 
                     RAG starts with low model modification needs (Naive RAG) but integrates more with fine-tuning as it evolves (Modular RAG).
                   </p>
                 </div>
               </div>
             </div>

             {/* 2. The Limits of Text RAG */}
             <div className="mb-20">
               <h3 className="text-2xl font-bold mb-6 text-white border-l-4 border-red-500 pl-4">3. The Problem: "Scattered Puzzle Pieces"</h3>
               <p className="mb-6 leading-relaxed">
                 Standard RAG cuts documents into small text chunks and finds the ones that "look similar" to your question. 
                 But text chunks are like <strong>scattered puzzle pieces</strong>—they lose their connections.
               </p>

               <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-[#161b22] border border-gray-700 rounded-lg p-5">
                    <div className="text-red-400 font-bold mb-2 text-sm uppercase">Scenario: Traditional RAG</div>
                    <p className="text-xs text-gray-400 mb-3">Query: "How does <strong>Stress</strong> eventually cause a <strong>Heart Attack</strong>?"</p>
                    <div className="space-y-2">
                        <div className="p-2 bg-gray-800 rounded border border-gray-700 text-xs">
                           📄 Doc A: "Stress increases <strong>Cortisol</strong>."
                        </div>
                        <div className="p-2 bg-gray-800 rounded border border-gray-700 text-xs">
                           📄 Doc B: "High Blood Pressure leads to <strong>Heart Attack</strong>."
                        </div>
                    </div>
                    <div className="mt-3 text-xs text-red-300">
                       ❌ <strong>Failure:</strong> The chatbot retrieves Doc A (matches "Stress") and Doc B (matches "Heart Attack"), but it misses the middle link. It doesn't know how Cortisol relates to Blood Pressure.
                    </div>
                  </div>

                  <div className="bg-[#161b22] border border-gray-700 rounded-lg p-5 flex items-center justify-center">
                     <svg className="w-full h-40" viewBox="0 0 200 120">
                        {/* Disconnected dots */}
                        <circle cx="40" cy="40" r="10" fill="#374151" />
                        <text x="40" y="65" textAnchor="middle" fill="#6b7280" fontSize="8">Stress</text>
                        
                        <circle cx="160" cy="80" r="10" fill="#374151" />
                        <text x="160" y="105" textAnchor="middle" fill="#6b7280" fontSize="8">Heart Attack</text>

                        <circle cx="100" cy="60" r="10" fill="#1f2937" stroke="#374151" strokeDasharray="2 2" />
                        <text x="100" y="63" textAnchor="middle" fill="#4b5563" fontSize="8">?</text>
                        
                        <text x="100" y="20" textAnchor="middle" fill="#ef4444" fontSize="10" fontWeight="bold">Missing Link</text>
                     </svg>
                  </div>
               </div>
             </div>

             {/* 3. Graph Basics */}
             <div className="mb-20">
               <h3 className="text-2xl font-bold mb-6 text-white border-l-4 border-emerald-500 pl-4">4. Enter the Graph: "The Subway Map"</h3>
               <p className="mb-6 leading-relaxed">
                 To fix this, we organize information into a <strong>Knowledge Graph</strong>. Think of it like a <strong>Subway Map</strong> or a Detective's Pinboard.
               </p>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-900 p-4 rounded border border-gray-800 text-center">
                     <div className="text-2xl mb-2">●</div>
                     <h4 className="font-bold text-white mb-1">Nodes (Dots)</h4>
                     <p className="text-xs text-gray-400">The "Things". People, places, drugs, concepts.</p>
                  </div>
                  <div className="bg-gray-900 p-4 rounded border border-gray-800 text-center">
                     <div className="text-2xl mb-2">──</div>
                     <h4 className="font-bold text-white mb-1">Edges (Lines)</h4>
                     <p className="text-xs text-gray-400">The "Relationships". A <i>causes</i> B, X <i>is friends with</i> Y.</p>
                  </div>
                  <div className="bg-gray-900 p-4 rounded border border-gray-800 text-center">
                     <div className="text-2xl mb-2">●─●─●</div>
                     <h4 className="font-bold text-white mb-1">Paths</h4>
                     <p className="text-xs text-gray-400">The "Story". How you get from one idea to another.</p>
                  </div>
               </div>
             </div>

             {/* 4. Multi-hop Reasoning */}
             <div className="mb-20">
               <h3 className="text-2xl font-bold mb-6 text-white border-l-4 border-purple-500 pl-4">5. The Superpower: Multi-hop Reasoning</h3>
               <p className="mb-6 leading-relaxed">
                 The biggest advantage of GraphRAG is <strong>Multi-hop Reasoning</strong>. This is the ability to connect facts that are steps away from each other—like transferring trains to reach a destination.
               </p>
               
               <div className="bg-[#161b22] border border-gray-700 rounded-lg p-6 overflow-hidden">
                  <div className="text-xs font-mono text-gray-500 mb-4 border-b border-gray-800 pb-2">Figure 2: Following the Logic Path</div>
                  <svg className="w-full h-32" viewBox="0 0 600 120">
                      {/* Path Animation */}
                      <path d="M 50 60 L 550 60" stroke="#1f2937" strokeWidth="4" />
                      
                      {/* Node 1 */}
                      <circle cx="50" cy="60" r="15" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="2" />
                      <text x="50" y="95" textAnchor="middle" fill="white" fontSize="10">Stress</text>
                      
                      {/* Arrow 1 */}
                      <line x1="65" y1="60" x2="185" y2="60" stroke="#60a5fa" strokeWidth="2" markerEnd="url(#arrow)" />
                      <text x="125" y="50" textAnchor="middle" fill="#60a5fa" fontSize="9">increases</text>

                      {/* Node 2 */}
                      <circle cx="200" cy="60" r="15" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="2" />
                      <text x="200" y="95" textAnchor="middle" fill="white" fontSize="10">Cortisol</text>

                      {/* Arrow 2 */}
                      <line x1="215" y1="60" x2="335" y2="60" stroke="#60a5fa" strokeWidth="2" markerEnd="url(#arrow)" />
                      <text x="275" y="50" textAnchor="middle" fill="#60a5fa" fontSize="9">raises</text>

                      {/* Node 3 */}
                      <circle cx="350" cy="60" r="15" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="2" />
                      <text x="350" y="95" textAnchor="middle" fill="white" fontSize="10">Blood Pressure</text>

                      {/* Arrow 3 */}
                      <line x1="365" y1="60" x2="485" y2="60" stroke="#60a5fa" strokeWidth="2" markerEnd="url(#arrow)" />
                      <text x="425" y="50" textAnchor="middle" fill="#60a5fa" fontSize="9">risks</text>

                      {/* Node 4 */}
                      <circle cx="500" cy="60" r="15" fill="#7f1d1d" stroke="#ef4444" strokeWidth="2" />
                      <text x="500" y="95" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Heart Attack</text>
                      
                      <defs>
                          <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                              <path d="M0,0 L0,6 L9,3 z" fill="#60a5fa" />
                          </marker>
                      </defs>
                  </svg>
                  <div className="mt-4 bg-black/40 p-3 rounded text-sm text-gray-300">
                     <span className="text-blue-400 font-bold">Inference:</span> Even though "Stress" and "Heart Attack" might not appear in the same sentence in any document, the GraphRAG system "hops" through <i>Cortisol</i> and <i>Blood Pressure</i> to find the answer.
                  </div>
               </div>
             </div>

             {/* 5. What is GraphRAG? */}
             <div className="mb-20">
                <h3 className="text-2xl font-bold mb-6 text-white border-l-4 border-amber-500 pl-4">6. Putting It Together: GraphRAG</h3>
                <p className="mb-6 text-gray-400">
                   So, simply put, <strong>GraphRAG</strong> is the process of combining that "Detective Board" (Knowledge Graph) with the "Librarian" (RAG).
                </p>

                <div className="overflow-hidden border border-gray-700 rounded-lg bg-gray-900/30">
                  <table className="w-full text-sm text-left">
                     <thead className="bg-gray-800 text-gray-200">
                        <tr>
                           <th className="px-6 py-3 font-medium border-r border-gray-700">Feature</th>
                           <th className="px-6 py-3 font-medium border-r border-gray-700 w-1/3">Traditional RAG</th>
                           <th className="px-6 py-3 font-medium text-blue-400">Graph RAG</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-800">
                        <tr>
                           <td className="px-6 py-4 font-bold text-gray-300 border-r border-gray-800">Search Method</td>
                           <td className="px-6 py-4 text-gray-500 border-r border-gray-800">Keyword / Similarity Match</td>
                           <td className="px-6 py-4 text-gray-300">Similarity + <span className="text-blue-400">Graph Traversal</span></td>
                        </tr>
                        <tr>
                           <td className="px-6 py-4 font-bold text-gray-300 border-r border-gray-800">Data View</td>
                           <td className="px-6 py-4 text-gray-500 border-r border-gray-800">Isolated Text Chunks</td>
                           <td className="px-6 py-4 text-gray-300"><span className="text-blue-400">Interconnected Web</span></td>
                        </tr>
                        <tr>
                           <td className="px-6 py-4 font-bold text-gray-300 border-r border-gray-800">Best For</td>
                           <td className="px-6 py-4 text-gray-500 border-r border-gray-800">Simple Fact Lookup</td>
                           <td className="px-6 py-4 text-gray-300"><span className="text-blue-400">Complex Reasoning & "Why" Questions</span></td>
                        </tr>
                     </tbody>
                  </table>
               </div>
               
               <div className="mt-8 bg-gray-950 p-6 rounded-lg border border-gray-800 font-mono text-sm shadow-inner">
                 <p className="text-gray-500 mb-2 italic">// The Mathematical Idea (Simplified)</p>
                 <div className="text-gray-300 leading-relaxed text-center text-lg">
                   P(Answer | Query, <span className="text-emerald-500">Graph</span>)
                 </div>
                 <p className="mt-2 text-center text-xs text-gray-500">
                    "The probability of a good answer depends on the Query AND the connections in the Graph."
                 </p>
               </div>

               {/* Figure 4: Traditional RAG vs GraphRAG */}
               <div className="mt-8 bg-[#161b22] border border-gray-700 rounded-xl p-4 overflow-hidden">
                 <img 
                   src="/fig4.PNG" 
                   alt="Traditional RAG vs GraphRAG Comparison" 
                   className="w-full rounded-lg"
                 />
                 <div className="mt-4 px-2">
                   <p className="text-xs text-gray-500 font-mono mb-3">Figure 4: Traditional RAG vs GraphRAG</p>
                   <div className="grid md:grid-cols-2 gap-4 text-xs">
                     <div className="bg-black/30 p-3 rounded-lg">
                       <h5 className="text-blue-400 font-bold mb-2">Key Advantages of GraphRAG:</h5>
                       <ul className="text-gray-400 space-y-1">
                         <li>• <strong className="text-white">Enhanced Knowledge Representation</strong> — Captures complex relationships & hierarchies</li>
                         <li>• <strong className="text-white">Flexibility in Knowledge Sources</strong> — Integrates structured, semi-structured & unstructured data</li>
                       </ul>
                     </div>
                     <div className="bg-black/30 p-3 rounded-lg">
                       <ul className="text-gray-400 space-y-1">
                         <li>• <strong className="text-white">Efficiency & Scalability</strong> — 26-97% fewer tokens, real-time updates</li>
                         <li>• <strong className="text-white">Interpretability</strong> — Trace reasoning paths through the knowledge graph</li>
                       </ul>
                     </div>
                   </div>
                 </div>
               </div>

             </div>

          </article>

          {/* GraphRAG Taxonomy Section */}
          <div className="mt-20 pt-16 border-t border-gray-800">
            <div className="mb-12 border-b border-gray-800 pb-4">
              <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                <span className="text-orange-500">🗺️</span> GraphRAG Taxonomy
              </h2>
              <p className="text-gray-500 mt-2 font-mono text-sm">A comprehensive map of GraphRAG variants and research directions</p>
            </div>

            {/* Three Main Paradigms */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold mb-8 text-white border-l-4 border-orange-500 pl-4">
                1. The Three Main Paradigms
              </h3>
              <p className="text-gray-400 mb-6">
                Current GraphRAG research can be categorized into three major paradigms based on the role of the graph:
              </p>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Knowledge-based */}
                <div className="bg-gradient-to-br from-blue-950/40 to-blue-900/20 border border-blue-700/30 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-xl">🧠</div>
                    <h4 className="text-white font-bold text-lg">Knowledge-based</h4>
                  </div>
                  <p className="text-blue-200 text-sm mb-4">Graph = Knowledge Carrier</p>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    The graph itself serves as the knowledge source. Build a Knowledge Graph (KG), 
                    perform query/reasoning/path traversal on it, then pass results to LLM for answer generation.
                  </p>
                  <div className="mt-4 pt-4 border-t border-blue-800/30">
                    <p className="text-xs text-gray-500 font-mono">Pipeline:</p>
                    <p className="text-xs text-blue-300 mt-1">Text → KG → Subgraph Retrieval → LLM Answer</p>
                  </div>
                </div>

                {/* Index-based */}
                <div className="bg-gradient-to-br from-emerald-950/40 to-emerald-900/20 border border-emerald-700/30 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-xl">📑</div>
                    <h4 className="text-white font-bold text-lg">Index-based</h4>
                  </div>
                  <p className="text-emerald-200 text-sm mb-4">Graph = Indexing Structure</p>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    Original documents remain intact. The graph connects documents/passages/topics 
                    as an "index structure" - a map showing where content exists and how it relates.
                  </p>
                  <div className="mt-4 pt-4 border-t border-emerald-800/30">
                    <p className="text-xs text-gray-500 font-mono">Pipeline:</p>
                    <p className="text-xs text-emerald-300 mt-1">Docs → Index Graph → Graph Search → Retrieve Text → LLM</p>
                  </div>
                </div>

                {/* Hybrid */}
                <div className="bg-gradient-to-br from-purple-950/40 to-purple-900/20 border border-purple-700/30 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center text-xl">🔀</div>
                    <h4 className="text-white font-bold text-lg">Hybrid</h4>
                  </div>
                  <p className="text-purple-200 text-sm mb-4">Graph = Both Combined</p>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    Combines both approaches: Use KG for concepts/relations, use index graph 
                    for locating actual text (papers, manuals), then provide both to LLM.
                  </p>
                  <div className="mt-4 pt-4 border-t border-purple-800/30">
                    <p className="text-xs text-gray-500 font-mono">Pipeline:</p>
                    <p className="text-xs text-purple-300 mt-1">KG + Index Graph → Combined Search → LLM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Knowledge-based GraphRAG */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold mb-8 text-white border-l-4 border-blue-500 pl-4">
                2. Knowledge-based GraphRAG
              </h3>

              {/* 2-1: Corpus-derived KG */}
              <div className="mb-8">
                <h4 className="text-lg font-bold text-blue-400 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-600/30 rounded flex items-center justify-center text-xs border border-blue-500">A</span>
                  Building KG from Corpus
                </h4>
                <p className="text-gray-400 text-sm mb-4">
                  Extract entities and relations from documents to build domain-specific knowledge graphs, then run RAG on them.
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-[#0d1117] border border-gray-800 rounded-lg p-4">
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="px-2 py-1 bg-blue-900/50 border border-blue-700/50 rounded text-xs text-blue-300">StructRAG</span>
                      <span className="px-2 py-1 bg-blue-900/50 border border-blue-700/50 rounded text-xs text-blue-300">MS GraphRAG</span>
                      <span className="px-2 py-1 bg-blue-900/50 border border-blue-700/50 rounded text-xs text-blue-300">FastRAG</span>
                      <span className="px-2 py-1 bg-blue-900/50 border border-blue-700/50 rounded text-xs text-blue-300">QUEST</span>
                    </div>
                    <p className="text-xs text-gray-500">Convert documents to KG format, traverse graph to find relevant nodes/paths/subgraphs, pass to LLM.</p>
                  </div>
                  <div className="bg-[#0d1117] border border-gray-800 rounded-lg p-4">
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="px-2 py-1 bg-blue-900/50 border border-blue-700/50 rounded text-xs text-blue-300">LightRAG</span>
                      <span className="px-2 py-1 bg-blue-900/50 border border-blue-700/50 rounded text-xs text-blue-300">MedRAG</span>
                      <span className="px-2 py-1 bg-blue-900/50 border border-blue-700/50 rounded text-xs text-blue-300">GraphReader</span>
                      <span className="px-2 py-1 bg-blue-900/50 border border-blue-700/50 rounded text-xs text-blue-300">HippoRAG</span>
                    </div>
                    <p className="text-xs text-gray-500">Domain-specific KG construction (medical, technical docs). Strong at multi-hop queries.</p>
                  </div>
                </div>
              </div>

              {/* 2-2: Using Existing KG */}
              <div>
                <h4 className="text-lg font-bold text-blue-400 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-600/30 rounded flex items-center justify-center text-xs border border-blue-500">B</span>
                  Using Existing Knowledge Graphs
                </h4>
                <p className="text-gray-400 text-sm mb-4">
                  Leverage existing KGs like Wikidata, domain KGs, or legacy KGs directly.
                </p>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-[#0d1117] border border-gray-800 rounded-lg p-4">
                    <h5 className="text-white font-bold text-sm mb-2">KnowGPT</h5>
                    <p className="text-xs text-gray-500">Uses RL to learn "which path to traverse" policy on existing KGs.</p>
                  </div>
                  <div className="bg-[#0d1117] border border-gray-800 rounded-lg p-4">
                    <h5 className="text-white font-bold text-sm mb-2">ToG / ToG 2.0</h5>
                    <p className="text-xs text-gray-500">LLM plans reasoning paths on graph, fetches subgraphs accordingly. Strong multi-step reasoning.</p>
                  </div>
                  <div className="bg-[#0d1117] border border-gray-800 rounded-lg p-4">
                    <h5 className="text-white font-bold text-sm mb-2">RoG</h5>
                    <p className="text-xs text-gray-500">Emphasizes path-level reasoning on KG. LLM uses graph paths as logical chains.</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {['KGR', 'KELP', 'ProLLM', 'SubGraphRAG', 'PoG', 'LEGO-GraphRAG', 'KnowNet'].map(name => (
                    <span key={name} className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs text-gray-400">{name}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Index-based GraphRAG */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold mb-8 text-white border-l-4 border-emerald-500 pl-4">
                3. Index-based GraphRAG
              </h3>
              <p className="text-gray-400 mb-6">
                Original text remains intact. Build a graph connecting documents/passages/topics as a "search map."
              </p>

              <div className="bg-[#0d1117] border border-gray-800 rounded-lg p-6 mb-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="text-emerald-400 font-bold text-sm mb-3">Node Types</h5>
                    <ul className="text-xs text-gray-400 space-y-1">
                      <li>• Documents, sections, passages</li>
                      <li>• Topics, summary nodes</li>
                      <li>• Entity mentions</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-emerald-400 font-bold text-sm mb-3">Edge Types</h5>
                    <ul className="text-xs text-gray-400 space-y-1">
                      <li>• Semantic similarity</li>
                      <li>• Citation relationships</li>
                      <li>• Same topic / Causal / Temporal order</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-emerald-950/30 to-emerald-900/10 border border-emerald-800/30 rounded-lg p-5">
                  <h5 className="text-white font-bold mb-2">RAPTOR</h5>
                  <p className="text-xs text-gray-400 mb-3">
                    Hierarchically clusters passages into tree/graph structure. Searches from top-level topics down to specific content.
                  </p>
                  <p className="text-xs text-emerald-400 font-mono">"First the forest, then the trees"</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-950/30 to-emerald-900/10 border border-emerald-800/30 rounded-lg p-5">
                  <h5 className="text-white font-bold mb-2">HippoRAG / HippoRAG2</h5>
                  <p className="text-xs text-gray-400 mb-3">
                    Connects documents like "hyperlinked memory" graph. Narrows down related areas through graph traversal.
                  </p>
                  <p className="text-xs text-emerald-400 font-mono">Memory-inspired retrieval</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {['GraphRetriever', 'KAR', 'GNN-ret', 'PG-RAG', 'KGP', 'GraphCoder', 'ArchRAG'].map(name => (
                  <span key={name} className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs text-gray-400">{name}</span>
                ))}
              </div>

              <div className="mt-6 p-4 bg-emerald-950/20 border border-emerald-800/30 rounded-lg">
                <p className="text-sm text-emerald-300">
                  <strong>TL;DR:</strong> "Organize documents as a graph, then use graph traversal + embeddings to smartly decide which documents to read first."
                </p>
              </div>
            </div>

            {/* Hybrid GraphRAG */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold mb-8 text-white border-l-4 border-purple-500 pl-4">
                4. Hybrid GraphRAG
              </h3>
              <p className="text-gray-400 mb-6">
                Combines the strengths of both Knowledge-based and Index-based approaches.
              </p>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-[#0d1117] border border-purple-800/30 rounded-lg p-5">
                  <h5 className="text-purple-400 font-bold mb-2">GoR (Graph-of-Retrieval)</h5>
                  <p className="text-xs text-gray-400">Uses both graph knowledge structure + text index to decide traversal steps.</p>
                </div>
                <div className="bg-[#0d1117] border border-purple-800/30 rounded-lg p-5">
                  <h5 className="text-purple-400 font-bold mb-2">MedGraphRAG</h5>
                  <p className="text-xs text-gray-400">Medical domain: KG (disease-drug-symptom relations) + original text (papers, guidelines).</p>
                </div>
                <div className="bg-[#0d1117] border border-purple-800/30 rounded-lg p-5">
                  <h5 className="text-purple-400 font-bold mb-2">KG2RAG / HYBGRAG</h5>
                  <p className="text-xs text-gray-400">KG identifies important concepts, index graph locates specific documents. Both provided to LLM.</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-purple-950/20 border border-purple-800/30 rounded-lg">
                <p className="text-sm text-purple-300">
                  <strong>Division of Labor:</strong> "Concepts & relations via KG, actual text via index graph"
                </p>
              </div>
            </div>

            {/* Retrieval Techniques */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold mb-8 text-white border-l-4 border-rose-500 pl-4">
                5. Retrieval Techniques
              </h3>
              <p className="text-gray-400 mb-6">
                How to extract subgraphs/paths from the graph? Different approaches classified by technique:
              </p>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-[#0d1117] border border-gray-800 rounded-lg p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-rose-600/30 rounded flex items-center justify-center">
                      <span className="text-rose-400 text-sm">~</span>
                    </div>
                    <h5 className="text-rose-400 font-bold">Similarity-based</h5>
                  </div>
                  <p className="text-xs text-gray-400 mb-3">Score nodes/subgraphs using embedding similarity</p>
                  <div className="flex flex-wrap gap-1">
                    {['PG-RAG', 'GraphCoder', 'MedGraphRAG', 'G-Retriever'].map(n => (
                      <span key={n} className="px-1.5 py-0.5 bg-rose-900/30 rounded text-[10px] text-rose-300">{n}</span>
                    ))}
                  </div>
                </div>

                <div className="bg-[#0d1117] border border-gray-800 rounded-lg p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-rose-600/30 rounded flex items-center justify-center">
                      <span className="text-rose-400 text-sm">⊢</span>
                    </div>
                    <h5 className="text-rose-400 font-bold">Logical-based</h5>
                  </div>
                  <p className="text-xs text-gray-400 mb-3">Define subgraphs via rules/path patterns (e.g., "path length ≤ k")</p>
                  <div className="flex flex-wrap gap-1">
                    {['RoG', 'RD-P', 'RuleRAG', 'KGL', 'RiTeK'].map(n => (
                      <span key={n} className="px-1.5 py-0.5 bg-rose-900/30 rounded text-[10px] text-rose-300">{n}</span>
                    ))}
                  </div>
                </div>

                <div className="bg-[#0d1117] border border-gray-800 rounded-lg p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-rose-600/30 rounded flex items-center justify-center">
                      <span className="text-rose-400 text-sm">⬡</span>
                    </div>
                    <h5 className="text-rose-400 font-bold">GNN-based</h5>
                  </div>
                  <p className="text-xs text-gray-400 mb-3">Learn node/subgraph embeddings with GNN for retrieval</p>
                  <div className="flex flex-wrap gap-1">
                    {['GNN-Ret', 'SURGE', 'GNN-RAG'].map(n => (
                      <span key={n} className="px-1.5 py-0.5 bg-rose-900/30 rounded text-[10px] text-rose-300">{n}</span>
                    ))}
                  </div>
                </div>

                <div className="bg-[#0d1117] border border-gray-800 rounded-lg p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-rose-600/30 rounded flex items-center justify-center">
                      <span className="text-rose-400 text-sm">💬</span>
                    </div>
                    <h5 className="text-rose-400 font-bold">LLM-based</h5>
                  </div>
                  <p className="text-xs text-gray-400 mb-3">LLM decides seed nodes, paths, expansion via prompts</p>
                  <div className="flex flex-wrap gap-1">
                    {['ToG', 'LightRAG', 'KGP', 'MEG', 'E2GraphRAG'].map(n => (
                      <span key={n} className="px-1.5 py-0.5 bg-rose-900/30 rounded text-[10px] text-rose-300">{n}</span>
                    ))}
                  </div>
                </div>

                <div className="bg-[#0d1117] border border-gray-800 rounded-lg p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-rose-600/30 rounded flex items-center justify-center">
                      <span className="text-rose-400 text-sm">🎮</span>
                    </div>
                    <h5 className="text-rose-400 font-bold">RL-based</h5>
                  </div>
                  <p className="text-xs text-gray-400 mb-3">Model graph traversal as MDP, learn policy via RL</p>
                  <div className="flex flex-wrap gap-1">
                    {['KnowGPT', 'Spider', 'GraphRAG-R1'].map(n => (
                      <span key={n} className="px-1.5 py-0.5 bg-rose-900/30 rounded text-[10px] text-rose-300">{n}</span>
                    ))}
                  </div>
                </div>

                <div className="bg-[#0d1117] border border-gray-800 rounded-lg p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-rose-600/30 rounded flex items-center justify-center">
                      <span className="text-rose-400 text-sm">🔄</span>
                    </div>
                    <h5 className="text-rose-400 font-bold">Multi-round</h5>
                  </div>
                  <p className="text-xs text-gray-400 mb-3">Iteratively traverse and refine subgraph over multiple rounds</p>
                  <div className="flex flex-wrap gap-1">
                    {['GoR', 'DialogGSR', 'Graph-CoT'].map(n => (
                      <span key={n} className="px-1.5 py-0.5 bg-rose-900/30 rounded text-[10px] text-rose-300">{n}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Knowledge Integration */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold mb-8 text-white border-l-4 border-amber-500 pl-4">
                6. Knowledge Integration Methods
              </h3>
              <p className="text-gray-400 mb-6">
                How to feed retrieved graph knowledge into the LLM?
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Fine-tuning based */}
                <div className="bg-[#0d1117] border border-amber-800/30 rounded-xl p-6">
                  <h4 className="text-amber-400 font-bold text-lg mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 bg-amber-600/30 rounded flex items-center justify-center text-sm">🔧</span>
                    Fine-tuning Based
                  </h4>
                  
                  <div className="space-y-4">
                    <div className="bg-black/30 p-3 rounded-lg">
                      <h5 className="text-white text-sm font-bold mb-1">Node-level</h5>
                      <p className="text-xs text-gray-500 mb-2">Train model with node-unit information</p>
                      <div className="flex gap-1">
                        {['SKETCH', 'GraphGPT'].map(n => (
                          <span key={n} className="px-1.5 py-0.5 bg-amber-900/30 rounded text-[10px] text-amber-300">{n}</span>
                        ))}
                      </div>
                    </div>
                    <div className="bg-black/30 p-3 rounded-lg">
                      <h5 className="text-white text-sm font-bold mb-1">Path-level</h5>
                      <p className="text-xs text-gray-500 mb-2">Use paths (node-edge-node...) as training input</p>
                      <div className="flex flex-wrap gap-1">
                        {['RoG', 'GLRec', 'KGTransformer', 'MuseGraph'].map(n => (
                          <span key={n} className="px-1.5 py-0.5 bg-amber-900/30 rounded text-[10px] text-amber-300">{n}</span>
                        ))}
                      </div>
                    </div>
                    <div className="bg-black/30 p-3 rounded-lg">
                      <h5 className="text-white text-sm font-bold mb-1">Subgraph-level</h5>
                      <p className="text-xs text-gray-500 mb-2">Use small subgraphs as training samples</p>
                      <div className="flex flex-wrap gap-1">
                        {['GRAG', 'RHO', 'GNP', 'InstructGLM', 'LLAGA'].map(n => (
                          <span key={n} className="px-1.5 py-0.5 bg-amber-900/30 rounded text-[10px] text-amber-300">{n}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* In-context Learning */}
                <div className="bg-[#0d1117] border border-amber-800/30 rounded-xl p-6">
                  <h4 className="text-amber-400 font-bold text-lg mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 bg-amber-600/30 rounded flex items-center justify-center text-sm">📝</span>
                    In-context Learning
                  </h4>
                  
                  <div className="space-y-4">
                    <div className="bg-black/30 p-3 rounded-lg">
                      <h5 className="text-white text-sm font-bold mb-1">Graph-enhanced Chain-of-Thought</h5>
                      <p className="text-xs text-gray-500 mb-2">Describe graph paths/structure as chain-of-thought in prompts</p>
                      <div className="flex flex-wrap gap-1">
                        {['ToG', 'Graph-CoT', 'LARK', 'Chain-of-Knowledge', 'MindMap'].map(n => (
                          <span key={n} className="px-1.5 py-0.5 bg-amber-900/30 rounded text-[10px] text-amber-300">{n}</span>
                        ))}
                      </div>
                    </div>
                    <div className="bg-black/30 p-3 rounded-lg">
                      <h5 className="text-white text-sm font-bold mb-1">Collaborative Refinement</h5>
                      <p className="text-xs text-gray-500 mb-2">LLM refines graph OR graph validates LLM responses</p>
                      <div className="flex flex-wrap gap-1">
                        {['KELP', 'FMEA-KG', 'EtD', 'PoG', 'CogMG'].map(n => (
                          <span key={n} className="px-1.5 py-0.5 bg-amber-900/30 rounded text-[10px] text-amber-300">{n}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Diagram */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-700 rounded-xl p-8">
              <h4 className="text-white font-bold text-xl mb-6 text-center">GraphRAG Classification Summary</h4>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Dimension</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Categories</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    <tr>
                      <td className="py-3 px-4 text-blue-400 font-bold">Graph Role</td>
                      <td className="py-3 px-4 text-gray-300 text-xs">Knowledge-based (Graph=Knowledge) / Index-based (Graph=Map) / Hybrid</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-emerald-400 font-bold">Graph Source</td>
                      <td className="py-3 px-4 text-gray-300 text-xs">Existing KG / Corpus-derived KG / Document Index Graph / Mixed</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-rose-400 font-bold">Retrieval Method</td>
                      <td className="py-3 px-4 text-gray-300 text-xs">Similarity / Logical / GNN / LLM / RL-based / Multi-round / Hybrid</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-amber-400 font-bold">Integration</td>
                      <td className="py-3 px-4 text-gray-300 text-xs">Fine-tuning (Node/Path/Subgraph) / In-context (Graph-CoT) / Collaborative</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Mathematical Foundations Section */}
          <div id="math-section" className="mt-20 pt-16 border-t border-gray-800">
            <div className="mb-12 border-b border-gray-800 pb-4">
              <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                <span className="text-purple-500">∑</span> Mathematical Foundations
              </h2>
              <p className="text-gray-500 mt-2 font-mono text-sm">Formal notation and theoretical framework for GraphRAG</p>
            </div>

            {/* Section 1: Basic Concepts */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold mb-8 text-white border-l-4 border-cyan-500 pl-4">
                1. Preliminaries: Sets & Graphs
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-[#0d1117] border border-gray-800 rounded-lg p-6">
                  <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 bg-cyan-600 rounded flex items-center justify-center text-xs">1</span>
                    Set
                  </h4>
                  <p className="text-gray-400 text-sm mb-4">The fundamental unit for expressing collections of nodes, edges, and documents</p>
                  <div className="bg-black/50 p-4 rounded-lg border border-gray-800">
                    <Math display>{"V = \\{v_1, v_2, \\dots, v_n\\}"}</Math>
                    <p className="text-xs text-gray-500 text-center">Set of vertices (nodes)</p>
                  </div>
                  <div className="bg-black/50 p-4 rounded-lg border border-gray-800 mt-3">
                    <Math display>{"E = \\{(v_i, v_j) \\mid v_i, v_j \\in V\\}"}</Math>
                    <p className="text-xs text-gray-500 text-center">Set of edges (connections)</p>
                  </div>
                </div>

                <div className="bg-[#0d1117] border border-gray-800 rounded-lg p-6">
                  <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 bg-cyan-600 rounded flex items-center justify-center text-xs">2</span>
                    Graph
                  </h4>
                  <p className="text-gray-400 text-sm mb-4">The core data structure for organizing knowledge</p>
                  <div className="bg-black/50 p-4 rounded-lg border border-gray-800">
                    <Math display>{"G = (V, E)"}</Math>
                    <p className="text-xs text-gray-500 text-center mt-2">
                      <Math>V</Math>: Set of nodes (concepts, entities)<br/>
                      <Math>E</Math>: Set of edges (relations, connections)
                    </p>
                  </div>
                  <div className="bg-black/50 p-4 rounded-lg border border-gray-800 mt-3">
                    <Math display>{"G' \\subseteq G"}</Math>
                    <p className="text-xs text-gray-500 text-center">Subgraph: A subset of the full graph</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#0d1117] border border-gray-800 rounded-lg p-6">
                <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-cyan-600 rounded flex items-center justify-center text-xs">3</span>
                  Path & Hop
                </h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-black/50 p-4 rounded-lg border border-gray-800">
                    <Math display>{"\\text{Path}(v_1, v_k) = (v_1, v_2, \\dots, v_k)"}</Math>
                    <p className="text-xs text-gray-500 text-center">Sequential path from <Math>{"v_1"}</Math> to <Math>{"v_k"}</Math></p>
                  </div>
                  <div className="bg-black/50 p-4 rounded-lg border border-gray-800">
                    <Math display>{"\\text{hops} = k - 1"}</Math>
                    <p className="text-xs text-gray-500 text-center">Path length (number of edges traversed)</p>
                  </div>
                </div>
                <div className="mt-4 bg-black/50 p-4 rounded-lg border border-gray-800">
                  <Math display>{"N_k(v) = \\{u \\mid \\text{dist}(u, v) \\le k\\}"}</Math>
                  <p className="text-xs text-gray-500 text-center"><Math>k</Math>-hop neighborhood: All nodes within <Math>k</Math> hops from node <Math>v</Math></p>
                </div>
              </div>
            </div>

            {/* Section 2: Vector & Similarity */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold mb-8 text-white border-l-4 border-emerald-500 pl-4">
                2. Vector Embeddings & Similarity
              </h3>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-[#0d1117] border border-gray-800 rounded-lg p-6">
                  <h4 className="text-white font-bold mb-4">Embedding Vector</h4>
                  <p className="text-gray-400 text-sm mb-4">Mapping text to high-dimensional vector space</p>
                  <div className="bg-black/50 p-4 rounded-lg border border-gray-800">
                    <Math display>{"\\mathbf{e} = (e_1, e_2, \\dots, e_d) \\in \\mathbb{R}^d"}</Math>
                    <p className="text-xs text-gray-500 text-center"><Math>d</Math>-dimensional embedding vector</p>
                  </div>
                  <div className="mt-4 p-3 bg-emerald-950/30 border border-emerald-800/30 rounded text-xs text-emerald-300">
                    <strong>Example:</strong> "Stress" → <Math>{"(0.12, -0.45, 0.89, \\dots)"}</Math>
                  </div>
                </div>

                <div className="bg-[#0d1117] border border-gray-800 rounded-lg p-6">
                  <h4 className="text-white font-bold mb-4">Cosine Similarity</h4>
                  <p className="text-gray-400 text-sm mb-4">Measuring similarity between two vectors</p>
                  <div className="bg-black/50 p-4 rounded-lg border border-gray-800">
                    <Math display>{"\\text{sim}(\\mathbf{x}, \\mathbf{y}) = \\frac{\\mathbf{x} \\cdot \\mathbf{y}}{\\|\\mathbf{x}\\| \\|\\mathbf{y}\\|}"}</Math>
                    <p className="text-xs text-gray-500 text-center">Range: <Math>{"[-1, 1]"}</Math>, closer to 1 means more similar</p>
                  </div>
                  <div className="mt-4 p-3 bg-emerald-950/30 border border-emerald-800/30 rounded text-xs text-emerald-300">
                    <strong>Interpretation:</strong> <Math>{"\\text{sim} = 1"}</Math> (identical), <Math>{"\\text{sim} = 0"}</Math> (unrelated)
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Probability & Core Formulas */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold mb-8 text-white border-l-4 border-purple-500 pl-4">
                3. Probabilistic Framework
              </h3>

              <div className="bg-gradient-to-br from-purple-950/30 to-blue-950/30 border border-purple-800/30 rounded-xl p-8 mb-8">
                <div className="text-center mb-6">
                  <span className="px-3 py-1 bg-purple-600/30 border border-purple-500/50 rounded-full text-purple-300 text-xs font-mono">
                    CORE OBJECTIVE
                  </span>
                </div>
                <Math display>{"a^* = \\arg\\max_a P(a \\mid q, G)"}</Math>
                <p className="text-center text-gray-400 text-sm max-w-xl mx-auto">
                  Given query <Math>q</Math> and knowledge graph <Math>G</Math>, select the answer <Math>{"a^*"}</Math> with the highest probability.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-[#0d1117] border border-gray-800 rounded-lg p-6">
                  <h4 className="text-white font-bold mb-4">Conditional Probability</h4>
                  <div className="bg-black/50 p-4 rounded-lg border border-gray-800 mb-4">
                    <Math display>{"P(A \\mid B)"}</Math>
                    <p className="text-xs text-gray-500 text-center mt-2">Probability of <Math>A</Math> given <Math>B</Math></p>
                  </div>
                  <p className="text-xs text-gray-400">
                    In GraphRAG, we maximize the probability of a correct answer given the graph structure <Math>G</Math>
                  </p>
                </div>

                <div className="bg-[#0d1117] border border-gray-800 rounded-lg p-6">
                  <h4 className="text-white font-bold mb-4">Retrieval Approximation</h4>
                  <div className="bg-black/50 p-4 rounded-lg border border-gray-800 mb-4">
                    <Math display>{"P(a \\mid q, G) \\approx P(a \\mid q, G^*)"}</Math>
                    <p className="text-xs text-gray-500 text-center mt-2"><Math>{"G^*"}</Math>: Retrieved relevant subgraph</p>
                  </div>
                  <p className="text-xs text-gray-400">
                    Extract only relevant portions instead of the full graph for computational efficiency
                  </p>
                </div>
              </div>
            </div>

            {/* Section 4: Scoring Functions */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold mb-8 text-white border-l-4 border-amber-500 pl-4">
                4. Scoring Functions
              </h3>

              <p className="text-gray-400 mb-6">
                Scoring functions for subgraph selection - extracting the most relevant subgraph for the query
              </p>

              <div className="bg-gradient-to-br from-amber-950/30 to-orange-950/30 border border-amber-800/30 rounded-xl p-6 mb-6">
                <Math display>{"G^* = \\arg\\max_{G' \\subseteq G} \\text{Score}(q, G')"}</Math>
                <p className="text-center text-xs text-gray-400">Select the subgraph <Math>{"G^*"}</Math> with the highest score for query <Math>q</Math></p>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-5 rounded-lg border border-amber-500/30 bg-amber-950/20 backdrop-blur-sm">
                  <h4 className="font-bold text-white mb-3 text-sm uppercase tracking-wider">Similarity-based</h4>
                  <Math display>{"\\text{Score}(q, v) = \\cos(\\mathbf{e}_q, \\mathbf{e}_v)"}</Math>
                  <p className="text-xs text-gray-400 mt-3 leading-relaxed">Score based on cosine similarity between query and node vectors</p>
                </div>
                <div className="p-5 rounded-lg border border-amber-500/30 bg-amber-950/20 backdrop-blur-sm">
                  <h4 className="font-bold text-white mb-3 text-sm uppercase tracking-wider">Distance-based</h4>
                  <Math display>{"\\text{Score}(v) = \\frac{1}{\\text{hops}(v_{\\text{seed}}, v)}"}</Math>
                  <p className="text-xs text-gray-400 mt-3 leading-relaxed">Score inversely proportional to distance from seed node</p>
                </div>
                <div className="p-5 rounded-lg border border-amber-500/30 bg-amber-950/20 backdrop-blur-sm">
                  <h4 className="font-bold text-white mb-3 text-sm uppercase tracking-wider">Hybrid Scoring</h4>
                  <Math display>{"\\text{Score} = \\alpha \\cdot \\text{Sim} + \\beta \\cdot \\text{Dist}"}</Math>
                  <p className="text-xs text-gray-400 mt-3 leading-relaxed">Weighted combination of similarity and graph distance</p>
                </div>
              </div>
            </div>

            {/* Section 5: Complete Pipeline */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold mb-8 text-white border-l-4 border-rose-500 pl-4">
                5. Complete GraphRAG Pipeline
              </h3>

              <div className="bg-[#0d1117] border border-gray-800 rounded-xl p-8">
                <div className="space-y-6">
                  {/* Step 1 */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-rose-600 rounded-full flex items-center justify-center text-white font-bold shrink-0">1</div>
                    <div className="flex-1 bg-black/50 p-4 rounded-lg border border-gray-800">
                      <h5 className="text-white font-bold mb-2">Query Embedding</h5>
                      <Math display>{"\\mathbf{e}_q = \\text{Encoder}(q)"}</Math>
                      <p className="text-xs text-gray-500">Encode the query into vector space</p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-rose-600 rounded-full flex items-center justify-center text-white font-bold shrink-0">2</div>
                    <div className="flex-1 bg-black/50 p-4 rounded-lg border border-gray-800">
                      <h5 className="text-white font-bold mb-2">Subgraph Retrieval</h5>
                      <Math display>{"G^* = \\arg\\max_{G' \\subseteq G} \\text{Score}(q, G')"}</Math>
                      <p className="text-xs text-gray-500">Extract relevant subgraph using scoring function</p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-rose-600 rounded-full flex items-center justify-center text-white font-bold shrink-0">3</div>
                    <div className="flex-1 bg-black/50 p-4 rounded-lg border border-gray-800">
                      <h5 className="text-white font-bold mb-2">Context Construction</h5>
                      <Math display>{"C = \\text{Linearize}(G^*)"}</Math>
                      <p className="text-xs text-gray-500">Convert subgraph into text that LLM can understand</p>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-rose-600 rounded-full flex items-center justify-center text-white font-bold shrink-0">4</div>
                    <div className="flex-1 bg-black/50 p-4 rounded-lg border border-gray-800">
                      <h5 className="text-white font-bold mb-2">Answer Generation</h5>
                      <Math display>{"a = \\text{LLM}(q, C)"}</Math>
                      <p className="text-xs text-gray-500">Generate final answer based on context and query</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Table */}
            <div>
              <h3 className="text-2xl font-bold mb-8 text-white border-l-4 border-blue-500 pl-4">
                6. Key Formulas Summary
              </h3>

              <div className="overflow-hidden border border-gray-700 rounded-xl bg-gray-900/30">
                <table className="w-full text-sm">
                  <thead className="bg-gray-800 text-gray-200">
                    <tr>
                      <th className="px-6 py-4 font-medium text-left border-r border-gray-700 w-1/4">Concept</th>
                      <th className="px-6 py-4 font-medium text-center border-r border-gray-700">Formula</th>
                      <th className="px-6 py-4 font-medium text-left">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    <tr>
                      <td className="px-6 py-4 font-bold text-blue-400 border-r border-gray-800">Graph Definition</td>
                      <td className="px-6 py-4 text-center border-r border-gray-800"><Math>{"G = (V, E)"}</Math></td>
                      <td className="px-6 py-4 text-gray-400 text-xs">Knowledge graph composed of nodes and edges</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-bold text-purple-400 border-r border-gray-800">Core Objective</td>
                      <td className="px-6 py-4 text-center border-r border-gray-800"><Math>{"a^* = \\arg\\max_a P(a \\mid q, G)"}</Math></td>
                      <td className="px-6 py-4 text-gray-400 text-xs">Objective function for optimal answer selection</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-bold text-amber-400 border-r border-gray-800">Subgraph Selection</td>
                      <td className="px-6 py-4 text-center border-r border-gray-800"><Math>{"G^* = \\arg\\max_{G'} \\text{Score}(q, G')"}</Math></td>
                      <td className="px-6 py-4 text-gray-400 text-xs">Retrieve relevant subgraph</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-bold text-emerald-400 border-r border-gray-800">Cosine Similarity</td>
                      <td className="px-6 py-4 text-center border-r border-gray-800"><Math>{"\\text{sim}(\\mathbf{x}, \\mathbf{y}) = \\frac{\\mathbf{x} \\cdot \\mathbf{y}}{\\|\\mathbf{x}\\| \\|\\mathbf{y}\\|}"}</Math></td>
                      <td className="px-6 py-4 text-gray-400 text-xs">Calculate vector similarity</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-bold text-rose-400 border-r border-gray-800">Generation</td>
                      <td className="px-6 py-4 text-center border-r border-gray-800"><Math>{"a = \\text{LLM}(q, G^*)"}</Math></td>
                      <td className="px-6 py-4 text-gray-400 text-xs">Generate final answer</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Evaluation Metrics Section */}
          <div className="mt-20 pt-16 border-t border-gray-800">
            <div className="mb-12 border-b border-gray-800 pb-4">
              <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                <span className="text-teal-500">📊</span> Evaluation Metrics
              </h2>
              <p className="text-gray-500 mt-2 font-mono text-sm">A multi-level framework for evaluating GraphRAG systems</p>
            </div>

            {/* Why traditional metrics are insufficient */}
            <div className="mb-12">
              <div className="bg-gradient-to-r from-teal-950/30 to-cyan-950/30 border border-teal-800/30 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Why Traditional RAG Metrics Are Insufficient</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Traditional RAG evaluation relies on: <span className="text-gray-300">Exact Match (EM), F1, BLEU/ROUGE, Human evaluation</span>
                </p>
                <div className="bg-black/30 p-4 rounded-lg border border-teal-800/20">
                  <p className="text-teal-300 text-sm italic">
                    "Unlike conventional RAG systems, GraphRAG requires evaluation not only at the <strong className="text-white">answer level</strong> but also at the levels of <strong className="text-white">retrieval quality</strong>, <strong className="text-white">reasoning faithfulness</strong>, and <strong className="text-white">graph utilization effectiveness</strong>."
                  </p>
                </div>
              </div>
            </div>

            {/* 4-Level Evaluation Structure */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-8 text-white border-l-4 border-teal-500 pl-4">
                The 4-Level Evaluation Framework
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Level 1: Answer Quality */}
                <div className="bg-[#0d1117] border border-gray-800 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">1</div>
                    <div>
                      <h4 className="text-white font-bold">Answer Quality</h4>
                      <p className="text-xs text-gray-500">Final answer performance</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Exact Match (EM)</span>
                      <span className="text-blue-400">Standard QA metric</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">F1 Score</span>
                      <span className="text-blue-400">Token overlap</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">ROUGE / BLEU / BERTScore</span>
                      <span className="text-blue-400">Semantic similarity</span>
                    </div>
                  </div>
                  <div className="mt-4 p-2 bg-blue-950/30 rounded text-xs text-blue-300">
                    ⚠️ Answer score alone is insufficient for GraphRAG
                  </div>
                </div>

                {/* Level 2: Retrieval Quality */}
                <div className="bg-[#0d1117] border border-gray-800 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">2</div>
                    <div>
                      <h4 className="text-white font-bold">Retrieval Quality</h4>
                      <p className="text-xs text-gray-500">Subgraph extraction performance</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-black/30 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Precision & Recall</p>
                      <Math display>{"\\text{Precision} = \\frac{|G_{ret} \\cap G_{gold}|}{|G_{ret}|}"}</Math>
                    </div>
                    <div className="bg-black/30 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Path Recall (for multi-hop)</p>
                      <Math display>{"\\text{PathRecall} = \\frac{\\text{\\# Correct paths}}{\\text{\\# Gold paths}}"}</Math>
                    </div>
                  </div>
                </div>

                {/* Level 3: Reasoning Faithfulness */}
                <div className="bg-[#0d1117] border border-gray-800 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold">3</div>
                    <div>
                      <h4 className="text-white font-bold">Reasoning Faithfulness</h4>
                      <p className="text-xs text-gray-500">Trustworthiness of inference</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-black/30 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Faithfulness Score</p>
                      <Math display>{"\\text{Faith} = \\frac{\\text{\\# Supported statements}}{\\text{\\# Total statements}}"}</Math>
                    </div>
                    <div className="bg-black/30 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Hallucination Rate</p>
                      <Math display>{"\\text{Halluc} = \\frac{\\text{\\# Unsupported claims}}{\\text{\\# Total claims}}"}</Math>
                    </div>
                  </div>
                </div>

                {/* Level 4: Graph Usefulness */}
                <div className="bg-[#0d1117] border border-gray-800 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center text-white font-bold">4</div>
                    <div>
                      <h4 className="text-white font-bold">Graph Usefulness & Efficiency</h4>
                      <p className="text-xs text-gray-500">Practical system performance</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-black/30 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Graph Utilization Rate</p>
                      <Math display>{"\\text{Util} = \\frac{\\text{Nodes used in reasoning}}{\\text{Nodes retrieved}}"}</Math>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-black/30 p-2 rounded text-center">
                        <span className="text-amber-400">Retrieval Time</span>
                      </div>
                      <div className="bg-black/30 p-2 rounded text-center">
                        <span className="text-amber-400">Subgraph Size</span>
                      </div>
                      <div className="bg-black/30 p-2 rounded text-center">
                        <span className="text-amber-400">Token Count</span>
                      </div>
                      <div className="bg-black/30 p-2 rounded text-center">
                        <span className="text-amber-400">Latency</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Metrics */}
            <div className="mb-12">
              <h3 className="text-xl font-bold mb-6 text-white border-l-4 border-cyan-500 pl-4">
                Additional Retrieval Metrics
              </h3>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-[#0d1117] border border-gray-800 rounded-lg p-4">
                  <h5 className="text-cyan-400 font-bold text-sm mb-2">Node Coverage</h5>
                  <Math display>{"\\text{Cov} = \\frac{\\text{Relevant retrieved}}{\\text{Total relevant}}"}</Math>
                  <p className="text-xs text-gray-500 mt-2">How many relevant nodes were found?</p>
                </div>
                <div className="bg-[#0d1117] border border-gray-800 rounded-lg p-4">
                  <h5 className="text-cyan-400 font-bold text-sm mb-2">Noise Ratio</h5>
                  <Math display>{"\\text{Noise} = \\frac{\\text{Irrelevant nodes}}{\\text{Retrieved nodes}}"}</Math>
                  <p className="text-xs text-gray-500 mt-2">How much irrelevant data was retrieved?</p>
                </div>
                <div className="bg-[#0d1117] border border-gray-800 rounded-lg p-4">
                  <h5 className="text-cyan-400 font-bold text-sm mb-2">F1 Score</h5>
                  <Math display>{"F_1 = \\frac{2 \\cdot P \\cdot R}{P + R}"}</Math>
                  <p className="text-xs text-gray-500 mt-2">Harmonic mean of precision & recall</p>
                </div>
              </div>
            </div>

            {/* Benchmark Datasets */}
            <div className="mb-12">
              <h3 className="text-xl font-bold mb-6 text-white border-l-4 border-rose-500 pl-4">
                Common Benchmark Datasets
              </h3>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-[#0d1117] border border-gray-800 rounded-lg p-4">
                  <h5 className="text-rose-400 font-bold text-sm mb-3">Multi-hop QA</h5>
                  <div className="space-y-1">
                    {['HotpotQA', '2WikiMultiHopQA', 'MuSiQue'].map(d => (
                      <div key={d} className="text-xs text-gray-400 bg-black/30 px-2 py-1 rounded">{d}</div>
                    ))}
                  </div>
                </div>
                <div className="bg-[#0d1117] border border-gray-800 rounded-lg p-4">
                  <h5 className="text-rose-400 font-bold text-sm mb-3">Knowledge Graph QA</h5>
                  <div className="space-y-1">
                    {['WebQSP', 'ComplexWebQuestions', 'MetaQA'].map(d => (
                      <div key={d} className="text-xs text-gray-400 bg-black/30 px-2 py-1 rounded">{d}</div>
                    ))}
                  </div>
                </div>
                <div className="bg-[#0d1117] border border-gray-800 rounded-lg p-4">
                  <h5 className="text-rose-400 font-bold text-sm mb-3">Domain-Specific</h5>
                  <div className="space-y-1">
                    {['PubMedQA', 'Clinical QA', 'Contract QA'].map(d => (
                      <div key={d} className="text-xs text-gray-400 bg-black/30 px-2 py-1 rounded">{d}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* References Section */}
          <div className="mt-20 pt-16 border-t border-gray-800">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="text-gray-500">📚</span> References
              </h2>
            </div>

            <div className="space-y-4">
              <div className="bg-[#0d1117] border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-colors">
                <div className="flex items-start gap-3">
                  <span className="text-blue-400 font-mono text-sm">[1]</span>
                  <div>
                    <p className="text-gray-300 text-sm">
                      Gao, Y., Xiong, Y., Gao, X., Jia, K., Pan, J., Bi, Y., ... & Wang, H. (2024).
                      <span className="text-white font-medium"> Retrieval-Augmented Generation for Large Language Models: A Survey.</span>
                    </p>
                    <p className="text-gray-500 text-xs mt-1 italic">arXiv preprint arXiv:2312.10997</p>
                    <p className="text-blue-400/70 text-xs mt-1">→ Figures 1, 2, 3</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#0d1117] border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-colors">
                <div className="flex items-start gap-3">
                  <span className="text-emerald-400 font-mono text-sm">[2]</span>
                  <div>
                    <p className="text-gray-300 text-sm">
                      Peng, B., Zhu, Y., Liu, Y., Bo, X., Shi, H., Hong, C., ... & Yu, P. S. (2024).
                      <span className="text-white font-medium"> Graph Retrieval-Augmented Generation: A Survey.</span>
                    </p>
                    <p className="text-gray-500 text-xs mt-1 italic">arXiv preprint arXiv:2408.08921</p>
                    <p className="text-emerald-400/70 text-xs mt-1">→ Mathematical Foundations & Formulas</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#0d1117] border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-colors">
                <div className="flex items-start gap-3">
                  <span className="text-purple-400 font-mono text-sm">[3]</span>
                  <div>
                    <p className="text-gray-300 text-sm">
                      Hu, Z., Xu, Z., & Liu, W. (2024).
                      <span className="text-white font-medium"> A Survey of Graph Retrieval-Augmented Generation for Customized Large Language Models.</span>
                    </p>
                    <p className="text-gray-500 text-xs mt-1 italic">arXiv preprint</p>
                    <p className="text-purple-400/70 text-xs mt-1">→ Figure 4, GraphRAG Taxonomy (Paradigms, Retrieval Techniques)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      <footer className="py-12 border-t border-gray-800 bg-[#0d1117] text-center">
         <div className="flex justify-center gap-6 mb-8">
            {['React 19', 'TypeScript', 'D3.js', 'Google Gemini', 'Tailwind CSS'].map(tech => (
               <span key={tech} className="px-3 py-1 bg-gray-800 border border-gray-700 rounded-full text-xs text-gray-400 font-mono hover:border-gray-500 transition-colors cursor-default">
                  {tech}
               </span>
            ))}
         </div>
         <p className="text-gray-600 text-xs font-mono">
            MIT License • Educational Edition
         </p>
      </footer>
    </div>
  );
};

export default LandingPage;