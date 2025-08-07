import type { IdeaData, Phase } from '@/lib/services/ai-analyzer';
import { aiAnalyzerService } from '@/lib/services/ai-analyzer';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock OpenAI
const mockCreate = vi.fn();
const mockOpenAI = vi.fn(() => ({
  chat: {
    completions: {
      create: mockCreate,
    },
  },
}));

vi.mock('openai', () => ({
  default: mockOpenAI,
}));

describe('AIAnalyzerService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset environment variables
    delete process.env.OPENAI_API_KEY;
  });

  describe('analyzeIdea', () => {
    it('should analyze idea with OpenAI when API key is available', async () => {
      process.env.OPENAI_API_KEY = 'test-key';

      const mockResponse = {
        choices: [
          {
            message: {
              content: JSON.stringify({
                viabilityScore: 85,
                creativityPotential: 90,
                technicalFeasibility: 80,
                innovationLevel: 75,
                riskLevel: 'Low',
                developmentTime: '3-6 months',
                complexityLevel: 'Low',
                requiredResources: '100-200 hours',
                similarConcepts: [],
                improvementSuggestions: [],
                recommendations: ['Great idea!'],
              }),
            },
          },
        ],
      };

      mockCreate.mockResolvedValue(mockResponse);

      const ideaData: IdeaData = {
        title: 'Test Idea',
        description: 'A test idea for analysis',
        phase: 'inception',
        tags: ['test'],
      };

      const result = await aiAnalyzerService.analyzeIdea(ideaData);

      expect(mockOpenAI).toHaveBeenCalledWith({
        apiKey: 'test-key',
      });
      expect(mockCreate).toHaveBeenCalled();
      expect(result.viabilityScore).toBe(85);
      expect(result.creativityPotential).toBe(90);
    });

    it('should use mock analysis when OpenAI API key is not available', async () => {
      const ideaData: IdeaData = {
        title: 'Test Idea',
        description: 'A test idea for analysis',
        phase: 'inception',
        tags: ['test'],
      };

      const result = await aiAnalyzerService.analyzeIdea(ideaData);

      expect(mockOpenAI).not.toHaveBeenCalled();
      expect(result.viabilityScore).toBeGreaterThan(0);
      expect(result.viabilityScore).toBeLessThanOrEqual(100);
      expect(result.creativityPotential).toBeGreaterThan(0);
      expect(result.technicalFeasibility).toBeGreaterThan(0);
    });

    it('should handle OpenAI API errors gracefully', async () => {
      process.env.OPENAI_API_KEY = 'test-key';
      mockCreate.mockRejectedValue(new Error('API Error'));

      const ideaData: IdeaData = {
        title: 'Test Idea',
        description: 'A test idea for analysis',
        phase: 'inception',
        tags: ['test'],
      };

      const result = await aiAnalyzerService.analyzeIdea(ideaData);

      expect(result.viabilityScore).toBeGreaterThan(0);
      expect(result.viabilityScore).toBeLessThanOrEqual(100);
    });

    it('should handle malformed AI responses', async () => {
      process.env.OPENAI_API_KEY = 'test-key';

      const mockResponse = {
        choices: [
          {
            message: {
              content: 'Invalid JSON response',
            },
          },
        ],
      };

      mockCreate.mockResolvedValue(mockResponse);

      const ideaData: IdeaData = {
        title: 'Test Idea',
        description: 'A test idea for analysis',
        phase: 'inception',
        tags: ['test'],
      };

      const result = await aiAnalyzerService.analyzeIdea(ideaData);

      expect(result.viabilityScore).toBeGreaterThan(0);
      expect(result.viabilityScore).toBeLessThanOrEqual(100);
    });

    it('should generate different mock analyses for different input qualities', async () => {
      const highQualityData: IdeaData = {
        title: 'Innovative AI-Powered Solution',
        description:
          'A comprehensive AI solution that addresses multiple pain points with clear market potential and technical feasibility.',
        phase: 'development',
        tags: ['ai', 'innovation', 'market-ready'],
      };

      const lowQualityData: IdeaData = {
        title: 'Test',
        description: 'Basic idea',
        phase: 'inception',
        tags: ['test'],
      };

      const highQualityResult =
        await aiAnalyzerService.analyzeIdea(highQualityData);
      const lowQualityResult =
        await aiAnalyzerService.analyzeIdea(lowQualityData);

      // High quality should generally score higher
      expect(highQualityResult.viabilityScore).toBeGreaterThanOrEqual(
        lowQualityResult.viabilityScore
      );
      expect(highQualityResult.creativityPotential).toBeGreaterThanOrEqual(
        lowQualityResult.creativityPotential
      );
    });
  });

  describe('generatePhaseSuggestions', () => {
    it('should generate suggestions for inception phase', async () => {
      const suggestions = await aiAnalyzerService.generatePhaseSuggestions(
        {
          title: 'Test Idea',
          description: 'A test idea for analysis',
          phase: 'inception',
          tags: ['test'],
        },
        'inception'
      );

      expect(Array.isArray(suggestions)).toBe(true);
      expect(suggestions.length).toBeGreaterThan(0);
      expect(typeof suggestions[0]).toBe('string');
    });

    it('should generate suggestions for development phase', async () => {
      const suggestions = await aiAnalyzerService.generatePhaseSuggestions(
        {
          title: 'Test Idea',
          description: 'A test idea for analysis',
          phase: 'inception',
          tags: ['test'],
        },
        'development'
      );

      expect(Array.isArray(suggestions)).toBe(true);
      expect(suggestions.length).toBeGreaterThan(0);
    });

    it('should generate suggestions for validation phase', async () => {
      const suggestions = await aiAnalyzerService.generatePhaseSuggestions(
        {
          title: 'Test Idea',
          description: 'A test idea for analysis',
          phase: 'inception',
          tags: ['test'],
        },
        'validation'
      );

      expect(Array.isArray(suggestions)).toBe(true);
      expect(suggestions.length).toBeGreaterThan(0);
    });

    it('should handle unknown phases gracefully', async () => {
      // Create a union type of known phases and 'unknown'
      type TestPhase = Phase | 'unknown';

      const suggestions = await aiAnalyzerService.generatePhaseSuggestions(
        {
          title: 'Test Idea',
          description: 'A test idea for analysis',
          phase: 'inception',
          tags: ['test'],
        },
        'unknown' as TestPhase
      );

      expect(Array.isArray(suggestions)).toBe(true);
      expect(suggestions.length).toBeGreaterThan(0);
    });
  });
});
