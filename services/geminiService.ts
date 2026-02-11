
import { GoogleGenAI, Type } from "@google/genai";
import { Task } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY is not defined.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        description: {
          type: Type.STRING,
          description: "Kurzbeschreibung der Aufgabe.",
        },
        reward: {
          type: Type.NUMBER,
          description: "Belohnung (0.50 - 5.00).",
        },
        category: {
          type: Type.STRING,
          enum: ['photo', 'text', 'research', 'creative', 'technical'],
          description: "Die Kategorie der Aufgabe.",
        }
      },
      required: ["description", "reward", "category"],
    },
};

export const generateInitialTasks = async (): Promise<Omit<Task, 'id'>[]> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: "Erstelle 6 reale Mikro-Aufgaben für eine App. Mixe Kategorien. Sprache: Deutsch.",
            config: {
                systemInstruction: "Du bist ein erfahrener Ops-Manager. Erstelle Aufgaben, die sinnvoll für KI-Training oder lokale Validierung sind.",
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });
        return JSON.parse(response.text.trim());
    } catch (error) {
        console.error("Gemini Error:", error);
        return [
            { description: "Mache ein Foto von einem Menüboard", reward: 1.50, category: 'photo' },
            { description: "Prüfe Barrierefreiheit am Bahnhof", reward: 2.00, category: 'research' },
        ];
    }
};

export const getTaskHint = async (description: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Gib mir einen hilfreichen, kurzen Profi-Tipp für diese Aufgabe: "${description}". Max 3 Sätze.`,
        });
        return response.text || "Keine Tipps verfügbar.";
    } catch {
        return "Verbinde dich mit dem Internet für KI-Tipps.";
    }
};
