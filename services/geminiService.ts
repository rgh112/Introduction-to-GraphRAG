import { GoogleGenAI, Type } from "@google/genai";
import type { Schema } from "@google/genai";
import { GraphData, SystemConfig, RetrievalMethod, GraphNode, EmbeddingModel, ResponseStyle } from '../types';
import { GEMINI_MODEL_FAST, GEMINI_MODEL_GRAPH_GEN } from '../constants';

// Safely access process.env to avoid "process is not defined" ReferenceError in some browser environments
const getApiKey = () => {
  try {
    // @ts-ignore
    return process.env.API_KEY || '';
  } catch (e) {
    console.warn("process.env.API_KEY not accessible");
    return '';
  }
};

const apiKey = getApiKey();
const ai = new GoogleGenAI({ apiKey });

// Helper to clean JSON from Markdown blocks
const cleanJson = (text: string): string => {
  let clean = text.trim();
  if (clean.startsWith('```json')) {
    clean = clean.replace(/^```json/, '').replace(/```$/, '');
  } else if (clean.startsWith('```')) {
    clean = clean.replace(/^```/, '').replace(/```$/, '');
  }
  return clean.trim();
};

/**
 * COSINE SIMILARITY CALCULATION (The Math!)
 */
const cosineSimilarity = (vecA: number[], vecB: number[]): number => {
  if (vecA.length !== vecB.length) return 0;
  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    magnitudeA += vecA[i] * vecA[i];
    magnitudeB += vecB[i] * vecB[i];
  }
  magnitudeA = Math.sqrt(magnitudeA);
  magnitudeB = Math.sqrt(magnitudeB);
  if (magnitudeA === 0 || magnitudeB === 0) return 0;
  return dotProduct / (magnitudeA * magnitudeB);
};

/**
 * BATCH EMBEDDING GENERATION
 * Generates embeddings for all nodes in the graph using Gemini
 */
export const embedGraphNodes = async (nodes: GraphNode[]): Promise<GraphNode[]> => {
  if (!apiKey) throw new Error("API Key missing");
  console.log(`Starting batch embedding for ${nodes.length} nodes...`);

  const embeddedNodes = await Promise.all(nodes.map(async (node) => {
    try {
      // Create a rich text representation for embedding
      const textToEmbed = `${node.label}: ${node.description || ''}`;
      
      // Use explicit content structure: contents: [{ parts: [{ text: ... }] }]
      const response = await ai.models.embedContent({
        model: 'text-embedding-004',
        contents: [
          {
            parts: [
              { text: textToEmbed }
            ]
          }
        ], 
      });
      
      const embedding = response.embeddings?.[0]?.values;
      return { ...node, embedding };
    } catch (e) {
      console.warn(`Failed to embed node ${node.id}`, e);
      return node; // Return without embedding if failed
    }
  }));

  return embeddedNodes as GraphNode[];
};

/**
 * GENERATE GRAPH FROM SIMPLE TOPIC
 */
export const generateGraphFromTopic = async (topic: string): Promise<GraphData> => {
  if (!apiKey) throw new Error("API Key missing");

  const prompt = `
    Create a knowledge graph about the topic: "${topic}".
    Return a JSON object with 'nodes' and 'links'.
    
    STRICT RULE FOR CONSISTENCY:
    1. NODES: Generate 15-20 nodes. Each node must have a simple, unique 'id' (e.g., "n1", "n2", or short concepts like "AI", "ML").
    2. LINKS: Generate 20-30 links. The 'source' and 'target' fields in every link MUST EXACTLY MATCH one of the 'id' values in the nodes array.
    3. Do NOT refer to nodes by their label if the id is different.
    4. Ensure the graph is connected.

    Example:
    Nodes: [{ "id": "n1", "label": "Cat" }, { "id": "n2", "label": "Mammal" }]
    Links: [{ "source": "n1", "target": "n2", "label": "is a" }]
  `;

  return fetchGraphFromGemini(prompt, false);
};

/**
 * GENERATE GRAPH FROM REAL ACADEMIC PAPERS (Google Search Grounding)
 */
