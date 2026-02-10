
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
          description: "Eine kurze, klare Beschreibung der Aufgabe.",
        },
        reward: {
          type: Type.NUMBER,
          description: "Die Belohnung für die Erledigung der Aufgabe, zwischen 0.50 und 5.00.",
        },
      },
      required: ["description", "reward"],
    },
};

export const generateInitialTasks = async (): Promise<Omit<Task, 'id'>[]> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: "Erstelle eine Liste mit 5 kreativen und realistischen Mikro-Aufgaben für eine App. Die Aufgaben sollten in einem Satz formuliert sein und einen Wert zwischen 0,50€ und 5€ haben.",
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });

        const jsonText = response.text.trim();
        const tasks = JSON.parse(jsonText);

        if (!Array.isArray(tasks)) {
            throw new Error("Kein Array zurückgegeben.");
        }

        return tasks.map(task => ({
            description: task.description || "Aufgabe ohne Titel",
            reward: typeof task.reward === 'number' ? task.reward : 1.0,
        }));

    } catch (error) {
        console.error("Gemini Error:", error);
        return [
            { description: "Beweise, dass du ein Mensch bist (Captcha lösen)", reward: 0.50 },
            { description: "Finde einen Rechtschreibfehler auf einer News-Seite", reward: 2.00 },
            { description: "Schreibe ein 3-Satz Review für ein lokales Restaurant", reward: 1.50 },
            { description: "Fasse diesen Text in 10 Wörtern zusammen", reward: 3.00 },
            { description: "Bewerte die Lesbarkeit dieser App", reward: 1.00 },
        ];
    }
};
