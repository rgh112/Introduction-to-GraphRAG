import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, LogStep } from '../types';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (msg: string) => void;
  isProcessing: boolean;
  logs: LogStep[];
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, isProcessing, logs }) => {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, logs]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isProcessing) {
      onSendMessage(input);
      setInput("");
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 border-l border-gray-800 w-96 shadow-2xl z-10">
      {/* Header */}
      <div className="p-4 border-b border-gray-800 bg-gray-900">
        <h3 className="text-sm font-bold text-gray-200">Interactive RAG Chat</h3>
        <p className="text-xs text-gray-500">Ask questions about the visible graph</p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-600 text-sm mt-10">
            <p>No messages yet.</p>
            <p className="text-xs mt-2">Try asking: "What are the relationships here?" or specific node questions.</p>
          </div>
        )}
        
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div 
              className={`max-w-[85%] rounded-lg p-3 text-sm ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-none' 
                  : 'bg-gray-800 text-gray-200 rounded-bl-none border border-gray-700'
              }`}
            >
              {msg.content}
            </div>
            <span className="text-[10px] text-gray-600 mt-1">
              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}
        
        {/* Pipeline Visualization Logs */}
        {isProcessing && logs.length > 0 && (
          <div className="w-full bg-gray-950 rounded border border-gray-800 p-3 my-4 animate-pulse">
            <div className="text-xs font-mono text-emerald-500 mb-2 border-b border-gray-800 pb-1">
              > RAG Pipeline Active
            </div>
            <div className="space-y-2">
              {logs.map((log) => (
                <div key={log.id} className="flex items-center gap-2 text-xs font-mono">
                  {log.status === 'completed' && <span className="text-green-500">✓</span>}
                  {log.status === 'active' && <span className="text-blue-400 animate-spin">⟳</span>}
                  {log.status === 'pending' && <span className="text-gray-600">○</span>}
                  
                  <span className={log.status === 'active' ? 'text-gray-200' : 'text-gray-500'}>
                    <span className="font-bold">{log.stepName}:</span> {log.detail}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-800 bg-gray-900">
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isProcessing}
            placeholder={isProcessing ? "Processing..." : "Type your query..."}
            className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-full py-3 px-4 pr-12 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all disabled:opacity-50"
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isProcessing}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-blue-600 rounded-full text-white hover:bg-blue-500 disabled:opacity-0 transition-opacity"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