export const generateGraphFromPaperTopic = async (topic: string): Promise<GraphData> => {
    if (!apiKey) throw new Error("API Key missing");
  
    const prompt = `
      GOAL: Conduct a REAL-TIME literature review on "${topic}" using Google Search and build a Knowledge Graph.
      
      STEP 1: SEARCH
      - Search for 3-5 SPECIFIC academic papers, studies, or reputable articles.
      - Do NOT make up generic data. Use the Search Tool to find real authors, dates, and theories.

      STEP 2: GRAPH CONSTRUCTION (JSON)
      - Create Nodes for the Core Concepts (Group 1-3) and the Papers/Sources (Group 4).
      - Create Links to show causality (e.g., "Stress" -> "Cortisol").
      
      CRITICAL DATA RULES:
      1. **CITATIONS**: In the 'description' field of nodes, you MUST write the source. (e.g. "Source: Study by Smith et al., 2023").
      2. **LINK INTEGRITY**: The 'source' and 'target' in 'links' MUST EXACTLY MATCH the 'id' of a node. Do NOT use the label. If the ID is "p_1", the link must use "p_1".
      3. **CONNECTIVITY**: Create at least 20 links. Ensure 'Paper' nodes are linked to the concepts they discuss.

      JSON STRUCTURE:
      {
        "nodes": [
          { "id": "p1", "label": "Dopamine Hypoth.", "group": 1, "description": "Theory that... Source: Nature (2022)" },
          { "id": "src1", "label": "Howes et al (2015)", "group": 4, "description": "Review paper on dopamine..." }
        ],
        "links": [
          { "source": "src1", "target": "p1", "label": "proposes" }
        ]
      }
      
      Respond ONLY with the JSON string.
    `;
  
    // We pass 'true' to enable Google Search Tools
    return fetchGraphFromGemini(prompt, true);
  };

/**
 * SHARED HELPER TO CALL GEMINI FOR GRAPH GEN
 */
const fetchGraphFromGemini = async (prompt: string, useSearch: boolean): Promise<GraphData> => {
    
    // Config for Simple Generation (No Search) -> Use Schema
    const responseSchema: Schema = {
        type: Type.OBJECT,
        properties: {
          nodes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                label: { type: Type.STRING },
                description: { type: Type.STRING },
                group: { type: Type.INTEGER },
              },
              required: ["id", "label", "group"]
            }
          },
          links: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                source: { type: Type.STRING },
                target: { type: Type.STRING },
                label: { type: Type.STRING },
              },
              required: ["source", "target", "label"]
            }
          }
        },
        required: ["nodes", "links"]
      };
    
      try {
        // Base Config
        let config: any = {
            temperature: 0.1, // Lower temperature to force strict JSON and facts
        };

        if (useSearch) {
            // When using Tools (Google Search), we CANNOT enforce responseSchema or responseMimeType in the same strict way 
            // without risking errors in some environments. We rely on the prompt to output JSON.
            config.tools = [{ googleSearch: {} }];
        } else {
            // For pure generation, we enforce Schema for safety
            config.responseMimeType = "application/json";
            config.responseSchema = responseSchema;
        }

        const response = await ai.models.generateContent({
          model: GEMINI_MODEL_GRAPH_GEN,
          contents: [
            {
              parts: [
                { text: prompt }
              ]
            }
          ],
          config: config
        });
    
        const text = response.text || "{}";
        
        // With Search, the model might output text before the JSON or grounding metadata.
        // We use cleanJson to strip markdown.
        let rawData;
        try {
            rawData = JSON.parse(cleanJson(text));
        } catch (e) {
            console.error("JSON Parse Failed. Raw text:", text);
            // Fallback: Try to find the first '{' and last '}'
            const start = text.indexOf('{');
            const end = text.lastIndexOf('}');
            if (start !== -1 && end !== -1) {
                rawData = JSON.parse(text.substring(start, end + 1));
            } else {
                throw new Error("Could not parse Graph JSON from Gemini response");
            }
        }
        
        // Ensure robust structure
        const data: GraphData = {
          nodes: Array.isArray(rawData.nodes) ? rawData.nodes : [],
          links: Array.isArray(rawData.links) ? rawData.links : []
        };
        
        // Add default visual weight if missing
        data.nodes = data.nodes.map(n => ({ ...n, val: Math.random() * 10 + 5 }));
    
        // CRITICAL: Filter links that point to non-existent nodes to prevent D3 errors
        const validNodeIds = new Set(data.nodes.map(n => n.id));
        const initialLinkCount = data.links.length;
        data.links = data.links.filter(link => 
          validNodeIds.has(link.source) && validNodeIds.has(link.target)
        );
        
        if (data.links.length < initialLinkCount) {
            console.warn(`Dropped ${initialLinkCount - data.links.length} invalid links due to ID mismatch.`);
        }
        
        // Log grounding metadata if available (for debugging)
        if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
            console.log("Grounding Sources:", response.candidates[0].groundingMetadata.groundingChunks);
        }
    
        return data;
    
      } catch (error) {
        console.error("Graph Generation Error:", error);
        throw error;
      }
}

export interface RagResponse {
  answer: string;
  seedNodeIds: string[];
  traversedNodeIds: string[];
  reasoning: string;
}

