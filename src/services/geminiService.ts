/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";
import { ScriptRequest, ScriptResponse } from "../types";

export const generateScript = async (request: ScriptRequest): Promise<ScriptResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
  
  const beatCounts: Record<string, number> = {
    "15 seconds": 2,
    "30 seconds": 3,
    "60 seconds": 5
  };
  
  const platformNotes: Record<string, string> = {
    "TikTok": "Casual but clear, use trending phrases sparingly, focus on high retention",
    "Reels": "Instagram aesthetic, aspirational language, visual cues",
    "Shorts": "YouTube-friendly, direct and informational",
    "Twitter/X": "Punchy, thread-style thinking, controversial angles OK"
  };

  const prompt = `You are an expert short-form video script writer with a focus on SEO, clarity, and algorithmic performance.

Generate a ${request.duration} ${request.platform} video script about: "${request.topic}"

Tone: ${request.tone}
Required Body Beats: ${beatCounts[request.duration]}
Platform Style: ${platformNotes[request.platform]}

SEO Rules:
- Hook: Start with a searchable phrase directly (e.g., "How to fix X" or "Why your X does Y").
- Hook Length: Keep the hook under 15 words max.
- Keywords: Use natural keywords in body beats that people actually search for.
- CTA: Encourage saves and shares to boost algorithmic performance.

Clarity Rules:
- No Filler: Cut all unnecessary filler words. Every word must earn its place.
- Slang: Reduce Gen Z slang by 70%. Use it very sparingly, not in every sentence.
- Payoff: One clean, powerful sentence with a clear benefit.
- Tone Consistency: If tone is Informational, be direct and helpful, not overly casual.
- Pacing: Fast pacing, high retention focus.

Return ONLY a JSON object with this structure:
{
  "hook": "string",
  "body": ["beat 1", "beat 2", "beat 3"],
  "payoff": "string",
  "cta": "string"
}`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          hook: { type: Type.STRING },
          body: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          payoff: { type: Type.STRING },
          cta: { type: Type.STRING }
        },
        required: ["hook", "body", "payoff", "cta"]
      }
    }
  });

  const jsonStr = response.text.trim();
  
  try {
    const data = JSON.parse(jsonStr) as ScriptResponse;
    return data;
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    throw new Error("Failed to generate script. Please try again.");
  }
};
