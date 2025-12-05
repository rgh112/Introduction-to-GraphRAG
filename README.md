# 📊 Introduction to GraphRAG

An interactive educational platform for understanding **Graph Retrieval-Augmented Generation (GraphRAG)** with real-time knowledge graph visualization.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)
![Gemini](https://img.shields.io/badge/Google-Gemini_API-4285F4?logo=google)

## ✨ Features

### 📖 Educational Content
- Mathematical foundations of GraphRAG (LaTeX formulas)
- RAG evolution: Naive → Advanced → Modular
- GraphRAG taxonomy: Knowledge-based, Index-based, Hybrid
- Evaluation metrics framework

### 🔬 Interactive Demo
- **AI Graph Generator**: Generate knowledge graphs from any topic
- **Live Scholar Search**: Build graphs from real academic papers
- **Sample Datasets**: PrimeKG (Medical), Biopsychosocial Model (Psychology), IMDB (Movies)
- **Real-time Visualization**: D3.js force-directed graph with multi-hop traversal

### 🤖 RAG Pipeline
- Vector similarity search with Gemini Embeddings
- Graph traversal (k-hop neighborhood)
- LLM synthesis with configurable response styles

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Google Gemini API Key ([Get one here](https://aistudio.google.com/apikey))

### Installation

```bash
# Clone the repository
git clone https://github.com/rgh112/Introduction-to-GraphRAG.git
cd Introduction-to-GraphRAG

# Install dependencies
npm install

# Run the app
npm run dev
```

### API Key Setup
1. Open the app in your browser
2. Enter your Gemini API Key in the sidebar
3. The key is saved locally in your browser

## 📚 References

1. Gao, Y., et al. (2024). *Retrieval-Augmented Generation for Large Language Models: A Survey*. arXiv:2312.10997
2. Peng, B., et al. (2024). *Graph Retrieval-Augmented Generation: A Survey*. arXiv:2408.08921
3. Hu, Z., et al. (2024). *A Survey of Graph Retrieval-Augmented Generation for Customized Large Language Models*

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Visualization**: D3.js
- **AI/ML**: Google Gemini API (2.5 Flash, Embeddings)
- **Build**: Vite
- **Math Rendering**: KaTeX

## 📄 License

MIT License - Educational Edition