export const performGraphRag = async (
  query: string,
  graphData: GraphData,
  config: SystemConfig
): Promise<RagResponse> => {
  if (!apiKey) throw new Error("API Key missing");

  // 1. EMBED THE QUERY (Real-Time)
  let queryEmbedding: number[] = [];
  try {
    // Correctly structure the contents for embedContent
    const response = await ai.models.embedContent({
      model: 'text-embedding-004',
      contents: [
        {
          parts: [
            { text: query }
          ]
        }
      ], 
    });
    
    if (response.embeddings?.[0]?.values) {
      queryEmbedding = response.embeddings[0].values;
    } else {
      throw new Error("Failed to generate query embedding: Response missing values");
    }
  } catch (e) {
    console.error("Embedding Error", e);
    return {
      answer: "I failed to calculate embeddings. Please check API quota.",
      seedNodeIds: [],
      traversedNodeIds: [],
      reasoning: "Embedding Generation Failed."
    };
  }

  // 2. VECTOR SEARCH (Find Seeds)
  const nodesWithEmbeddings = graphData.nodes.filter(n => n.embedding && n.embedding.length > 0);
  
  if (nodesWithEmbeddings.length === 0) {
    return {
      answer: "The graph nodes do not have embeddings calculated yet. Please regenerate or reload the graph to enable vector search.",
      seedNodeIds: [],
      traversedNodeIds: [],
      reasoning: "Missing Node Embeddings."
    };
  }

  // Calculate scores
  const scoredNodes = nodesWithEmbeddings.map(node => ({
    id: node.id,
    score: cosineSimilarity(queryEmbedding, node.embedding!),
    node: node
  }));

  // Sort by similarity descending
  scoredNodes.sort((a, b) => b.score - a.score);

  // Pick Top K
  const topK = config.topK || 3;
  const seeds = scoredNodes.slice(0, topK);
  const seedIds = seeds.map(s => s.id);

  // 3. GRAPH TRAVERSAL (Find Context)
  const neighborIds = new Set<string>();
  let currentFrontier = [...seedIds];
  const depth = config.graphDepth || 1;

  for (let d = 0; d < depth; d++) {
    const nextFrontier: string[] = [];
    for (const nodeId of currentFrontier) {
      // Find outgoing or incoming links
      const connectedLinks = graphData.links.filter(l => l.source === nodeId || l.target === nodeId);
      for (const link of connectedLinks) {
        const neighbor = link.source === nodeId ? link.target : link.source;
        if (!seedIds.includes(neighbor) && !neighborIds.has(neighbor)) {
          neighborIds.add(neighbor);
          nextFrontier.push(neighbor);
        }
      }
    }
    currentFrontier = nextFrontier;
  }
  
  const traversedIds = Array.from(neighborIds);
  const allRelevantNodeIds = [...seedIds, ...traversedIds];

  // 4. CONTEXT CONSTRUCTION
  const relevantNodes = graphData.nodes.filter(n => allRelevantNodeIds.includes(n.id));
  const relevantLinks = graphData.links.filter(l => 
    allRelevantNodeIds.includes(l.source) && allRelevantNodeIds.includes(l.target)
  );

  const contextText = `
    Query: "${query}"
    
    Top Matches (Vector Search):
    ${seeds.map(s => `- ${s.node.label} (Similarity: ${s.score.toFixed(4)})`).join('\n')}

    Relevant Graph Context (Nodes):
    ${relevantNodes.map(n => `- ${n.id} (${n.label}): ${n.description}`).join('\n')}

    Relevant Graph Context (Relationships):
    ${relevantLinks.map(l => `- ${l.source} --[${l.label}]--> ${l.target}`).join('\n')}
  `;

  // 5. LLM SYNTHESIS
  const synthesisPrompt = `
    You are an expert AI assistant answering questions based on a specific Knowledge Graph.
    
    User Configuration:
    - Response Style: ${config.responseStyle}
    
    Instructions:
    1. Use ONLY the provided context to answer the query.
    2. Adopt the requested response style.
    3. Explain your reasoning by referencing the retrieved nodes and their relationships.
    4. If the answer is not in the graph, say "Based on the current graph, I don't have enough information."
  `;

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      answer: { type: Type.STRING },
      reasoning: { type: Type.STRING }
    }
  };

  try {
    const targetModel = config.synthesisModel === 'gemini-2.5-flash-thinking' 
        ? 'gemini-2.5-flash'
        : 'gemini-2.5-flash';

    const response = await ai.models.generateContent({
      model: targetModel, 
      contents: [
        {
          role: 'user', 
          parts: [
            { text: synthesisPrompt }, 
            { text: contextText }
          ] 
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: config.responseStyle === ResponseStyle.DETAILED ? 0.5 : 0.3
      }
    });

    const text = response.text || "{}";
    const result = JSON.parse(cleanJson(text));

    return {
      answer: result.answer,
      reasoning: result.reasoning + `\n\n[Model: ${config.synthesisModel}] [Style: ${config.responseStyle}]`,
      seedNodeIds: seedIds,
      traversedNodeIds: traversedIds
    };

  } catch (error) {
    console.error("RAG Synthesis Error:", error);
    return {
      answer: "Error generating answer from context.",
      seedNodeIds: seedIds,
      traversedNodeIds: traversedIds,
      reasoning: "Synthesis failed."
    };
  }
};