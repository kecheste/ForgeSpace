# ForgeSpace Testing Suite

This directory contains comprehensive unit and integration tests for the ForgeSpace platform. The testing suite is built with **Vitest**, **React Testing Library**, and **MSW** for optimal testing of Next.js applications.

## 🚀 Quick Start

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration
```

## 📁 Test Structure

```
tests/
├── setup.ts                 # Global test setup and mocks
├── mocks/
│   ├── server.ts           # MSW server setup
│   └── handlers.ts         # API mock handlers
├── utils/
│   └── test-utils.tsx     # Custom render function and test utilities
├── unit/                   # Unit tests
│   ├── components/         # Component unit tests
│   ├── lib/               # Utility function tests
│   ├── services/          # Service layer tests
│   └── api/               # API route tests
└── integration/           # Integration tests
    ├── ai-analyzer.test.tsx
    └── dashboard.test.tsx
```

## 🧪 Test Categories

### Unit Tests

- **Components**: Individual component testing with mocked dependencies
- **Services**: Business logic testing (AI Analyzer, etc.)
- **Utilities**: Helper function testing
- **API Routes**: Server-side route testing

### Integration Tests

- **End-to-End Flows**: Complete user journeys
- **API Integration**: Real API calls with mocked responses
- **Component Integration**: Multiple components working together

## 🛠️ Testing Tools

### Vitest

- Fast test runner with native TypeScript support
- Built-in coverage reporting
- Parallel test execution
- Hot reload for development

### React Testing Library

- User-centric testing approach
- Accessible queries by default
- Realistic user interactions
- Component behavior over implementation

### MSW (Mock Service Worker)

- API mocking at the network level
- Realistic request/response simulation
- No need to mock fetch manually
- Works in both tests and development

## 📝 Writing Tests

### Component Testing Example

```tsx
import { render, screen, fireEvent } from '@/tests/utils/test-utils';
import { MyComponent } from '@/components/my-component';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('should handle user interactions', () => {
    render(<MyComponent />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(screen.getByText('Clicked!')).toBeInTheDocument();
  });
});
```

### API Testing Example

```tsx
import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from '@/app/api/my-route/route';

describe('/api/my-route', () => {
  it('should handle valid requests', async () => {
    const request = new NextRequest('http://localhost:3000/api/my-route', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: 'test' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toMatchObject({ success: true });
  });
});
```

### Integration Testing Example

```tsx
import { render, screen, waitFor } from '@/tests/utils/test-utils';
import { rest } from 'msw';
import { server } from '@/tests/mocks/server';

describe('User Flow', () => {
  it('should complete user journey', async () => {
    render(<MyPage />);

    // Fill form
    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'John Doe' },
    });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    // Wait for API call
    await waitFor(() => {
      expect(screen.getByText('Success!')).toBeInTheDocument();
    });
  });
});
```

## 🔧 Test Utilities

### Custom Render Function

```tsx
import { render } from '@/tests/utils/test-utils';

// Automatically includes all providers
render(<MyComponent />);
```

### Test Data Factories

```tsx
import { createMockIdea, createMockUser } from '@/tests/utils/test-utils';

const mockIdea = createMockIdea({ title: 'Custom Title' });
const mockUser = createMockUser({ email: 'test@example.com' });
```

### MSW Handlers

```tsx
import { rest } from 'msw';
import { server } from '@/tests/mocks/server';

// Override default handler for specific test
server.use(
  rest.get('/api/ideas', (req, res, ctx) => {
    return res(ctx.json({ data: customIdeas }));
  })
);
```

## 🎯 Testing Best Practices

### 1. Test User Behavior

```tsx
// ✅ Good - Test what user sees and does
expect(screen.getByText('Submit')).toBeInTheDocument();
fireEvent.click(screen.getByRole('button', { name: /submit/i }));

// ❌ Bad - Test implementation details
expect(component.state.isLoading).toBe(true);
```

### 2. Use Semantic Queries

```tsx
// ✅ Good - Accessible and semantic
screen.getByRole('button', { name: /submit/i });
screen.getByLabelText('Email address');
screen.getByText('Welcome back');

// ❌ Bad - Fragile selectors
screen.getByTestId('submit-button');
screen.getByClassName('btn-primary');
```

### 3. Test Error States

```tsx
it('should handle API errors', async () => {
  server.use(
    rest.get('/api/data', (req, res, ctx) => {
      return res(ctx.status(500));
    })
  );

  render(<MyComponent />);

  await waitFor(() => {
    expect(screen.getByText('Error loading data')).toBeInTheDocument();
  });
});
```

### 4. Test Loading States

```tsx
it('should show loading state', () => {
  render(<MyComponent />);

  expect(screen.getByText('Loading...')).toBeInTheDocument();

  // Wait for data to load
  await waitFor(() => {
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });
});
```

### 5. Test Accessibility

```tsx
it('should be accessible', () => {
  render(<MyComponent />);

  // Check for proper ARIA labels
  expect(screen.getByLabelText('Search')).toBeInTheDocument();

  // Check for proper heading structure
  expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
});
```

## 🔍 Coverage Goals

- **Statements**: 90%+
- **Branches**: 85%+
- **Functions**: 90%+
- **Lines**: 90%+

## 🚨 Common Issues

### 1. Async Operations

```tsx
// ✅ Good - Wait for async operations
await waitFor(() => {
  expect(screen.getByText('Data loaded')).toBeInTheDocument();
});

// ❌ Bad - No waiting
expect(screen.getByText('Data loaded')).toBeInTheDocument();
```

### 2. Mock Cleanup

```tsx
beforeEach(() => {
  vi.clearAllMocks();
  server.resetHandlers();
});
```

### 3. Provider Dependencies

```tsx
// Use custom render function that includes all providers
import { render } from '@/tests/utils/test-utils';
```

## 📊 Test Reports

### Coverage Report

```bash
npm run test:coverage
```

Generates HTML coverage report in `coverage/` directory.

### Test UI

```bash
npm run test:ui
```

Opens Vitest UI for interactive test exploration.

## 🔄 Continuous Integration

Tests are automatically run on:

- Pull requests
- Main branch pushes
- Release tags

## 📚 Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [MSW Documentation](https://mswjs.io/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## 🤝 Contributing

When adding new features:

1. Write tests first (TDD approach)
2. Ensure all tests pass
3. Maintain good coverage
4. Follow testing best practices
5. Update this README if needed

## 🐛 Debugging Tests

### Debug Mode

```bash
# Run tests in debug mode
npm run test -- --reporter=verbose
```

### Debug Specific Test

```bash
# Run only specific test file
npm test tests/unit/components/my-component.test.tsx
```

### Debug with Console

```tsx
it('should debug', () => {
  render(<MyComponent />);
  screen.debug(); // Prints DOM structure
  screen.debug(screen.getByRole('button')); // Prints specific element
});
```
