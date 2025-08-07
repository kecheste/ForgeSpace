import OpenAI from 'openai';

export interface ViabilityAnalysis {
  viabilityScore: number;
  creativityPotential: number;
  technicalFeasibility: number;
  innovationLevel: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  developmentTime: string;
  complexityLevel: string;
  requiredResources: string;
  similarConcepts: Array<{
    name: string;
    relevance: number;
    strengths: string[];
    limitations: string[];
  }>;
  improvementSuggestions: Array<{
    title: string;
    description: string;
    impact: 'Low' | 'Medium' | 'High';
    effort: 'Low' | 'Medium' | 'High';
  }>;
  recommendations: string[];
}

export interface IdeaData {
  title: string;
  description: string;
  phase: string;
  tags: string[];
  category?: string;
  targetAudience?: string;
  currentChallenges?: string[];
}

class AIAnalyzerService {
  private openai: OpenAI | null = null;

  constructor() {
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    }
  }

  private async callAIEndpoint(prompt: string): Promise<unknown> {
    if (!this.openai) {
      console.warn(
        'OPENAI_API_KEY not configured, using dynamic mock analysis'
      );
      return this.generateDynamicMockAnalysis({
        title: '',
        description: '',
        phase: '',
        tags: [],
      });
    }

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
      });

      const content = response.choices[0]?.message?.content;
      if (content) {
        return this.parseAIResponse(content);
      }
      return this.generateDynamicMockAnalysis({
        title: '',
        description: '',
        phase: '',
        tags: [],
      });
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      return this.generateDynamicMockAnalysis({
        title: '',
        description: '',
        phase: '',
        tags: [],
      });
    }
  }

  private parseAIResponse(responseText: string): unknown {
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return {
        suggestions: responseText
          .split('\n')
          .filter((line) => line.trim().length > 0),
        analysis: responseText,
      };
    } catch (error) {
      console.error('Error parsing AI response:', error);
      return {
        suggestions: [responseText],
        analysis: responseText,
      };
    }
  }

  private generateDynamicMockAnalysis(ideaData: IdeaData): ViabilityAnalysis {
    const titleLength = ideaData.title.length;
    const descriptionLength = ideaData.description.length;
    const hasTags = ideaData.tags.length > 0;
    const hasCategory = !!ideaData.category;
    const hasTargetAudience = !!ideaData.targetAudience;
    const phase = ideaData.phase || 'inception';

    // Calculate base score based on input quality
    let baseScore = 30; // Start with minimum score

    // Add points for title quality
    if (titleLength > 10) baseScore += 15;
    if (titleLength > 20) baseScore += 10;

    // Add points for description quality
    if (descriptionLength > 50) baseScore += 20;
    if (descriptionLength > 100) baseScore += 15;
    if (descriptionLength > 200) baseScore += 10;

    // Add points for additional context
    if (hasTags) baseScore += 10;
    if (hasCategory) baseScore += 10;
    if (hasTargetAudience) baseScore += 10;

    // Adjust based on phase
    const phaseMultiplier =
      {
        inception: 0.8,
        refinement: 0.9,
        planning: 1.0,
        execution_ready: 1.1,
      }[phase] || 0.8;

    baseScore = Math.min(100, Math.round(baseScore * phaseMultiplier));

    // Generate dynamic similar concepts based on category
    const similarConcepts = this.generateSimilarConcepts(
      ideaData.category,
      baseScore
    );

    // Generate dynamic improvement suggestions
    const improvementSuggestions = this.generateImprovementSuggestions(
      ideaData,
      baseScore
    );

    // Generate recommendations based on score and phase
    const recommendations = this.generateRecommendations(
      ideaData,
      baseScore,
      phase
    );

    return {
      viabilityScore: baseScore,
      creativityPotential: Math.round(baseScore * (0.8 + Math.random() * 0.4)),
      technicalFeasibility: Math.round(baseScore * (0.7 + Math.random() * 0.5)),
      innovationLevel: Math.round(baseScore * (0.6 + Math.random() * 0.6)),
      riskLevel: baseScore > 75 ? 'Low' : baseScore > 50 ? 'Medium' : 'High',
      developmentTime: this.generateDevelopmentTime(baseScore, phase),
      complexityLevel: this.generateComplexityLevel(baseScore),
      requiredResources: this.generateRequiredResources(
        baseScore,
        ideaData.category
      ),
      similarConcepts,
      improvementSuggestions,
      recommendations,
    };
  }

  private generateSimilarConcepts(
    category?: string,
    baseScore: number = 50
  ): Array<{
    name: string;
    relevance: number;
    strengths: string[];
    limitations: string[];
  }> {
    const categoryConcepts = {
      Technology: [
        {
          name: 'AI Assistant',
          relevance: 25,
          strengths: ['High demand', 'Scalable'],
          limitations: ['Complex implementation', 'Privacy concerns'],
        },
        {
          name: 'Mobile App',
          relevance: 18,
          strengths: ['User-friendly', 'Accessible'],
          limitations: ['Platform dependency', 'Development cost'],
        },
        {
          name: 'Web Platform',
          relevance: 12,
          strengths: ['Cross-platform', 'Easy updates'],
          limitations: ['Browser limitations', 'Performance issues'],
        },
      ],
      Healthcare: [
        {
          name: 'Health Monitoring',
          relevance: 30,
          strengths: ['Growing market', 'High value'],
          limitations: ['Regulatory hurdles', 'Privacy concerns'],
        },
        {
          name: 'Telemedicine',
          relevance: 22,
          strengths: ['Convenient', 'Cost-effective'],
          limitations: ['Technical barriers', 'Limited physical exams'],
        },
        {
          name: 'Medical Device',
          relevance: 15,
          strengths: ['High impact', 'Innovative'],
          limitations: ['FDA approval', 'High development cost'],
        },
      ],
      Education: [
        {
          name: 'Learning Platform',
          relevance: 35,
          strengths: ['High demand', 'Scalable'],
          limitations: ['Content creation', 'User engagement'],
        },
        {
          name: 'Educational Game',
          relevance: 25,
          strengths: ['Engaging', 'Effective'],
          limitations: ['Development complexity', 'Educational value'],
        },
        {
          name: 'Tutoring Service',
          relevance: 15,
          strengths: ['Personalized', 'Flexible'],
          limitations: ['Scalability', 'Quality control'],
        },
      ],
    };

    const defaultConcepts = [
      {
        name: 'Similar Concept A',
        relevance: 30,
        strengths: ['Well-established', 'Proven approach'],
        limitations: ['Limited innovation', 'Market saturation'],
      },
      {
        name: 'Innovative Solution B',
        relevance: 20,
        strengths: ['Creative approach', 'Unique features'],
        limitations: ['Unproven concept', 'Development risk'],
      },
      {
        name: 'Emerging Idea C',
        relevance: 10,
        strengths: ['Fresh perspective', 'High potential'],
        limitations: ['Uncertain demand', 'Technical challenges'],
      },
    ];

    const concepts =
      categoryConcepts[category as keyof typeof categoryConcepts] ||
      defaultConcepts;

    // Adjust relevance based on viability score
    return concepts.map((concept) => ({
      ...concept,
      relevance: Math.max(
        5,
        Math.min(40, concept.relevance + (baseScore - 50) / 10)
      ),
    }));
  }

  private generateImprovementSuggestions(
    ideaData: IdeaData,
    baseScore: number
  ): Array<{
    title: string;
    description: string;
    impact: 'Low' | 'Medium' | 'High';
    effort: 'Low' | 'Medium' | 'High';
  }> {
    const suggestions = [
      {
        title: 'User-Centered Design',
        description:
          'Focus on user experience and needs throughout development',
        impact: 'High' as const,
        effort: 'Medium' as const,
      },
      {
        title: 'Iterative Development',
        description:
          'Build and test in small increments to validate assumptions',
        impact: 'Medium' as const,
        effort: 'Low' as const,
      },
      {
        title: 'Cross-Platform Approach',
        description: 'Consider multiple platforms for broader reach',
        impact: 'High' as const,
        effort: 'High' as const,
      },
      {
        title: 'Accessibility Focus',
        description: 'Ensure the idea is accessible to diverse users',
        impact: 'Medium' as const,
        effort: 'Medium' as const,
      },
      {
        title: 'Sustainability Integration',
        description: 'Incorporate environmental and social responsibility',
        impact: 'High' as const,
        effort: 'Medium' as const,
      },
    ];

    // Return 2-3 suggestions based on score
    return suggestions.slice(0, baseScore > 70 ? 3 : 2);
  }

  private generateRecommendations(
    ideaData: IdeaData,
    baseScore: number,
    phase: string
  ): string[] {
    const recommendations = [];

    if (baseScore < 50) {
      recommendations.push('Clarify the core problem your idea solves');
      recommendations.push('Research existing solutions and identify gaps');
      recommendations.push(
        'Consider technical implementation challenges early'
      );
    }

    if (phase === 'inception') {
      recommendations.push('Validate the problem with potential users');
      recommendations.push('Create a simple prototype or mockup');
      recommendations.push('Research similar concepts and approaches');
    } else if (phase === 'refinement') {
      recommendations.push('Conduct user interviews and feedback sessions');
      recommendations.push('Build a functional prototype');
      recommendations.push('Define your unique value proposition');
    } else if (phase === 'planning') {
      recommendations.push('Create detailed technical specifications');
      recommendations.push('Develop implementation roadmap');
      recommendations.push('Identify required resources and skills');
    } else if (phase === 'execution_ready') {
      recommendations.push('Assemble your development team');
      recommendations.push('Set up development environment');
      recommendations.push('Create detailed project timeline');
    }

    if (!ideaData.category) {
      recommendations.push('Define your idea category and target domain');
    }

    if (!ideaData.targetAudience) {
      recommendations.push('Identify and research your target audience');
    }

    return recommendations.slice(0, 5); // Limit to 5 recommendations
  }

  private generateDevelopmentTime(baseScore: number, phase: string): string {
    const phaseTime =
      {
        inception: 12,
        refinement: 9,
        planning: 6,
        execution_ready: 3,
      }[phase] || 12;

    const adjustedTime = Math.max(
      3,
      Math.min(18, phaseTime - (baseScore - 50) / 10)
    );

    if (adjustedTime <= 6) return `${adjustedTime}-${adjustedTime + 3} months`;
    return `${adjustedTime}-${adjustedTime + 6} months`;
  }

  private generateComplexityLevel(baseScore: number): string {
    if (baseScore > 80) return 'Simple';
    if (baseScore > 60) return 'Moderate';
    if (baseScore > 40) return 'Complex';
    return 'Very Complex';
  }

  private generateRequiredResources(
    baseScore: number,
    category?: string
  ): string {
    const baseResources =
      {
        Technology: 100,
        Healthcare: 200,
        Education: 75,
        default: 150,
      }[category || 'default'] || 150;

    const multiplier = baseScore > 80 ? 0.5 : baseScore > 60 ? 0.8 : 1.2;
    const resources = Math.round(baseResources * multiplier);

    return `${resources} hours - ${Math.round(resources * 2)} hours`;
  }

  async analyzeIdea(ideaData: IdeaData): Promise<ViabilityAnalysis> {
    try {
      const prompt = `You are an idea development specialist helping creators evaluate and improve their concepts. Analyze this idea and provide a comprehensive assessment.

Idea to analyze:
Title: ${ideaData.title}
Description: ${ideaData.description}
Phase: ${ideaData.phase}
Category: ${ideaData.category || 'Not specified'}
Target Audience: ${ideaData.targetAudience || 'Not specified'}
Tags: ${ideaData.tags.join(', ')}

Please provide your analysis in the following JSON format (respond with ONLY the JSON, no additional text):

{
  "viabilityScore": 75,
  "creativityPotential": 80,
  "technicalFeasibility": 70,
  "innovationLevel": 65,
  "riskLevel": "Medium",
  "developmentTime": "6-12 months",
  "complexityLevel": "Moderate",
  "requiredResources": "150-300 hours",
  "similarConcepts": [
    {
      "name": "Similar Concept Name",
      "relevance": 25,
      "strengths": ["Strength 1", "Strength 2"],
      "limitations": ["Limitation 1", "Limitation 2"]
    }
  ],
  "improvementSuggestions": [
    {
      "title": "Suggestion Title",
      "description": "Suggestion description",
      "impact": "High",
      "effort": "Medium"
    }
  ],
  "recommendations": [
    "Recommendation 1",
    "Recommendation 2"
  ]
}

Base your analysis on:
- Creativity and innovation potential
- Technical feasibility and complexity
- Similar existing concepts
- Development requirements
- Risk factors
- User value and impact
- Current trends and opportunities
- Target audience needs

Provide realistic, constructive assessments focused on idea development and improvement.`;

      const analysis = await this.callAIEndpoint(prompt);

      // Type guard to check if the analysis has the expected structure
      if (
        analysis &&
        typeof analysis === 'object' &&
        'viabilityScore' in analysis
      ) {
        return analysis as ViabilityAnalysis;
      }

      return this.generateDynamicMockAnalysis(ideaData);
    } catch (error) {
      console.error('Error analyzing idea:', error);
      return this.generateDynamicMockAnalysis(ideaData);
    }
  }

  async generatePhaseSuggestions(
    ideaData: IdeaData,
    phase: string
  ): Promise<string[]> {
    try {
      const phaseContext = {
        inception:
          'Define the core concept, problem statement, and target audience',
        refinement:
          'Validate assumptions, research similar concepts, and refine the solution',
        planning:
          'Create detailed implementation plan, timeline, and resource requirements',
        execution_ready:
          'Prepare for implementation, define development approach',
      };

      const prompt = `You are an idea development advisor helping creators improve their concepts. Provide 3-5 specific, actionable suggestions for improving this idea in the ${phase} phase.

                      Current idea:
                      Title: ${ideaData.title}
                      Description: ${ideaData.description}
                      Current Phase: ${phase}
                      Category: ${ideaData.category || 'Not specified'}
                      Target Audience: ${ideaData.targetAudience || 'Not specified'}

                      Phase Context: ${phaseContext[phase as keyof typeof phaseContext]}

                      Provide your suggestions as a simple list, one per line, without numbering or bullet points. Focus on practical, actionable advice that can be implemented immediately. Be specific and actionable.`;

      const response = await this.callAIEndpoint(prompt);

      // Type guard to check if the response has suggestions
      if (
        response &&
        typeof response === 'object' &&
        'suggestions' in response &&
        Array.isArray(response.suggestions)
      ) {
        return response.suggestions;
      }

      // Type guard to check if the response has analysis as string
      if (
        response &&
        typeof response === 'object' &&
        'analysis' in response &&
        typeof response.analysis === 'string'
      ) {
        return response.analysis
          .split('\n')
          .map((line: string) => line.trim())
          .filter((line: string) => line.length > 0 && !line.match(/^\d+\./))
          .slice(0, 5);
      }

      return [
        'Consider defining the target audience more specifically',
        'Research existing solutions and concepts',
        'Evaluate technical implementation challenges',
      ];
    } catch (error) {
      console.error('Error generating phase suggestions:', error);
      return [
        'Consider defining the target audience more specifically',
        'Research existing solutions and concepts',
      ];
    }
  }
}

export type Phase = 'inception' | 'development' | 'validation' | string;

export const aiAnalyzerService = new AIAnalyzerService();
