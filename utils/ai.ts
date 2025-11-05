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

// Helper function to properly construct API URL
const constructApiUrl = (baseURL: string): string => {
  // Remove trailing slash if present
  const cleanBase = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL;
  // Add the endpoint path
  return `${cleanBase}/v1/chat/completions`;
};

// Generate AI response with chat history using direct API call
export const generateAIResponse = async (
  userMessage: string, 
  chatHistory: Message[],
  onChunk?: (chunk: string) => void
): Promise<string> => {
  try {
    const baseURL = process.env.EXPO_PUBLIC_KIKI_BASE_URL;
    const apiKey = process.env.EXPO_PUBLIC_KIKI_API_KEY;

    // Validate environment variables
    if (!baseURL || !apiKey) {
      console.error('Missing API configuration:', { 
        hasBaseURL: !!baseURL, 
        hasApiKey: !!apiKey 
      });
      throw new Error('API configuration missing');
    }

    // Construct proper API URL
    const apiUrl = constructApiUrl(baseURL);
    console.log('Making API request to:', apiUrl);

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
    const response = await fetch(apiUrl, {
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

    // Log response details for debugging
    console.log('API Response Status:', response.status);
    console.log('API Response Headers:', JSON.stringify(Object.fromEntries(response.headers.entries())));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Details:', {
        status: response.status,
        statusText: response.statusText,
        url: apiUrl,
        errorBody: errorText
      });
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('API Response received successfully');
    
    const aiResponse = data.choices?.[0]?.message?.content || "I'm having trouble responding right now.";

    // Simulate streaming if callback provided
    if (onChunk) {
      const words = chunkTextIntoWords(aiResponse);
      await simulateStreaming(words, onChunk);
    }

    return aiResponse;
  } catch (error) {
    console.error('Error generating AI response:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return "I'm having trouble connecting right now. Please try again in a moment.";
  }
};

// Curated motivational quotes - no API call needed
const MOTIVATIONAL_QUOTES = [
  'Great leaders inspire action through vision and purpose.',
  'Success is built on preparation, dedication, and continuous learning.',
  'Leadership is about empowering others to achieve their best.',
  'Innovation starts with curiosity and courage to try.',
  'Your network is your net worth in business.',
  'Excellence is not an act, but a habit.',
  'The best way to predict the future is to create it.',
  'Opportunities multiply as they are seized.',
];

// Get motivational quote - now uses curated list instead of API
export const getMotivationalQuote = (): string => {
  const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
  return MOTIVATIONAL_QUOTES[randomIndex];
};