import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider } from '@/components/theme-provider';
import { SidebarProvider } from '@/components/providers/sidebar-provider';
import { UserProfileProvider } from '@/components/providers/user-profile-provider';
import { WorkspaceProvider } from '@/components/providers/workspace-provider';
import { SupabaseProvider } from '@/components/providers/supabase-provider';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SupabaseProvider>
        <UserProfileProvider>
          <WorkspaceProvider>
            <SidebarProvider>{children}</SidebarProvider>
          </WorkspaceProvider>
        </UserProfileProvider>
      </SupabaseProvider>
    </ThemeProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';

export { customRender as render };

export const createMockIdea = (overrides = {}) => ({
  id: 'test-idea-id',
  title: 'Test Idea',
  description: 'This is a test idea for testing purposes',
  phase: 'inception',
  tags: ['test', 'demo'],
  category: 'Technology',
  target_audience: 'Developers',
  current_challenges: ['Technical complexity'],
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  ...overrides,
});

export const createMockWorkspace = (overrides = {}) => ({
  id: 'test-workspace-id',
  name: 'Test Workspace',
  description: 'A test workspace for testing',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  ...overrides,
});

export const createMockWhiteboard = (overrides = {}) => ({
  id: 'test-whiteboard-id',
  title: 'Test Whiteboard',
  description: 'A test whiteboard for testing',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  ...overrides,
});

export const createMockUser = (overrides = {}) => ({
  id: 'test-user-id',
  email: 'test@example.com',
  first_name: 'Test',
  last_name: 'User',
  display_name: 'Test User',
  avatar_url: null,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  ...overrides,
});

export const createMockAnalysis = (overrides = {}) => ({
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
      description: 'Focus on user experience and needs throughout development',
      impact: 'High' as const,
      effort: 'Medium' as const,
    },
  ],
  recommendations: [
    'Clarify the core problem your idea solves',
    'Research existing solutions and identify gaps',
  ],
  ...overrides,
});

export const waitForLoadingToFinish = async () => {
  await new Promise((resolve) => setTimeout(resolve, 0));
};

export const mockConsoleError = () => {
  const originalError = console.error;
  beforeAll(() => {
    console.error = vi.fn();
  });
  afterAll(() => {
    console.error = originalError;
  });
};

export const mockConsoleWarn = () => {
  const originalWarn = console.warn;
  beforeAll(() => {
    console.warn = vi.fn();
  });
  afterAll(() => {
    console.warn = originalWarn;
  });
};
