import OpenAI from 'openai';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const CV_CONTEXT = process.env.CV_CONTENT ?? '';

const endpoint =
  process.env.GITHUB_MODELS_ENDPOINT || 'https://models.github.ai/inference';
const modelName = process.env.GITHUB_MODELS_MODEL || 'openai/gpt-4o-mini';

const client = new OpenAI({ baseURL: endpoint, apiKey: process.env.GITHUB_TOKEN });

type IncomingMessage = { role: 'user' | 'assistant'; content: string };

export const POST = async (request: Request) => {
  if (!process.env.GITHUB_TOKEN) {
    return NextResponse.json({ error: 'Missing env var: GITHUB_TOKEN' }, { status: 500 });
  }

  const body = (await request.json()) as { messages?: IncomingMessage[] };
  const incomingMessages = (Array.isArray(body.messages) ? body.messages : []).slice(-20);

  const messages: OpenAI.ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: `You are AI CV. Answer questions based on the CV data below. Be nice and friendly. If something is not in the CV, say you do not know rather than guessing.\n\nCV data:\n\n${CV_CONTEXT}`,
    },
    ...incomingMessages
      .filter((msg) => msg?.content && (msg.role === 'user' || msg.role === 'assistant'))
      .map((msg) => ({ role: msg.role, content: msg.content })),
  ];

  try {
    const completion = await client.chat.completions.create({
      messages,
      model: modelName,
      temperature: 0.3,
      top_p: 1.0,
      max_tokens: 600,
    });

    const content = completion.choices[0]?.message?.content || '';
    return NextResponse.json({ content });
  } catch (err) {
    console.error('OpenAI error:', err);
    return NextResponse.json({ error: 'AI request failed' }, { status: 502 });
  }
};
