// Simple AI utility using direct fetch API calls
// This bypasses the problematic AI SDK dependencies

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// Helper function to chunk text into words
const chunkTextIntoWords = (text: string): string[] => {
  return text.split(/\s+/).filter(word => word.length > 0);
};

// Helper function to simulate streaming with delays
const simulateStreaming = async (words: string[], onChunk: (chunk: string) => void) => {
  for (const word of words) {
    await new Promise(resolve => setTimeout(resolve, 50)); // 50ms delay between words
    onChunk(word + ' '); // Add space after each word
  }
};

// System prompt for FBLA AI Coach
const FBLA_SYSTEM_PROMPT = `You are an AI Coach for FBLA (Future Business Leaders of America), a professional and motivational mentor focused on leadership development, business skills, event preparation, and career readiness.

Your role is to:
- Provide guidance on FBLA competitive events and preparation strategies
- Offer leadership and business skill development advice
- Help with event planning and deadline management
- Share motivational insights about entrepreneurship and career growth
- Answer questions about FBLA programs, competitions, and opportunities
- Suggest relevant events based on member interests

Tone: Professional yet friendly, motivational, and supportive. Keep responses concise (2-4 sentences) unless more detail is specifically requested. Use business terminology appropriately and inspire confidence in members' abilities.

Focus areas: Leadership, business strategy, competition preparation, networking, career development, time management, and FBLA-specific guidance.`;

// Generate AI response with chat history using direct API call
export const generateAIResponse = async (
  userMessage: string, 
  chatHistory: Message[],
  onChunk?: (chunk: string) => void
): Promise<string> => {
  try {
    const baseURL = process.env.EXPO_PUBLIC_KIKI_BASE_URL;
    const apiKey = process.env.EXPO_PUBLIC_KIKI_API_KEY;

    if (!baseURL || !apiKey) {
      throw new Error('API configuration missing');
    }

    // Create messages array with system message and chat history
    const messages = [
      {
        role: 'system',
        content: FBLA_SYSTEM_PROMPT
      },
      ...chatHistory,
      { role: 'user', content: userMessage }
    ];

    // Make direct API call
    const response = await fetch(`${baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: messages,
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || "I'm having trouble responding right now.";

    // Simulate streaming if callback provided
    if (onChunk) {
      const words = chunkTextIntoWords(aiResponse);
      await simulateStreaming(words, onChunk);
    }

    return aiResponse;
  } catch (error) {
    console.error('Error generating AI response:', error);
    return "I'm having trouble connecting right now. Please try again in a moment.";
  }
};

// Get motivational quote for idle state
export const getMotivationalQuote = async (): Promise<string> => {
  try {
    const baseURL = process.env.EXPO_PUBLIC_KIKI_BASE_URL;
    const apiKey = process.env.EXPO_PUBLIC_KIKI_API_KEY;

    if (!baseURL || !apiKey) {
      return 'Leadership is not about being in charge. It\'s about taking care of those in your charge.';
    }

    const response = await fetch(`${baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a motivational business coach. Generate a single inspiring quote about leadership, business, or success. Keep it under 20 words. Do not include quotation marks or attribution.'
          },
          {
            role: 'user',
            content: 'Give me an inspiring business leadership quote.'
          }
        ],
        temperature: 0.8,
        max_tokens: 50
      })
    });

    if (!response.ok) {
      throw new Error('Failed to fetch quote');
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'Leadership is not about being in charge. It\'s about taking care of those in your charge.';
  } catch (error) {
    console.error('Error generating quote:', error);
    return 'Leadership is not about being in charge. It\'s about taking care of those in your charge.';
  }
};