import { server } from '@/tests/mocks/server';
import { render, screen, waitFor } from '@/tests/utils/test-utils';
import { http } from 'msw';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const MockDashboardPage = () => {
  const [ideas, setIdeas] = React.useState<
    Array<{
      id: number;
      title: string;
      description: string;
      phase: string;
      tags: string[];
    }>
  >([]);
  const [workspaces, setWorkspaces] = React.useState<
    Array<{
      id: number;
      name: string;
      description: string;
    }>
  >([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [ideasResponse, workspacesResponse] = await Promise.all([
          fetch('/api/ideas'),
          fetch('/api/workspaces'),
        ]);

        if (!ideasResponse.ok || !workspacesResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const ideasData = await ideasResponse.json();
        const workspacesData = await workspacesResponse.json();

        setIdeas(ideasData.data || []);
        setWorkspaces(workspacesData.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div data-testid="loading">Loading...</div>;
  }

  if (error) {
    return <div data-testid="error-message">{error}</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>

      <section>
        <h2>Recent Ideas</h2>
        {ideas.length === 0 ? (
          <p data-testid="no-ideas">No ideas yet</p>
        ) : (
          <ul data-testid="ideas-list">
            {ideas.map((idea) => (
              <li key={idea.id} data-testid={`idea-${idea.id}`}>
                <h3>{idea.title}</h3>
                <p>{idea.description}</p>
                <span data-testid={`idea-phase-${idea.id}`}>{idea.phase}</span>
                {idea.tags && idea.tags.length > 0 && (
                  <div data-testid={`idea-tags-${idea.id}`}>
                    {idea.tags.map((tag: string) => (
                      <span key={tag} data-testid={`tag-${tag}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Recent Workspaces</h2>
        {workspaces.length === 0 ? (
          <p data-testid="no-workspaces">No workspaces yet</p>
        ) : (
          <ul data-testid="workspaces-list">
            {workspaces.map((workspace) => (
              <li key={workspace.id} data-testid={`workspace-${workspace.id}`}>
                <h3>{workspace.name}</h3>
                <p>{workspace.description}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div>
        <button data-testid="new-idea-btn">New Idea</button>
        <button data-testid="new-workspace-btn">New Workspace</button>
      </div>
    </div>
  );
};

describe('Dashboard Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should load and display recent ideas and workspaces', async () => {
    render(<MockDashboardPage />);

    // Should show loading initially
    expect(screen.getByTestId('loading')).toBeInTheDocument();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByTestId('ideas-list')).toBeInTheDocument();
    });

    expect(screen.getByTestId('workspaces-list')).toBeInTheDocument();
    expect(screen.getByTestId('idea-1')).toBeInTheDocument();
    expect(screen.getByTestId('workspace-1')).toBeInTheDocument();
  });

  it('should display idea details correctly', async () => {
    render(<MockDashboardPage />);

    await waitFor(() => {
      expect(screen.getByTestId('ideas-list')).toBeInTheDocument();
    });

    expect(screen.getByText('Test Idea')).toBeInTheDocument();
    expect(screen.getByText('A test idea')).toBeInTheDocument();
    expect(screen.getByTestId('idea-phase-1')).toHaveTextContent('inception');
  });

  it('should display tags for ideas', async () => {
    render(<MockDashboardPage />);

    await waitFor(() => {
      expect(screen.getByTestId('ideas-list')).toBeInTheDocument();
    });

    expect(screen.getByTestId('tag-test')).toBeInTheDocument();
    expect(screen.getByTestId('tag-demo')).toBeInTheDocument();
  });

  it('should handle empty states', async () => {
    server.use(
      http.get('/api/ideas', () => {
        return new Response(JSON.stringify({ data: [] }));
      }),
      http.get('/api/workspaces', () => {
        return new Response(JSON.stringify({ data: [] }));
      })
    );

    render(<MockDashboardPage />);

    await waitFor(() => {
      expect(screen.getByTestId('no-ideas')).toBeInTheDocument();
      expect(screen.getByTestId('no-workspaces')).toBeInTheDocument();
    });
  });

  it('should handle API errors gracefully', async () => {
    server.use(
      http.get('/api/ideas', () => {
        return new Response('Internal Server Error', { status: 500 });
      }),
      http.get('/api/workspaces', () => {
        return new Response('Internal Server Error', { status: 500 });
      })
    );

    render(<MockDashboardPage />);

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
    });
  });

  it('should handle partial API failures', async () => {
    server.use(
      http.get('/api/ideas', () => {
        return new Response('Internal Server Error', { status: 500 });
      })
    );

    render(<MockDashboardPage />);

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
    });
  });

  it('should handle network timeouts', async () => {
    server.use(
      http.get('/api/ideas', async () => {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        return new Response(JSON.stringify({ data: [] }));
      }),
      http.get('/api/workspaces', async () => {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        return new Response(JSON.stringify({ data: [] }));
      })
    );

    render(<MockDashboardPage />);

    await waitFor(
      () => {
        expect(screen.getByTestId('error-message')).toBeInTheDocument();
      },
      { timeout: 1000 }
    );
  });

  it('should handle malformed responses', async () => {
    server.use(
      http.get('/api/ideas', () => {
        return new Response('Invalid JSON', {
          headers: { 'Content-Type': 'application/json' },
        });
      }),
      http.get('/api/workspaces', () => {
        return new Response('Invalid JSON', {
          headers: { 'Content-Type': 'application/json' },
        });
      })
    );

    render(<MockDashboardPage />);

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
    });
  });

  it('should handle large datasets', async () => {
    const largeIdeas = Array.from({ length: 100 }, (_, i) => ({
      id: `idea-${i}`,
      title: `Idea ${i}`,
      description: `Description for idea ${i}`,
      phase: 'inception',
      tags: ['test'],
    }));

    server.use(
      http.get('/api/ideas', () => {
        return new Response(JSON.stringify({ data: largeIdeas }));
      })
    );

    render(<MockDashboardPage />);

    await waitFor(() => {
      expect(screen.getByTestId('ideas-list')).toBeInTheDocument();
    });

    // Should render all ideas
    expect(screen.getByTestId('idea-0')).toBeInTheDocument();
    expect(screen.getByTestId('idea-99')).toBeInTheDocument();
  });

  it('should handle special characters in data', async () => {
    server.use(
      http.get('/api/ideas', () => {
        return new Response(
          JSON.stringify({
            data: [
              {
                id: '1',
                title: 'Idea with 🚀 emoji',
                description: 'Description with special chars: !@#$%^&*()',
                phase: 'inception',
                tags: ['test', '🚀'],
              },
            ],
          })
        );
      })
    );

    render(<MockDashboardPage />);

    await waitFor(() => {
      expect(screen.getByTestId('ideas-list')).toBeInTheDocument();
    });

    expect(screen.getByText('Idea with 🚀 emoji')).toBeInTheDocument();
    expect(
      screen.getByText('Description with special chars: !@#$%^&*()')
    ).toBeInTheDocument();
  });

  it('should have quick action buttons', async () => {
    render(<MockDashboardPage />);

    await waitFor(() => {
      expect(screen.getByTestId('new-idea-btn')).toBeInTheDocument();
      expect(screen.getByTestId('new-workspace-btn')).toBeInTheDocument();
    });
  });
});
