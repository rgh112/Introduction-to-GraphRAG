import React, { useState, useEffect } from 'react';

interface DocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DocsModal: React.FC<DocsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'concepts'>('pipeline');
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Animation Loop
  useEffect(() => {
    let interval: any;
    if (isOpen && isPlaying && activeTab === 'pipeline') {
      interval = setInterval(() => {
        setStep((prev) => (prev + 1) % 6); // 0 to 5 steps
      }, 5000); 
    }
    return () => clearInterval(interval);
  }, [isOpen, isPlaying, activeTab]);

  if (!isOpen) return null;

  const steps = [
    { title: "1. Query Injection", desc: "User input enters the system." },
    { title: "2. Vector Embedding", desc: "Text converted to dense vectors." },
    { title: "3. Semantic Targeting", desc: "Vector similarity locks onto 'Stress'." },
    { title: "4. Neural Expansion", desc: "Activating connected neighbors." },
    { title: "5. Context Extraction", desc: "Data flows to the Context Window." },
    { title: "6. Synthesis Generation", desc: "LLM constructs the final answer." }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-gray-950 border border-gray-700 w-full max-w-6xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-gray-800 flex justify-between items-center bg-gray-900/50 backdrop-blur shrink-0 z-20">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">System Architecture</span>
            </h2>
            <p className="text-xs text-gray-400 mt-1">Unified KG-RAG Data Flow</p>
          </div>
          <div className="flex gap-4">
             <div className="flex bg-gray-900 rounded-lg p-1 border border-gray-800">
                <button 
                  onClick={() => setActiveTab('pipeline')}
                  className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === 'pipeline' ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  Pipeline
                </button>
                <button 
                  onClick={() => setActiveTab('concepts')}
                  className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === 'concepts' ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  Concepts
                </button>
             </div>
             <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-hidden flex bg-[#05080f] relative">
          
          {/* --- TAB: PIPELINE ANIMATION --- */}
          {activeTab === 'pipeline' && (
            <div className="flex w-full h-full">
              
              {/* Timeline Sidebar */}
              <div className="w-64 border-r border-gray-800/50 bg-gray-900/20 p-6 flex flex-col z-10 shrink-0 overflow-y-auto custom-scrollbar">
                <div className="space-y-6 flex-1 pt-4">
                  {steps.map((s, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => { setStep(idx); setIsPlaying(false); }}
                      className={`cursor-pointer group relative pl-8 transition-all duration-500 ${step === idx ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}
                    >
                      {idx !== steps.length - 1 && <div className="absolute left-[15px] top-8 w-px h-10 bg-gray-800"></div>}
                      
                      <div className={`absolute left-0 top-1 w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all duration-300 ${
                        step === idx 
                          ? 'bg-gray-900 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.4)] scale-110' 
                          : step > idx 
                            ? 'bg-blue-900/20 border-blue-800 text-blue-600'
                            : 'bg-gray-900 border-gray-800 text-gray-600'
                      }`}>
                        {step > idx ? '✓' : idx + 1}
                      </div>
                      
                      <div>
                        <h4 className={`text-sm font-bold transition-colors ${step === idx ? 'text-white' : 'text-gray-400'}`}>{s.title}</h4>
                        <p className="text-[10px] text-gray-500 leading-tight mt-1 font-mono">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-2 mt-6 pt-6 border-t border-gray-800/50 shrink-0">
                   <button 
                     onClick={() => setIsPlaying(!isPlaying)}
                     className="flex-1 py-2 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 text-blue-400 text-xs rounded font-mono transition-all flex items-center justify-center gap-2"
                   >
                     {isPlaying ? (
                       <><span className="w-1.5 h-4 bg-blue-400"></span><span className="w-1.5 h-4 bg-blue-400"></span></>
                     ) : (
                       <span className="text-xs">▶ PLAY</span>
                     )}
                   </button>
                   <button 
                     onClick={() => { setStep(0); setIsPlaying(true); }}
                     className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded border border-gray-700 transition-colors"
                   >
                     ↺
                   </button>
                </div>
              </div>

              {/* MAIN VISUALIZATION STAGE (Unified SVG) */}
              <div className="flex-1 relative overflow-y-auto bg-[#05080f] flex justify-center custom-scrollbar">
                 {/* Background Grid */}
                 <div className="absolute inset-0 h-[1800px] w-full pointer-events-none" 
                      style={{ 
                        backgroundImage: 'linear-gradient(rgba(30, 41, 59, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(30, 41, 59, 0.3) 1px, transparent 1px)', 
                        backgroundSize: '40px 40px',
                        maskImage: 'linear-gradient(to bottom, black 90%, transparent)'
                      }}>
                 </div>

                 {/* THE UNIFIED CANVAS */}
                 {/* Increased height to 1400 to push synthesis way down */}
                 <svg width="800" height="1400" viewBox="0 0 800 1400" className="my-10 overflow-visible relative z-10">
                    <defs>
                      <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8"/>
                        <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.1"/>
                      </linearGradient>
                      <linearGradient id="goldGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8"/>
                        <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.1"/>
                      </linearGradient>
                      <filter id="glow-blue" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                      <filter id="glow-green" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                      <marker id="arrow-blue" markerWidth="6" markerHeight="6" refX="15" refY="3" orient="auto">
                         <path d="M0,0 L0,6 L9,3 z" fill="#3b82f6" />
                      </marker>
                    </defs>

                    {/* --- STEP 1: QUERY (Top Center) --- */}
                    <g transform="translate(400, 60)" className={`transition-opacity duration-700 ${step >= 0 ? 'opacity-100' : 'opacity-30'}`}>
                       <rect x="-160" y="-30" width="320" height="60" rx="30" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" filter="url(#glow-blue)" />
                       <text textAnchor="middle" dy="5" fill="#e2e8f0" fontSize="14" fontWeight="600" fontFamily="Inter, sans-serif">
                         "How does stress lead to heart attacks?"
                       </text>
                    </g>

                    {/* Connector 1: Query -> Model */}
                    <path d="M 400 90 L 400 160" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 4" className={step >= 1 ? "opacity-100" : "opacity-0"}>
                       {step >= 1 && <animate attributeName="stroke-dashoffset" from="16" to="0" dur="0.5s" repeatCount="indefinite" />}
                    </path>


                    {/* --- STEP 2: EMBEDDING MODEL (Matrix) --- */}
                    <g transform="translate(400, 200)" className={`transition-all duration-700 ${step >= 1 ? 'opacity-100' : 'opacity-20'}`}>
                       {/* Model Box */}
                       <rect x="-140" y="-40" width="280" height="80" rx="8" fill="#0f172a" stroke={step >= 1 ? "#8b5cf6" : "#334155"} strokeWidth="1" />
                       <text x="-120" y="-20" fill="#a78bfa" fontSize="10" fontWeight="bold" letterSpacing="1">EMBEDDING MODEL</text>
                       
                       {/* Binary Stream Animation */}
                       <foreignObject x="-120" y="-10" width="240" height="40">
                         <div className="w-full h-full overflow-hidden flex items-center justify-center font-mono text-[10px] text-emerald-400">
                            {step >= 1 ? "0.82  -0.14  0.99  0.01  -0.55 ..." : "Processing..."}
                         </div>
                       </foreignObject>
                    </g>


                    {/* --- STEP 3: THE BEAM (Search) --- */}
                    {/* The beam connects the Model (400, 240) to the Graph Root (400, 400) */}
                    <g className={`transition-opacity duration-500 ${step >= 2 ? 'opacity-100' : 'opacity-0'}`}>
                       <line x1="400" y1="240" x2="400" y2="400" stroke="url(#blueGradient)" strokeWidth="3">
                          <animate attributeName="stroke-dasharray" from="0, 200" to="200, 0" dur="0.6s" fill="freeze" />
                       </line>
                       {/* Impact Ring at Node */}
                       <circle cx="400" cy="400" r="30" fill="none" stroke="#3b82f6" strokeWidth="2" opacity="0">
                          {step === 2 && <animate attributeName="r" from="25" to="50" dur="1s" repeatCount="indefinite" />}
                          {step === 2 && <animate attributeName="opacity" values="1;0" dur="1s" repeatCount="indefinite" />}
                       </circle>
                    </g>


                    {/* --- STEP 4: KNOWLEDGE GRAPH (The Network) --- */}
                    <g transform="translate(0, 0)">
                       {/* Links */}
                       <g stroke="#334155" strokeWidth="2" strokeLinecap="round">
                          {/* Root -> Left */}
                          <path d="M 400 400 C 400 450, 250 450, 250 550" className={`transition-colors duration-700 ${step >= 3 ? 'stroke-blue-500' : ''}`} />
                          {/* Root -> Right */}
                          <path d="M 400 400 C 400 450, 550 450, 550 550" className={`transition-colors duration-700 ${step >= 3 ? 'stroke-blue-500' : ''}`} />
                          {/* Left -> Bot Left */}
                          <path d="M 250 550 L 250 700" className={`transition-colors duration-700 delay-300 ${step >= 3 ? 'stroke-blue-500' : ''}`} />
                          {/* Bot Left -> Final */}
                          <path d="M 250 700 C 250 800, 400 800, 400 850" className={`transition-colors duration-700 delay-700 ${step >= 3 ? 'stroke-red-500' : ''}`} />
                          {/* Right -> Final */}
                          <path d="M 550 550 C 550 800, 400 800, 400 850" className={`transition-colors duration-700 delay-700 ${step >= 3 ? 'stroke-red-500' : ''}`} />
                       </g>

                       {/* Nodes */}
                       {/* Root: Stress */}
                       <g transform="translate(400, 400)" className="transition-all duration-500">
                          <circle r="30" fill={step >= 2 ? "#1e3a8a" : "#1f2937"} stroke={step >= 2 ? "#60a5fa" : "#475569"} strokeWidth="3" filter={step >= 2 ? "url(#glow-blue)" : ""} />
                          <text dy="5" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Stress</text>
                          {step >= 2 && <text dy="-40" textAnchor="middle" fill="#60a5fa" fontSize="9" className="font-mono">SIMILARITY: 0.92</text>}
                       </g>

                       {/* L1: Cortisol */}
                       <g transform="translate(250, 550)" className={`transition-all duration-500 delay-100 ${step >= 3 ? 'opacity-100' : 'opacity-40'}`}>
                          <circle r="25" fill="#1e40af" stroke="#3b82f6" strokeWidth="2" />
                          <text dy="4" textAnchor="middle" fill="white" fontSize="9">Cortisol</text>
                       </g>

                       {/* L1: Inflammation */}
                       <g transform="translate(550, 550)" className={`transition-all duration-500 delay-100 ${step >= 3 ? 'opacity-100' : 'opacity-40'}`}>
                          <circle r="25" fill="#1e40af" stroke="#3b82f6" strokeWidth="2" />
                          <text dy="4" textAnchor="middle" fill="white" fontSize="9">Inflamm.</text>
                       </g>

                       {/* L2: Hypertension */}
                       <g transform="translate(250, 700)" className={`transition-all duration-500 delay-300 ${step >= 3 ? 'opacity-100' : 'opacity-40'}`}>
                          <circle r="25" fill="#1e40af" stroke="#3b82f6" strokeWidth="2" />
                          <text dy="4" textAnchor="middle" fill="white" fontSize="9">High BP</text>
                       </g>

                       {/* Target: Heart Attack */}
                       <g transform="translate(400, 850)" className={`transition-all duration-500 delay-500 ${step >= 3 ? 'opacity-100' : 'opacity-40'}`}>
                          <circle r="35" fill="#7f1d1d" stroke="#ef4444" strokeWidth="3" filter={step >= 3 ? "url(#glow-green)" : ""} />
                          <text dy="5" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">Heart Attack</text>
                       </g>
                    </g>


                    {/* --- STEP 5: CONTEXT EXTRACTION (Side Flow) --- */}
                    {/* Context Bin at (700, 600) */}
                    <g className={`transition-opacity duration-500 ${step >= 4 ? 'opacity-100' : 'opacity-0'}`}>
                       {/* The Collector Box */}
                       <rect x="620" y="500" width="160" height="200" rx="10" fill="#171717" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4 2" />
                       <text x="700" y="530" textAnchor="middle" fill="#f59e0b" fontSize="10" fontWeight="bold" letterSpacing="1">CONTEXT BUFFER</text>
                       
                       {/* Items in buffer */}
                       <g transform="translate(640, 560)">
                          <text y="0" fill="#d4d4d4" fontSize="10" className="font-mono">• Node: Stress</text>
                          <text y="20" fill="#d4d4d4" fontSize="10" className="font-mono" opacity={step >= 4 ? 1 : 0}>• Edge: Causes</text>
                          <text y="40" fill="#d4d4d4" fontSize="10" className="font-mono" opacity={step >= 4 ? 1 : 0}>• Node: Cortisol</text>
                          <text y="60" fill="#d4d4d4" fontSize="10" className="font-mono" opacity={step >= 4 ? 1 : 0}>• Node: High BP</text>
                          <text y="80" fill="#d4d4d4" fontSize="10" className="font-mono" opacity={step >= 4 ? 1 : 0}>• Target: Heart Attack</text>
                       </g>

                       {/* Particles flying from graph to buffer */}
                       {step === 4 && (
                          <g>
                             <circle r="3" fill="#fbbf24">
                                <animateMotion dur="0.8s" fill="freeze" path="M 400 400 Q 500 400 620 520" />
                             </circle>
                             <circle r="3" fill="#fbbf24">
                                <animateMotion dur="0.8s" begin="0.2s" fill="freeze" path="M 250 550 Q 400 550 620 550" />
                             </circle>
                             <circle r="3" fill="#fbbf24">
                                <animateMotion dur="0.8s" begin="0.4s" fill="freeze" path="M 400 850 Q 500 850 620 600" />
                             </circle>
                          </g>
                       )}
                    </g>


                    {/* --- STEP 6: SYNTHESIS (Moved to Bottom) --- */}
                    
                    {/* Connector Line from Buffer (x=700, y=700) down to Synthesis (x=400, y=1190) */}
                    <path d="M 700 700 C 700 950, 400 950, 400 1190" stroke="#f59e0b" strokeWidth="2" fill="none" strokeDasharray="6 4" opacity={step >= 5 ? 0.6 : 0}>
                       {step >= 5 && <animate attributeName="stroke-dashoffset" from="20" to="0" dur="1s" repeatCount="indefinite" />}
                    </path>
                    
                    {/* Synthesis Card Group - FIXED POSITIONING */}
                    {/* Outer group sets the static position at the bottom of the long canvas */}
                    <g transform="translate(400, 1250)">
                       {/* Inner group handles the entrance animation without conflicting transform resets */}
                       <g className={`transition-all duration-700 ${step >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                           <rect x="-300" y="-60" width="600" height="120" rx="12" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
                           <circle cx="-270" cy="-30" r="15" fill="#10b981" />
                           <text x="-270" y="-25" textAnchor="middle" fill="#064e3b" fontSize="10" fontWeight="bold">AI</text>
                           
                           <text x="-240" y="-25" fill="#10b981" fontSize="11" fontWeight="bold">GENERATED RESPONSE</text>
                           
                           <foreignObject x="-240" y="-10" width="520" height="60">
                              <p className="text-gray-300 text-sm leading-relaxed">
                                 "The analysis confirms a pathway: <strong className="text-blue-400">Stress</strong> triggers Cortisol release, leading to <strong className="text-blue-400">Hypertension</strong>, which is a major risk factor for <strong className="text-red-400">Heart Attacks</strong>."
                              </p>
                           </foreignObject>
                       </g>
                    </g>

                 </svg>
              </div>
            </div>
          )}

          {/* --- TAB: CONCEPTS --- */}
          {activeTab === 'concepts' && (
             <div className="w-full h-full overflow-y-auto p-10 custom-scrollbar">
                <div className="max-w-4xl mx-auto grid grid-cols-2 gap-6">
                   <div className="col-span-2 bg-gray-900 border border-gray-800 rounded-xl p-8">
                      <h3 className="text-2xl font-bold text-white mb-4">Why Graph RAG?</h3>
                      <p className="text-gray-400 leading-relaxed">
                         Standard RAG retrieves documents based on keyword matching. Graph RAG understands the <strong>relationships</strong> between concepts. It can "walk" from one idea to another, finding answers that aren't explicitly written in a single document but are inferred from the connection of facts.
                      </p>
                   </div>
                   <div className="bg-blue-900/10 border border-blue-800/50 rounded-xl p-6 hover:bg-blue-900/20 transition-colors">
                      <div className="w-10 h-10 rounded bg-blue-900/50 flex items-center justify-center mb-4 text-blue-400 font-bold">1</div>
                      <h4 className="font-bold text-blue-400 mb-2">Vector Entry</h4>
                      <p className="text-sm text-gray-400">
                         We don't just keyword search. We use high-dimensional vectors to find the "concept" of your query in the graph, even if the words don't match exactly.
                      </p>
                   </div>
                   <div className="bg-emerald-900/10 border border-emerald-800/50 rounded-xl p-6 hover:bg-emerald-900/20 transition-colors">
                      <div className="w-10 h-10 rounded bg-emerald-900/50 flex items-center justify-center mb-4 text-emerald-400 font-bold">2</div>
                      <h4 className="font-bold text-emerald-400 mb-2">Graph Traversal</h4>
                      <p className="text-sm text-gray-400">
                         Once we find an entry point (e.g., "Stress"), we look at its neighbors ("Cortisol"). This allows us to retrieve context that is logically connected, not just linguistically similar.
                      </p>
                   </div>
                </div>
             </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default DocsModal;