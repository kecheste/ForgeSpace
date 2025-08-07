import { NextRequest, NextResponse } from 'next/server';
import { aiAnalyzerService } from '@/lib/services/ai-analyzer';

// Verify OpenAI API key is configured
if (!process.env.OPENAI_API_KEY) {
  console.warn(
    'OPENAI_API_KEY not configured - AI suggestions will use mock data'
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, phase } = body;

    if (!title || !description || !phase) {
      return NextResponse.json(
        { error: 'Title, description, and phase are required' },
        { status: 400 }
      );
    }

    const suggestions = await aiAnalyzerService.generatePhaseSuggestions(
      {
        title,
        description,
        phase,
        tags: [],
      },
      phase
    );

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('Error generating phase suggestions:', error);
    return NextResponse.json(
      { error: 'Failed to generate suggestions' },
      { status: 500 }
    );
  }
}
