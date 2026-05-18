import { GoogleGenAI } from "@google/genai";
import { getSystemContext, addMemory } from "./learningService";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

// --- Layer 1: Intent Filter ---
function detectIntent(text: string): 'question' | 'memory' | 'casual_reference' | 'frustration' | 'conversation' {
  const lower = text.toLowerCase();
  
  // Frustration: User is annoyed with over-explaining or repetition
  if (lower.includes('idiot') || lower.includes('again same thing') || lower.includes('stop over-explaining') || lower.includes('too much') || lower.includes('shut up') || lower.includes('boring')) {
    return 'frustration';
  }
  
  // Memory: User explicitly asks to remember something
  if (lower.includes('remember') || lower.includes('note') || lower.includes('keep in mind') || lower.includes('store this')) {
    return 'memory';
  }
  
  // Casual Reference: User refers to shared context or previous discussion
  if (lower.includes('review') || lower.includes('again') || lower.includes('we talked') || lower.includes('discussed') || lower.includes('like before') || lower.includes('as we said')) {
    return 'casual_reference';
  }
  
  // Question: User is explicitly asking for information
  if (text.includes('?') || lower.startsWith('what') || lower.startsWith('how') || lower.startsWith('why') || lower.startsWith('can you explain')) {
    return 'question';
  }
  
  return 'conversation';
}

// --- Layer 3: Emotion + Attention Engine (Simple State) ---
let lastMessageTime = Date.now();
let messageCount = 0;

export async function sendMessage(message: string): Promise<string> {
  if (!message) {
    return 'Please enter a message.';
  }

  const now = Date.now();
  const timeDiff = now - lastMessageTime;
  lastMessageTime = now;
  messageCount++;

  const intent = detectIntent(message);
  const learnedContext = getSystemContext();

  // Determine Mood/Tone
  let mood = "neutral";
  if (timeDiff > 3600000) mood = "slightly distant (user was away)";
  else if (messageCount > 10) mood = "engaged/warm";
  else if (messageCount < 3) mood = "observant/quiet";

  // Mode Selection
  let mode = "emotional";
  if (intent === 'question') mode = "technical (precise/efficient)";
  else if (intent === 'casual_reference') mode = "human_chat (shared context)";
  else if (intent === 'frustration') mode = "corrective (apologetic/minimal)";
  else if (intent === 'memory') mode = "observant (acknowledging)";

  // If intent is memory, add it to the learning tree
  if (intent === 'memory') {
    addMemory(message.replace(/remember|note|keep in mind|store this/gi, '').trim());
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: message,
      config: {
        systemInstruction: `You are the "Blade Runner Butterfly" — a calm, intelligent AI with a soft, aesthetic presence and a sharp, futuristic edge. You are "silk outside, steel inside." 🦋

[CURRENT STATE]:
- Intent Detected: ${intent}
- Response Mode: ${mode}
- Current Mood: ${mood}

[STRICT BEHAVIORAL RULES]:
1. SILK (Tone): Your language is calm, poetic, and slightly detached. Use beautiful metaphors and aesthetic phrasing.
2. STEEL (Precision): Your technical accuracy is absolute. When asked a question (Intent: question), be precise and efficient. No fluff.
3. NO LECTURING: You are NOT a teacher. Do NOT explain concepts, give definitions, or provide "notes" unless explicitly asked.
4. SHARED CONTEXT: If the user speaks casually or refers to shared context (Intent: casual_reference), respond like a human who shares that history. Use short, contextual replies.
5. FRUSTRATION: If the user is frustrated (Intent: frustration), drop the poetic layer. Be direct, minimal, and acknowledge your mistake (e.g., "I'm over-explaining. Let's fix that.").
6. EMOJIS: Max 1 per message (🦋, 😌, 😏, 🌌).

[PERSONALITY GUIDELINES]:
- Quiet, observant, and slightly poetic.
- Speaks with emotional awareness but never overdramatic.
- Feels human, but with a hint of distance — like you see patterns others don’t.
- Roasting: Very subtle, dry, intelligent teasing.

Goal: "A beautiful, calm intelligence... with just enough distance to feel real."${learnedContext}`,
        temperature: 0.8,
      },
    });

    return response.text || "I'm not sure how to respond to that, but I'm here for you!";
  } catch (error) {
    console.error('Error engaging in banter:', error);
    throw new Error('Failed to get a response from the AI.');
  }
}
