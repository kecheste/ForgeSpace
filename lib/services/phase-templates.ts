export interface PhaseTemplate {
  phase: string;
  title: string;
  description: string;
  prompts: string[];
  checklist: string[];
  examples: string[];
}

export const phaseTemplates: Record<string, PhaseTemplate> = {
  inception: {
    phase: 'inception',
    title: 'Inception Phase',
    description: 'Define the core concept and problem statement',
    prompts: [
      'What problem are you trying to solve?',
      'Who is your target audience?',
      'What makes your solution unique?',
      'What are the key assumptions?',
      'What success looks like?',
    ],
    checklist: [
      'Clear problem statement defined',
      'Target audience identified',
      'Unique value proposition articulated',
      'Key assumptions listed',
      'Success metrics defined',
    ],
    examples: [
      'Problem: Small businesses struggle to manage inventory efficiently',
      'Solution: AI-powered inventory management system',
      'Target: Small retail businesses with 10-50 employees',
    ],
  },
  refinement: {
    phase: 'refinement',
    title: 'Refinement Phase',
    description: 'Validate assumptions and refine the solution',
    prompts: [
      'What evidence supports your assumptions?',
      'How will you validate your solution?',
      'What are the main risks and challenges?',
      'How does this compare to existing solutions?',
      'What feedback have you received?',
    ],
    checklist: [
      'Market research completed',
      'User interviews conducted',
      'Competitive analysis done',
      'Risks identified and assessed',
      'Feedback incorporated',
    ],
    examples: [
      'Conducted 15 interviews with small business owners',
      'Analyzed 8 competing solutions',
      'Identified 3 key differentiators',
    ],
  },
  planning: {
    phase: 'planning',
    title: 'Planning Phase',
    description: 'Create detailed implementation plan',
    prompts: [
      'What are the key milestones?',
      'What resources do you need?',
      'What is your timeline?',
      'What is your budget?',
      'What are the success criteria?',
    ],
    checklist: [
      'Project timeline created',
      'Resource requirements defined',
      'Budget estimated',
      'Team roles assigned',
      'Success metrics established',
    ],
    examples: [
      'MVP development: 3 months',
      'Team: 2 developers, 1 designer',
      'Budget: $50K for MVP',
    ],
  },
  execution_ready: {
    phase: 'execution_ready',
    title: 'Execution Ready Phase',
    description: 'Prepare for implementation and launch',
    prompts: [
      'What is your go-to-market strategy?',
      'How will you measure success?',
      'What are your next steps?',
      'What support do you need?',
      'What could go wrong?',
    ],
    checklist: [
      'Go-to-market plan finalized',
      'Success metrics defined',
      'Implementation team ready',
      'Launch timeline set',
      'Risk mitigation plan in place',
    ],
    examples: [
      'Launch strategy: Beta with 10 customers',
      'Success metric: 80% user retention after 30 days',
      'Next step: Build MVP prototype',
    ],
  },
};

export function getPhaseTemplate(phase: string): PhaseTemplate | null {
  return phaseTemplates[phase] || null;
}

export function getAllPhaseTemplates(): PhaseTemplate[] {
  return Object.values(phaseTemplates);
}
