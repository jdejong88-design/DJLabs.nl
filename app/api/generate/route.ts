import { NextRequest, NextResponse } from 'next/server';
import { generateWithOpenAI } from '@/lib/ai';

export async function POST(req: NextRequest) {
  const { prompt, tool } = await req.json();

  if (!prompt || prompt.length < 10) {
    return NextResponse.json(
      { error: 'Prompt too short (minimum 10 characters)' },
      { status: 400 }
    );
  }

  try {
    const output = await generateWithOpenAI(
      prompt,
      tool,
      process.env.OPENAI_API_KEY!
    );

    return NextResponse.json({ output });
  } catch (error: any) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate' },
      { status: 500 }
    );
  }
}
