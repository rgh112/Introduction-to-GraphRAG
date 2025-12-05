import React, { useState, useEffect } from 'react';
import { SystemConfig, RetrievalMethod, EmbeddingModel, SynthesisModel, ResponseStyle } from '../types';
import { RETRIEVAL_OPTIONS, EMBEDDING_OPTIONS, SYNTHESIS_OPTIONS, STYLE_OPTIONS } from '../constants';
import { setApiKey, hasApiKey } from '../services/geminiService';

interface SidebarProps {
  config: SystemConfig;
  setConfig: React.Dispatch<React.SetStateAction<SystemConfig>>;
  onGenerateGraph: (topic: string, isPaperMode: boolean) => void;
  onLoadDataset: (type: 'primekg' | 'moviekg' | 'mentalhealth') => void;
  isGenerating: boolean;
  onOpenDocs: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  config, setConfig, onGenerateGraph, onLoadDataset, isGenerating, onOpenDocs 
}) => {
  const [activeTab, setActiveTab] = useState<'ai' | 'connect'>('ai');
  const [topicInput, setTopicInput] = useState("");
  const [isPaperMode, setIsPaperMode] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [isApiKeySet, setIsApiKeySet] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  // Load API key from localStorage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
      setApiKeyInput(savedKey);
      setApiKey(savedKey);
      setIsApiKeySet(true);
    }
  }, []);

  const handleSaveApiKey = () => {
    if (apiKeyInput.trim()) {
      setApiKey(apiKeyInput.trim());
      localStorage.setItem('gemini_api_key', apiKeyInput.trim());
      setIsApiKeySet(true);
    }
  };

  const handleClearApiKey = () => {
    setApiKey('');
    localStorage.removeItem('gemini_api_key');
    setApiKeyInput('');
    setIsApiKeySet(false);
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (topicInput.trim()) {
      onGenerateGraph(topicInput, isPaperMode);
    }
  };

  return (
    <div className="w-80 bg-gray-900 border-r border-gray-800 flex flex-col h-full overflow-y-auto z-20">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
          KG-RAG
        </h1>
        <p className="text-xs text-gray-400 mt-1">Modular RAG Platform</p>
      </div>

      {/* API Key Section */}
      <div className="p-4 border-b border-gray-800 bg-gray-950">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs text-gray-400 font-medium flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            Gemini API Key
          </label>
          {isApiKeySet && (
            <span className="text-[10px] bg-green-900/50 text-green-400 px-1.5 py-0.5 rounded">Active</span>
          )}
        </div>
        {!isApiKeySet ? (
          <div className="space-y-2">
            <div className="relative">
              <input
                type={showApiKey ? "text" : "password"}
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 pr-8"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                {showApiKey ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            <button
              onClick={handleSaveApiKey}
              disabled={!apiKeyInput.trim()}
              className="w-full py-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white text-xs rounded transition-colors"
            >
              Save API Key
            </button>
            <p className="text-[10px] text-gray-600">
              Get your key at <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Google AI Studio</a>
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-xs text-gray-400 font-mono truncate">
              ••••••••{apiKeyInput.slice(-4)}
            </div>
            <button
              onClick={handleClearApiKey}
              className="px-2 py-2 bg-red-900/50 hover:bg-red-900 text-red-400 text-xs rounded transition-colors"
              title="Remove API Key"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Source Selection Tabs */}
      <div className="flex border-b border-gray-800">
        <button
          onClick={() => setActiveTab('ai')}
          className={`flex-1 py-3 text-xs font-medium transition-colors ${activeTab === 'ai' ? 'text-blue-400 border-b-2 border-blue-400 bg-gray-800/50' : 'text-gray-500 hover:text-gray-300'}`}
        >
          AI Generator
        </button>
        <button
          onClick={() => setActiveTab('connect')}
          className={`flex-1 py-3 text-xs font-medium transition-colors ${activeTab === 'connect' ? 'text-emerald-400 border-b-2 border-emerald-400 bg-gray-800/50' : 'text-gray-500 hover:text-gray-300'}`}
        >
          Connect Data
        </button>
      </div>

      {/* Knowledge Base Section */}
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">
          {activeTab === 'ai' ? 'Generate Knowledge' : 'Knowledge Sources'}
        </h2>

        {activeTab === 'ai' ? (
          <form onSubmit={handleGenerate} className="space-y-3">
            {/* Mode Switcher */}
            <div className="flex bg-gray-800 p-1 rounded-md mb-2">
               <button 
                 type="button"
                 onClick={() => setIsPaperMode(false)}
                 className={`flex-1 py-1 text-[10px] rounded transition-all ${!isPaperMode ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-gray-200'}`}
               >
                 Basic Concept
               </button>
               <button 
                 type="button"
                 onClick={() => setIsPaperMode(true)}
                 className={`flex-1 py-1 text-[10px] rounded transition-all ${isPaperMode ? 'bg-purple-600 text-white shadow' : 'text-gray-400 hover:text-gray-200'}`}
               >
                 Live Scholar Search
               </button>
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-1 block">
                {isPaperMode ? "Research Topic / Paper Title" : "Topic"}
              </label>
              <input 
                type="text" 
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                placeholder={isPaperMode ? "e.g. Dopamine Hypothesis" : "e.g. Quantum Computing"}
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <button 
              type="submit"
              disabled={isGenerating}
              className={`w-full py-2 px-4 rounded text-sm font-medium transition-all ${
                isGenerating 
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                  : isPaperMode 
                    ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-900/20'
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20'
              }`}
            >
              {isGenerating ? 'Researching...' : isPaperMode ? 'Search & Build Graph' : 'Create Graph'}
            </button>
            <p className="text-[10px] text-gray-600 pt-2 leading-tight">
              {isPaperMode 
                ? "Uses Google Search Grounding to find real academic papers and builds a graph from their findings."
                : "Uses Gemini 2.5 to construct a general concept ontology."}
            </p>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="h-px bg-gray-800 flex-1"></div>
              <span className="text-[10px] text-gray-600 uppercase">Sample Knowledge Graphs</span>
              <div className="h-px bg-gray-800 flex-1"></div>
            </div>

            {/* Sample Data Buttons */}
            <div className="space-y-2">
              <button 
                onClick={() => onLoadDataset('primekg')}
                className="w-full py-2 px-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 text-xs rounded transition-all flex items-center justify-between group"
              >
                <span>Medical KG (PrimeKG)</span>
                <span className="text-[10px] bg-gray-700 text-gray-400 px-1.5 rounded group-hover:bg-gray-600">Bio</span>
              </button>

              <button 
                onClick={() => onLoadDataset('mentalhealth')}
                className="w-full py-2 px-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 text-xs rounded transition-all flex items-center justify-between group"
              >
                <span>Biopsychosocial Model</span>
                <span className="text-[10px] bg-pink-900/30 text-pink-400 border border-pink-800 px-1.5 rounded">Psych</span>
              </button>

              <button 
                onClick={() => onLoadDataset('moviekg')}
                className="w-full py-2 px-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 text-xs rounded transition-all flex items-center justify-between group"
              >
                <span>Cinematic KG (IMDB)</span>
                <span className="text-[10px] bg-purple-900/30 text-purple-400 border border-purple-800 px-1.5 rounded">Media</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* RAG Modules Configuration */}
      <div className="p-6 flex-1">
        <h2 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">RAG Modules</h2>
        
        <div className="space-y-5">
          {/* Retrieval Method Module */}
          <div className="group">
            <div className="flex justify-between items-center mb-1.5">
               <label className="text-xs text-blue-400 font-medium">Retrieval Strategy</label>
               <span className="text-[9px] text-gray-600 border border-gray-700 rounded px-1">Retriever</span>
            </div>
            <select 
              value={config.retrievalMethod}
              onChange={(e) => setConfig({...config, retrievalMethod: e.target.value as RetrievalMethod})}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              {RETRIEVAL_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* Embedding Model Module */}
          <div>
             <div className="flex justify-between items-center mb-1.5">
               <label className="text-xs text-emerald-400 font-medium">Embedding Model</label>
               <span className="text-[9px] text-gray-600 border border-gray-700 rounded px-1">Encoder</span>
            </div>
            <select 
              value={config.embeddingModel}
              onChange={(e) => setConfig({...config, embeddingModel: e.target.value as EmbeddingModel})}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              {EMBEDDING_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* Synthesis Model (NEW) */}
          <div>
             <div className="flex justify-between items-center mb-1.5">
               <label className="text-xs text-purple-400 font-medium">Synthesis Model</label>
               <span className="text-[9px] text-gray-600 border border-gray-700 rounded px-1">Generator</span>
            </div>
            <select 
              value={config.synthesisModel}
              onChange={(e) => setConfig({...config, synthesisModel: e.target.value as SynthesisModel})}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              {SYNTHESIS_OPTIONS.map(opt => (
                <option key={opt} value={opt}>
                   {opt === 'gemini-2.5-flash' ? 'Gemini Flash (Fast)' : 'Gemini Pro (Smart)'}
                </option>
              ))}
            </select>
          </div>

          {/* Response Style (NEW) */}
          <div>
             <div className="flex justify-between items-center mb-1.5">
               <label className="text-xs text-amber-400 font-medium">Response Style</label>
               <span className="text-[9px] text-gray-600 border border-gray-700 rounded px-1">Persona</span>
            </div>
            <select 
              value={config.responseStyle}
              onChange={(e) => setConfig({...config, responseStyle: e.target.value as ResponseStyle})}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              {STYLE_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* Hyperparameters */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-800">
             <div>
                <label className="text-xs text-gray-500 mb-2 block">Top K Nodes</label>
                <input 
                  type="number" 
                  min="1" max="10"
                  value={config.topK}
                  onChange={(e) => setConfig({...config, topK: parseInt(e.target.value)})}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs text-white text-center"
                />
             </div>
             <div>
                <label className="text-xs text-gray-500 mb-2 block">Graph Depth</label>
                <input 
                  type="number" 
                  min="1" max="3"
                  value={config.graphDepth}
                  onChange={(e) => setConfig({...config, graphDepth: parseInt(e.target.value)})}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs text-white text-center"
                />
             </div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-gray-850 border-t border-gray-800 flex justify-between items-center">
         <span className="text-[10px] text-gray-600">Gemini 2.5 & D3.js</span>
         <button 
           onClick={onOpenDocs}
           className="text-[10px] flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
         >
           <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
           </svg>
           How it Works
         </button>
      </div>
    </div>
  );
};

export default Sidebar;