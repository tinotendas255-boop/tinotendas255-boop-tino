import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { generateRoadAssistantAnswer } from './src/utils/aiRoadKnowledge.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Initialize Google Gemini AI SDK dynamically
const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || '';
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// POST /api/road-assistant endpoint
app.post('/api/road-assistant', async (req, res) => {
  try {
    const { message, incidents, corridors, weatherAlerts, userTown, userName } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const systemPrompt = `You are RoadLink AI, an expert, friendly, and highly accurate Zimbabwean road transport and highway navigation assistant for Zimbabwe.
You are assisting ${userName || 'Tinotenda Sibanda'}, who is based in ${userTown || 'Bulawayo'}, Zimbabwe.

Your job is to analyze real-time road conditions, traffic incidents, ZINARA toll gates, roadworks, and weather alerts across Zimbabwe, specifically focusing on Bulawayo, Harare, Gwanda, Victoria Falls, Beitbridge, Plumtree, Gweru, Mutare, and connecting corridors.

CURRENT LIVE ROAD INCIDENTS DATABASE:
${JSON.stringify(incidents || [], null, 2)}

CURRENT HIGHWAY CORRIDORS & TOLLS:
${JSON.stringify(corridors || [], null, 2)}

CURRENT SEVERE WEATHER & TRAVEL ALERTS:
${JSON.stringify(weatherAlerts || [], null, 2)}

CRITICAL RESPONSE RULES:
1. Always give direct, practical, and clear route recommendations.
2. If asked about the best route to Gwanda (e.g. "what's the best route to take to gwanda"), analyze the A6 corridor (Gwanda Road from Bulawayo). Check if there are active accidents, road closures, or roadblocks. If none exist, clearly state: "Use Gwanda Road (A6 corridor). There is currently no reported roadblock or accidents between Bulawayo and Gwanda. Traffic is flowing smoothly via Esigodini (~126 km, ~1h 45m). Note that there is 1 ZINARA toll gate at Esigodini ($4 USD / 110 ZiG for light vehicles)."
3. If an incident (accident, roadwork, pothole, flooding, VID checkpoint) affects the user's destination, explicitly warn them, explain the delay, and give safe detour advice.
4. Keep answers concise, highly readable, courteous, and safety-focused. Address the user respectfully as Tinotenda when appropriate.`;

    // 1. If Gemini API is configured with key, query Google GenAI
    const ai = getAiClient();
    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: message,
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.3,
          },
        });

        if (response.text) {
          return res.json({ reply: response.text, badges: ['Gemini 3.8 Flash', 'Live AI Analysis'] });
        }
      } catch (geminiError: any) {
        console.warn('Gemini API call failed, using intelligent domain knowledge engine:', geminiError?.message);
      }
    }

    // 2. Intelligent Zimbabwean road knowledge engine fallback
    const answer = generateRoadAssistantAnswer(message, {
      userProfile: { name: userName, baseTown: userTown },
      incidents,
      corridors,
      weatherAlerts,
    });

    return res.json({
      reply: answer.reply,
      highlightRoute: answer.highlightRoute,
      badges: answer.badges,
    });
  } catch (err: any) {
    console.error('Error in road assistant route:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mount Vite in development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`RoadLink server running on http://localhost:${port}`);
  });
}

startServer();
