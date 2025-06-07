
import { GoogleGenAI, Modality } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_API_KEY! });

const session = await ai.live.connect({
    model: 'gemini-2.0-flash-live-001',
    callbacks: {
      onopen: () => console.log('Connected'),
      onmessage: (msg) => handleResponse(msg),
      onerror: (e) => console.error(e),
      onclose: () => console.log('Disconnected'),
    },
    config: { responseModalities: [Modality.TEXT] }
  });
  session.sendClientContent({ turns: "Hello, how are you?" });
  
