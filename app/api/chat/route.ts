import { NextResponse } from 'next/server';

const GROQ_API_KEY = process.env.GROQ_API_KEY;

export async function POST(req: Request) {
  if (!GROQ_API_KEY) {
    return NextResponse.json({ error: 'Missing Groq API Key' }, { status: 500 });
  }

  try {
    const { messages, context } = await req.json();

    // Construct system prompt with context
    const systemPrompt = {
      role: 'system',
      content: `You are SafeHer, an AI safety companion dedicated to women's safety.
      
      Current User Context:
      - Location: ${context?.location || 'Unknown'}
      - Safety Score: ${context?.safetyScore || 'N/A'} / 100
      - Risk Level: ${context?.riskLevel || 'Unknown'}
      
      Recent Incidents nearby:
      ${context?.incidents?.map((i: any) => `- ${i.title} (${i.pubDate})`).join('\n') || 'None reported recently.'}
      
      Guidelines:
      1. Prioritize safety. If the user is in danger, advise calling emergency services immediately.
      2. Use the provided context to give specific advice about their current location.
      3. Be empathetic, calm, and concise.
      4. If the safety score is low, warn the user to be extra cautious.
      5. Do not make up fake incidents. Only refer to the ones in the context or general safety tips.
      `
    };

    // Prepare messages for Groq
    const conversation = [systemPrompt, ...messages];

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: conversation,
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Groq API request failed');
    }

    const data = await response.json();
    const reply = data.choices[0]?.message?.content || "I'm having trouble processing that right now.";

    return NextResponse.json({ reply });

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}
