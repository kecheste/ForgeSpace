import { POST } from '@/app/api/analyze-idea/route';
import { aiAnalyzerService } from '@/lib/services/ai-analyzer';
import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock the AI analyzer service
vi.mock('@/lib/services/ai-analyzer', () => ({
  aiAnalyzerService: {
    analyzeIdea: vi.fn(),
  },
}));

describe('/api/analyze-idea', () => {
  const mockAnalyzeIdea = vi.mocked(aiAnalyzerService.analyzeIdea);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST', () => {
    it('should return analysis for valid request', async () => {
      const mockAnalysis = {
        viabilityScore: 75,
        creativityPotential: 80,
        technicalFeasibility: 70,
        innovationLevel: 65,
        riskLevel: 'Medium' as const,
        developmentTime: '6-12 months',
        complexityLevel: 'Moderate',
        requiredResources: '150-300 hours',
        similarConcepts: [
          {
            name: 'Similar Concept A',
            relevance: 25,
            strengths: ['Well-established', 'Proven approach'],
            limitations: ['Limited innovation', 'Market saturation'],
          },
        ],
        improvementSuggestions: [
          {
            title: 'User-Centered Design',
            description:
              'Focus on user experience and needs throughout development',
            impact: 'High' as const,
            effort: 'Medium' as const,
          },
        ],
        recommendations: [
          'Clarify the core problem your idea solves',
          'Research existing solutions and identify gaps',
        ],
      };

      mockAnalyzeIdea.mockResolvedValue(mockAnalysis);

      const request = new NextRequest(
        'http://localhost:3000/api/analyze-idea',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: 'Test Idea',
            description: 'This is a test idea',
            phase: 'inception',
            tags: ['test', 'demo'],
          }),
        }
      );

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockAnalysis);
      expect(mockAnalyzeIdea).toHaveBeenCalledWith({
        title: 'Test Idea',
        description: 'This is a test idea',
        phase: 'inception',
        tags: ['test', 'demo'],
      });
    });

    it('should return 400 error when title is missing', async () => {
      const request = new NextRequest(
        'http://localhost:3000/api/analyze-idea',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            description: 'This is a test idea',
            phase: 'inception',
            tags: ['test', 'demo'],
          }),
        }
      );

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({
        error: 'Title and description are required',
      });
      expect(mockAnalyzeIdea).not.toHaveBeenCalled();
    });

    it('should return 400 error when description is missing', async () => {
      const request = new NextRequest(
        'http://localhost:3000/api/analyze-idea',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: 'Test Idea',
            phase: 'inception',
            tags: ['test', 'demo'],
          }),
        }
      );

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({
        error: 'Title and description are required',
      });
      expect(mockAnalyzeIdea).not.toHaveBeenCalled();
    });

    it('should return 400 error when both title and description are missing', async () => {
      const request = new NextRequest(
        'http://localhost:3000/api/analyze-idea',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phase: 'inception',
            tags: ['test', 'demo'],
          }),
        }
      );

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({
        error: 'Title and description are required',
      });
      expect(mockAnalyzeIdea).not.toHaveBeenCalled();
    });

    it('should use default values for optional fields', async () => {
      const mockAnalysis = {
        viabilityScore: 75,
        creativityPotential: 80,
        technicalFeasibility: 70,
        innovationLevel: 65,
        riskLevel: 'Medium' as const,
        developmentTime: '6-12 months',
        complexityLevel: 'Moderate',
        requiredResources: '150-300 hours',
        similarConcepts: [],
        improvementSuggestions: [],
        recommendations: [],
      };

      mockAnalyzeIdea.mockResolvedValue(mockAnalysis);

      const request = new NextRequest(
        'http://localhost:3000/api/analyze-idea',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: 'Test Idea',
            description: 'This is a test idea',
          }),
        }
      );

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockAnalysis);
      expect(mockAnalyzeIdea).toHaveBeenCalledWith({
        title: 'Test Idea',
        description: 'This is a test idea',
        phase: 'inception',
        tags: [],
      });
    });

    it('should handle service errors gracefully', async () => {
      mockAnalyzeIdea.mockRejectedValue(new Error('Service error'));

      const request = new NextRequest(
        'http://localhost:3000/api/analyze-idea',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: 'Test Idea',
            description: 'This is a test idea',
            phase: 'inception',
            tags: ['test', 'demo'],
          }),
        }
      );

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({
        error: 'Failed to analyze idea',
      });
    });

    it('should handle malformed JSON', async () => {
      const request = new NextRequest(
        'http://localhost:3000/api/analyze-idea',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: 'invalid json',
        }
      );

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({
        error: 'Failed to analyze idea',
      });
    });

    it('should handle empty body', async () => {
      const request = new NextRequest(
        'http://localhost:3000/api/analyze-idea',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({
        error: 'Failed to analyze idea',
      });
    });

    it('should handle special characters in input', async () => {
      const mockAnalysis = {
        viabilityScore: 75,
        creativityPotential: 80,
        technicalFeasibility: 70,
        innovationLevel: 65,
        riskLevel: 'Medium' as const,
        developmentTime: '6-12 months',
        complexityLevel: 'Moderate',
        requiredResources: '150-300 hours',
        similarConcepts: [],
        improvementSuggestions: [],
        recommendations: [],
      };

      mockAnalyzeIdea.mockResolvedValue(mockAnalysis);

      const request = new NextRequest(
        'http://localhost:3000/api/analyze-idea',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: 'Test Idea with 🚀 emoji and special chars: !@#$%^&*()',
            description: 'Description with unicode: 🎯📱💻 and symbols: ©®™',
            phase: 'inception',
            tags: ['test', 'demo', '🚀'],
          }),
        }
      );

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockAnalysis);
      expect(mockAnalyzeIdea).toHaveBeenCalledWith({
        title: 'Test Idea with 🚀 emoji and special chars: !@#$%^&*()',
        description: 'Description with unicode: 🎯📱💻 and symbols: ©®™',
        phase: 'inception',
        tags: ['test', 'demo', '🚀'],
      });
    });
  });
});
