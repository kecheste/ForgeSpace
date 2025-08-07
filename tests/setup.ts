import type { UserResource } from '@clerk/types';
import '@testing-library/jest-dom';
import React from 'react';
import type { Mock } from 'vitest';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { server } from './mocks/server';

// Establish API mocking before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// Reset any request handlers that we may add during the tests
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished
afterAll(() => server.close());

// Type definitions for mocked router
interface MockedRouter {
  push: Mock;
  replace: Mock;
  prefetch: Mock;
  back: Mock;
  forward: Mock;
  refresh: Mock;
}

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: (): MockedRouter => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}));

// Mock Next.js image component with proper typing
vi.mock('next/image', () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    ...props
  }: {
    src: string;
    alt: string;
    [key: string]: unknown;
  }) => React.createElement('img', { src, alt, ...props }),
}));

// Mock Clerk authentication with proper types
vi.mock('@clerk/nextjs', () => ({
  useUser: (): {
    user: UserResource;
    isLoaded: boolean;
    isSignedIn: boolean;
  } => ({
    user: {
      id: 'test-user-id',
      emailAddresses: [{ emailAddress: 'test@example.com' }],
      firstName: 'Test',
      lastName: 'User',
    } as UserResource,
    isLoaded: true,
    isSignedIn: true,
  }),
  useClerk: () => ({
    signOut: vi.fn(),
    signIn: vi.fn(),
    signUp: vi.fn(),
  }),
  ClerkProvider: ({ children }: { children: React.ReactNode }) =>
    React.createElement(React.Fragment, null, children),
}));

// Type for mocked Supabase client
interface MockedSupabaseClient {
  from: Mock;
}

// Mock Supabase client with proper chaining and typing
vi.mock('@/lib/supabase/client', () => ({
  createClient: (): MockedSupabaseClient => ({
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: null, error: null }),
        }),
        order: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: null }),
          }),
        }),
      }),
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: null, error: null }),
        }),
      }),
      upsert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: null, error: null }),
        }),
      }),
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: null }),
          }),
        }),
      }),
      delete: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null }),
      }),
    }),
  }),
}));

// Mock environment variables with proper typing
const env = {
  NEXT_PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'test-key',
  OPENAI_API_KEY: 'test-openai-key',
  NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
} as const;

Object.assign(process.env, env);

// Type for ResizeObserver mock
interface MockResizeObserver {
  observe: Mock;
  unobserve: Mock;
  disconnect: Mock;
}

// Global test utilities with proper typing
global.ResizeObserver = vi.fn().mockImplementation(
  (): MockResizeObserver => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  })
);

// Type for matchMedia mock
interface MockMatchMedia {
  matches: boolean;
  media: string;
  onchange: null;
  addListener: Mock;
  removeListener: Mock;
  addEventListener: Mock;
  removeEventListener: Mock;
  dispatchEvent: Mock;
}

global.matchMedia = vi.fn().mockImplementation(
  (query: string): MockMatchMedia => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })
);
