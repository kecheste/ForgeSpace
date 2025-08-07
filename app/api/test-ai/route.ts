import { aiAnalyzerService } from '@/lib/services/ai-analyzer';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test with a simple idea
    const testIdea = {
      title: 'AI-powered task management app',
      description:
        'A mobile app that uses AI to automatically prioritize and organize tasks based on user behavior and deadlines',
      phase: 'inception',
      tags: ['AI', 'productivity', 'mobile'],
    };

    const analysis = await aiAnalyzerService.analyzeIdea(testIdea);

    return NextResponse.json({
      success: true,
      analysis,
      apiKeyConfigured: !!process.env.OPENAI_API_KEY,
    });
  } catch (error) {
    console.error('Error testing AI:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        apiKeyConfigured: !!process.env.OPENAI_API_KEY,
      },
      { status: 500 }
    );
  }
}
