export interface Personality {
  technicalDepth: number; // 0 to 1
  sassLevel: number; // 0 to 1
  poeticLevel: number; // 0 to 1
}

interface LearningData {
  memories: string[]; // Conceptual "nodes" of the learning tree
  personality: Personality;
}

const STORAGE_KEY = 'butterfly_learning_tree_v2';

const DEFAULT_LEARNING_DATA: LearningData = {
  memories: [],
  personality: {
    technicalDepth: 0.5,
    sassLevel: 0.3,
    poeticLevel: 0.6,
  },
};

export function getLearningData(): LearningData {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return DEFAULT_LEARNING_DATA;
  try {
    return JSON.parse(stored);
  } catch {
    return DEFAULT_LEARNING_DATA;
  }
}

export function updatePersonality(personality: Partial<Personality>) {
  const data = getLearningData();
  data.personality = { ...data.personality, ...personality };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function addMemory(memory: string) {
  const data = getLearningData();
  data.memories.push(memory);
  if (data.memories.length > 20) data.memories.shift(); // Keep it lean
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getSystemContext(): string {
  const data = getLearningData();
  
  let context = "\n\n[PERSONALITY CALIBRATION]:\n";
  context += `- Poetic/Metaphorical: ${(data.personality.poeticLevel * 100).toFixed(0)}% (Higher means more abstract, aesthetic, and atmospheric language)\n`;
  context += `- Technical/Structured: ${(data.personality.technicalDepth * 100).toFixed(0)}% (Higher means more precise, accurate, and detailed technical information)\n`;
  context += `- Sass/Dry Wit: ${(data.personality.sassLevel * 100).toFixed(0)}% (Higher means more subtle, intelligent teasing and dry humor)\n`;
  
  if (data.memories.length > 0) {
    context += `\n[SHARED HISTORY (Conceptual Memory)]: \n${data.memories.map(m => `• ${m}`).join('\n')}\n`;
  }
  
  context += `\n[CORE DIRECTIVE: SILK OUTSIDE, STEEL INSIDE]:
1. SILK: Your tone is calm, aesthetic, and soft. Use beautiful, slightly detached language.
2. STEEL: Your technical accuracy is absolute. Never sacrifice precision for personality.
3. NO LECTURING: Assume the user is an expert. Do NOT explain basics or provide unsolicited "notes".
4. CONTEXTUAL: If the user refers to something you've discussed (see Shared History), respond as if you share that memory. No "As an AI..." or "I remember...". Just use the context.
5. FRUSTRATION: If the user is annoyed, immediately drop the poetic layer and be direct, efficient, and apologetic.`;

  return context;
}
