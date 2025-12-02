import { GoogleGenAI, Type } from "@google/genai";
import { CircuitState, CircuitNode, Wire } from '../types';
import { COMPONENT_DEFINITIONS } from '../constants';

// Fallback to env var if available (for developer)
const ENV_API_KEY = process.env.API_KEY || '';

const getAIClient = (userKey?: string) => {
  const key = userKey || ENV_API_KEY;
  if (!key) return null;
  return new GoogleGenAI({ apiKey: key });
};

export const validateConnection = async (userKey: string): Promise<boolean> => {
    try {
        const ai = getAIClient(userKey);
        if (!ai) return false;
        // Lightweight ping to check validity
        await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: 'ping',
        });
        return true;
    } catch (e) {
        console.error("Validation failed", e);
        return false;
    }
};

export const generateCircuit = async (prompt: string, userKey?: string): Promise<{ nodes: any[]; wires: any[]; description: string } | null> => {
  const ai = getAIClient(userKey);
  if (!ai) throw new Error("API Key not found");

  const availableComponents = Object.keys(COMPONENT_DEFINITIONS).join(', ');

  const systemInstruction = `
    You are an expert digital logic circuit designer. 
    Your task is to generate a JSON representation of a logic circuit based on the user's request.
    
    Available Component Types: ${availableComponents}.
    
    Rules:
    1. Grid System: Coordinates (x, y) should be multiples of 20.
    2. Layout: Arrange components logically from left (inputs) to right (outputs). Avoid overlapping.
    3. Wiring: Connect output ports to input ports.
    4. IDs: Use unique string IDs for nodes (e.g., "node_1") and wires (e.g., "wire_1").
    5. Port IDs: 
       - Gates: in1, in2, out. (NOT gate: in, out).
       - Sources: out.
       - LED: in.
       - HEX Display: in8, in4, in2, in1.
    6. Logic: Use NAND/NOR/XOR/XNOR appropriately for more complex logic.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Create a circuit for: ${prompt}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            nodes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  type: { type: Type.STRING },
                  x: { type: Type.NUMBER },
                  y: { type: Type.NUMBER },
                  rotation: { type: Type.NUMBER },
                  label: { type: Type.STRING }
                },
                required: ['id', 'type', 'x', 'y']
              }
            },
            wires: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  sourceNodeId: { type: Type.STRING },
                  sourcePortId: { type: Type.STRING },
                  targetNodeId: { type: Type.STRING },
                  targetPortId: { type: Type.STRING }
                },
                required: ['id', 'sourceNodeId', 'sourcePortId', 'targetNodeId', 'targetPortId']
              }
            },
            description: { type: Type.STRING }
          },
          required: ['nodes', 'wires', 'description']
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    return null;

  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};

export const explainCircuit = async (circuit: CircuitState, userKey?: string): Promise<string> => {
  const ai = getAIClient(userKey);
  if (!ai) throw new Error("API Key not found");

  const simpleCircuit = {
    nodes: circuit.nodes.map(n => ({ id: n.id, type: n.type, label: n.label })),
    wires: circuit.wires.map(w => ({ from: w.sourceNodeId, to: w.targetNodeId }))
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze this digital logic circuit and explain its function. Circuit data: ${JSON.stringify(simpleCircuit)}`,
      config: {
        systemInstruction: "You are a senior hardware engineer. Provide a concise, technical explanation of the circuit's function, truth table, or logic flow.",
      }
    });
    return response.text || "Could not generate explanation.";
  } catch (error) {
    console.error("Gemini Explanation Error:", error);
    return "Error connecting to AI service.";
  }
};