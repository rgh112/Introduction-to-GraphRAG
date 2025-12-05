export interface GraphNode {
  id: string;
  label: string;
  group: number;
  description?: string;
  val?: number; // Visual weight
  embedding?: number[]; // Stores the vector representation (768 dimensions)
}

export interface GraphLink {
  source: string;
  target: string;
  label: string;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  content: string;
  timestamp: number;
}

export enum RetrievalMethod {
  VECTOR_SIMILARITY = 'Vector Similarity (Real)',
  HYBRID_SEARCH = 'Hybrid (Vector + Keyword)',
  GRAPH_TRAVERSAL = 'Graph Traversal (Multi-hop)',
}

export enum EmbeddingModel {
  GEMINI_EMBEDDING = 'text-embedding-004',
}

export enum SynthesisModel {
  GEMINI_FLASH = 'gemini-2.5-flash',
  GEMINI_PRO = 'gemini-2.5-flash-thinking' // Simulating a smarter model choice
}

export enum ResponseStyle {
  CONCISE = 'Concise & Direct',
  DETAILED = 'Detailed & Explanatory',
  SCIENTIFIC = 'Scientific & Technical'
}

export interface SystemConfig {
  retrievalMethod: RetrievalMethod;
  embeddingModel: EmbeddingModel;
  synthesisModel: SynthesisModel; // New
  responseStyle: ResponseStyle;   // New
  topK: number;
  graphDepth: number;
}

export interface LogStep {
  id: string;
  stepName: string;
  detail: string;
  status: 'pending' | 'active' | 'completed';
}

export type VisualState = 'idle' | 'scanning' | 'seeds' | 'traversing' | 'complete';

export interface RagInsight {
  isActive: boolean;
  visualState: VisualState; // New: Controls the graph animation phase
  logs: LogStep[];
  reasoning: string | null;
  seedNodeIds: string[];      // New: Directly retrieved nodes
  traversedNodeIds: string[]; // New: Connected neighbors
  retrievedNodeIds: string[]; // Union of seeds + traversed
}

export type GroupLegend = Record<number, string>;