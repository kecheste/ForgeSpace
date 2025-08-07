import { NextRequest, NextResponse } from 'next/server';
import { aiAnalyzerService } from '@/lib/services/ai-analyzer';

// Verify OpenAI API key is configured
if (!process.env.OPENAI_API_KEY) {
  console.warn(
    'OPENAI_API_KEY not configured - AI analysis will use mock data'
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, phase, tags } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      );
    }

    const analysis = await aiAnalyzerService.analyzeIdea({
      title,
      description,
      phase: phase || 'inception',
      tags: tags || [],
    });

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error analyzing idea:', error);
    return NextResponse.json(
      { error: 'Failed to analyze idea' },
      { status: 500 }
    );
  }
}
