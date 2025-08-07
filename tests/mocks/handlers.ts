import { http, HttpResponse } from 'msw';

export const handlers = [
  // AI Analyzer API
  http.post('/api/analyze-idea', async ({ request }) => {
    const body = await request.json();

    if (
      typeof body !== 'object' ||
      body === null ||
      Array.isArray(body) ||
      !('title' in body) ||
      !('description' in body)
    ) {
      return HttpResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      );
    }

    return HttpResponse.json({
      viabilityScore: 75,
      creativityPotential: 80,
      technicalFeasibility: 70,
      innovationLevel: 65,
      riskLevel: 'Medium',
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
          impact: 'High',
          effort: 'Medium',
        },
      ],
      recommendations: [
        'Clarify the core problem your idea solves',
        'Research existing solutions and identify gaps',
      ],
    });
  }),

  // Phase Suggestions API
  http.post('/api/phase-suggestions', async ({ request }) => {
    const body = await request.json();

    return HttpResponse.json({
      suggestions: [
        'Consider defining the target audience more specifically',
        'Research existing solutions and concepts',
        'Evaluate technical implementation challenges',
      ],
    });
  }),

  // Test AI API
  http.post('/api/test-ai', async () => {
    return HttpResponse.json({
      success: true,
      message: 'AI service is working correctly',
    });
  }),

  // Whiteboards API
  http.get('/api/whiteboards', () => {
    return HttpResponse.json({
      data: [
        {
          id: '1',
          title: 'Test Whiteboard',
          description: 'A test whiteboard',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
      ],
    });
  }),

  http.post('/api/whiteboards', async ({ request }) => {
    const body = await request.json();
    const isValidBody =
      typeof body === 'object' &&
      body !== null &&
      'title' in body &&
      'description' in body;

    return HttpResponse.json({
      data: {
        id: '2',
        title: isValidBody ? (body as Record<string, any>).title : '',
        description: isValidBody
          ? (body as Record<string, any>).description
          : '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    });
  }),

  http.get('/api/whiteboards/:id', ({ params }) => {
    return HttpResponse.json({
      data: {
        id: params.id,
        title: 'Test Whiteboard',
        description: 'A test whiteboard',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
    });
  }),

  // Workspaces API
  http.get('/api/workspaces', () => {
    return HttpResponse.json({
      data: [
        {
          id: '1',
          name: 'Test Workspace',
          description: 'A test workspace',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
      ],
    });
  }),

  http.post('/api/workspaces', async ({ request }) => {
    const body = await request.json();
    const isValidBody =
      typeof body === 'object' &&
      body !== null &&
      'name' in body &&
      'description' in body;

    return HttpResponse.json({
      data: {
        id: '2',
        name: isValidBody ? (body as Record<string, any>).name : '',
        description: isValidBody
          ? (body as Record<string, any>).description
          : '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    });
  }),

  // Workspace Invitations API
  http.post('/api/workspaces/invite', async ({ request }) => {
    const body = await request.json();

    return HttpResponse.json({
      success: true,
      message: 'Invitation sent successfully',
    });
  }),

  // Notifications API
  http.post('/api/notifications/process', async ({ request }) => {
    const body = await request.json();

    return HttpResponse.json({
      success: true,
      message: 'Notification processed successfully',
    });
  }),

  // Ideas API (mock Supabase responses)
  http.get('/api/ideas', () => {
    return HttpResponse.json({
      data: [
        {
          id: '1',
          title: 'Test Idea',
          description: 'A test idea',
          phase: 'inception',
          tags: ['test', 'demo'],
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
      ],
      error: null,
    });
  }),

  http.post('/api/ideas', async ({ request }) => {
    const body = await request.json();
    const data = body as Record<string, any>;

    return HttpResponse.json({
      data: {
        id: '2',
        title: data.title,
        description: data.description,
        phase: data.phase || 'inception',
        tags: data.tags || [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      error: null,
    });
  }),

  // Users API
  http.get('/api/users/profile', () => {
    return HttpResponse.json({
      data: {
        id: 'test-user-id',
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        display_name: 'Test User',
        avatar_url: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      error: null,
    });
  }),

  // Catch-all handler for unmatched requests
  http.all('*', ({ request }) => {
    console.warn(`Unhandled request: ${request.method} ${request.url}`);
    return HttpResponse.json({ error: 'Not found' }, { status: 404 });
  }),
];
