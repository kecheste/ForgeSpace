import { server } from '@/tests/mocks/server';
import { fireEvent, render, screen, waitFor } from '@/tests/utils/test-utils';
import { http } from 'msw';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const MockAnalyzerPage = () => {
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [phase, setPhase] = React.useState('inception');
  const [tags, setTags] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<{
    viabilityScore: number;
    creativityPotential: number;
    technicalFeasibility: number;
  } | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze-idea', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          phase,
          tags: tags
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Idea title"
          data-testid="title-input"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Idea description"
          data-testid="description-input"
        />
        <select
          value={phase}
          onChange={(e) => setPhase(e.target.value)}
          data-testid="phase-select"
        >
          <option value="inception">Inception</option>
          <option value="development">Development</option>
          <option value="validation">Validation</option>
        </select>
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Tags (comma-separated)"
          data-testid="tags-input"
        />
        <button type="submit" disabled={loading} data-testid="submit-button">
          {loading ? 'Analyzing...' : 'Analyze Idea'}
        </button>
      </form>

      {error && <div data-testid="error-message">{error}</div>}
      {result && (
        <div data-testid="result">
          <div data-testid="viability-score">
            Score: {result.viabilityScore}
          </div>
          <div data-testid="creativity-score">
            Creativity: {result.creativityPotential}
          </div>
          <div data-testid="technical-score">
            Technical: {result.technicalFeasibility}
          </div>
        </div>
      )}
    </div>
  );
};

describe('AI Analyzer Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully analyze an idea', async () => {
    render(<MockAnalyzerPage />);

    const titleInput = screen.getByTestId('title-input');
    const descriptionInput = screen.getByTestId('description-input');
    const submitButton = screen.getByTestId('submit-button');

    fireEvent.change(titleInput, { target: { value: 'Test Idea' } });
    fireEvent.change(descriptionInput, {
      target: { value: 'A test idea for analysis' },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId('result')).toBeInTheDocument();
    });

    expect(screen.getByTestId('viability-score')).toHaveTextContent(
      'Score: 75'
    );
    expect(screen.getByTestId('creativity-score')).toHaveTextContent(
      'Creativity: 80'
    );
    expect(screen.getByTestId('technical-score')).toHaveTextContent(
      'Technical: 70'
    );
  });

  it('should handle API errors gracefully', async () => {
    server.use(
      http.post('/api/analyze-idea', () => {
        return new Response('Internal Server Error', { status: 500 });
      })
    );

    render(<MockAnalyzerPage />);

    const titleInput = screen.getByTestId('title-input');
    const descriptionInput = screen.getByTestId('description-input');
    const submitButton = screen.getByTestId('submit-button');

    fireEvent.change(titleInput, { target: { value: 'Test Idea' } });
    fireEvent.change(descriptionInput, { target: { value: 'A test idea' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
    });
  });

  it('should validate required fields', async () => {
    server.use(
      http.post('/api/analyze-idea', async ({ request }) => {
        const body = await request.json();
        if (
          !body ||
          typeof body !== 'object' ||
          Array.isArray(body) ||
          !('title' in body) ||
          !('description' in body)
        ) {
          return new Response(
            JSON.stringify({ error: 'Title and description are required' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          );
        }
        return new Response(JSON.stringify({ viabilityScore: 75 }));
      })
    );

    render(<MockAnalyzerPage />);

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
    });
  });

  it('should handle different phases', async () => {
    render(<MockAnalyzerPage />);

    const titleInput = screen.getByTestId('title-input');
    const descriptionInput = screen.getByTestId('description-input');
    const phaseSelect = screen.getByTestId('phase-select');
    const submitButton = screen.getByTestId('submit-button');

    fireEvent.change(titleInput, { target: { value: 'Test Idea' } });
    fireEvent.change(descriptionInput, { target: { value: 'A test idea' } });
    fireEvent.change(phaseSelect, { target: { value: 'development' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId('result')).toBeInTheDocument();
    });
  });

  it('should handle empty tags', async () => {
    render(<MockAnalyzerPage />);

    const titleInput = screen.getByTestId('title-input');
    const descriptionInput = screen.getByTestId('description-input');
    const tagsInput = screen.getByTestId('tags-input');
    const submitButton = screen.getByTestId('submit-button');

    fireEvent.change(titleInput, { target: { value: 'Test Idea' } });
    fireEvent.change(descriptionInput, { target: { value: 'A test idea' } });
    fireEvent.change(tagsInput, { target: { value: '' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId('result')).toBeInTheDocument();
    });
  });

  it('should handle special characters in input', async () => {
    render(<MockAnalyzerPage />);

    const titleInput = screen.getByTestId('title-input');
    const descriptionInput = screen.getByTestId('description-input');
    const submitButton = screen.getByTestId('submit-button');

    fireEvent.change(titleInput, {
      target: { value: 'Test Idea with 🚀 emoji' },
    });
    fireEvent.change(descriptionInput, {
      target: { value: 'Description with special chars: !@#$%^&*()' },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId('result')).toBeInTheDocument();
    });
  });

  it('should show loading state during analysis', async () => {
    server.use(
      http.post('/api/analyze-idea', async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
        return new Response(JSON.stringify({ viabilityScore: 75 }));
      })
    );

    render(<MockAnalyzerPage />);

    const titleInput = screen.getByTestId('title-input');
    const descriptionInput = screen.getByTestId('description-input');
    const submitButton = screen.getByTestId('submit-button');

    fireEvent.change(titleInput, { target: { value: 'Test Idea' } });
    fireEvent.change(descriptionInput, { target: { value: 'A test idea' } });
    fireEvent.click(submitButton);

    expect(submitButton).toHaveTextContent('Analyzing...');
    expect(submitButton).toBeDisabled();

    await waitFor(() => {
      expect(screen.getByTestId('result')).toBeInTheDocument();
    });
  });

  it('should handle network timeouts', async () => {
    server.use(
      http.post('/api/analyze-idea', async () => {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        return new Response(JSON.stringify({ viabilityScore: 75 }));
      })
    );

    render(<MockAnalyzerPage />);

    const titleInput = screen.getByTestId('title-input');
    const descriptionInput = screen.getByTestId('description-input');
    const submitButton = screen.getByTestId('submit-button');

    fireEvent.change(titleInput, { target: { value: 'Test Idea' } });
    fireEvent.change(descriptionInput, { target: { value: 'A test idea' } });
    fireEvent.click(submitButton);

    await waitFor(
      () => {
        expect(screen.getByTestId('error-message')).toBeInTheDocument();
      },
      { timeout: 1000 }
    );
  });
});
