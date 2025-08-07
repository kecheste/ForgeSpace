import { AppSidebar } from '@/components/app-sidebar';
import { useSidebar } from '@/components/providers/sidebar-provider';
import { useUserProfile } from '@/components/providers/user-profile-provider';
import { useWorkspace } from '@/components/providers/workspace-provider';
import { render, screen } from '@/tests/utils/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock the sidebar provider
vi.mock('@/components/providers/sidebar-provider', () => ({
  useSidebar: vi.fn(),
  SidebarProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock the user profile provider
vi.mock('@/components/providers/user-profile-provider', () => ({
  useUserProfile: vi.fn(),
  UserProfileProvider: ({ children }: { children: React.ReactNode }) =>
    children,
}));

// Mock the workspace provider
vi.mock('@/components/providers/workspace-provider', () => ({
  useWorkspace: vi.fn(),
  WorkspaceProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock the supabase provider
vi.mock('@/components/providers/supabase-provider', () => ({
  SupabaseProvider: ({ children }: { children: React.ReactNode }) => children,
}));

describe('AppSidebar', () => {
  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();

    // Set default mock implementations
    vi.mocked(useSidebar).mockReturnValue({
      collapsed: false,
      toggleSidebar: vi.fn(),
    });

    vi.mocked(useUserProfile).mockReturnValue({
      displayName: 'Test User',
      avatarInitials: 'TU',
      loading: false,
    });

    vi.mocked(useWorkspace).mockReturnValue({
      currentWorkspace: {
        id: 'test-workspace-id',
        name: 'Test Workspace',
      },
      loading: false,
    });
  });

  it('should render navigation items', () => {
    render(<AppSidebar />);

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Ideas')).toBeInTheDocument();
    expect(screen.getByText('Workspaces')).toBeInTheDocument();
    expect(screen.getByText('Tools')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('should display user information', () => {
    render(<AppSidebar />);

    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('TU')).toBeInTheDocument();
  });

  it('should render navigation links with correct hrefs', () => {
    render(<AppSidebar />);

    const dashboardLink = screen.getByText('Dashboard').closest('a');
    const ideasLink = screen.getByText('Ideas').closest('a');
    const workspacesLink = screen.getByText('Workspaces').closest('a');

    expect(dashboardLink).toHaveAttribute('href', '/dashboard');
    expect(ideasLink).toHaveAttribute('href', '/dashboard/ideas');
    expect(workspacesLink).toHaveAttribute('href', '/dashboard/workspaces');
  });

  it('should handle collapsed state', () => {
    // Mock collapsed state
    vi.mocked(useSidebar).mockReturnValue({
      collapsed: true,
      toggleSidebar: vi.fn(),
    });

    render(<AppSidebar />);

    // In collapsed state, text should not be visible
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
  });

  it('should handle loading state', () => {
    // Mock loading state
    vi.mocked(useUserProfile).mockReturnValue({
      displayName: '',
      avatarInitials: '',
      loading: true,
    });

    render(<AppSidebar />);

    // Should still render navigation items even when user is loading
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });
});
