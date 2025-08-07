import {
  createClient as createSupabaseClient,
  SupabaseClient,
} from '@supabase/supabase-js';
import { Database } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const createClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    return createMockClient();
  }

  try {
    return createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey, {
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    });
  } catch (error) {
    console.warn(
      'Failed to create Supabase client - using mock client:',
      error
    );
    return createMockClient();
  }
};

const createMockClient = () => {
  return {
    from: () => ({
      select: () => ({
        eq: () => ({
          data: null,
          error: null,
          single: () =>
            Promise.resolve({
              data: null,
              error: { message: 'Mock client - no database' },
            }),
        }),
        order: () => ({
          eq: () => ({
            single: () =>
              Promise.resolve({
                data: null,
                error: { message: 'Mock client - no database' },
              }),
          }),
        }),
      }),
      insert: () => ({
        select: () => ({
          single: () =>
            Promise.resolve({
              data: null,
              error: { message: 'Mock client - no database' },
            }),
        }),
      }),
      upsert: () => ({
        select: () => ({
          single: () =>
            Promise.resolve({
              data: null,
              error: { message: 'Mock client - no database' },
            }),
        }),
      }),
      update: () => ({
        eq: () => ({
          select: () => ({
            single: () =>
              Promise.resolve({
                data: null,
                error: { message: 'Mock client - no database' },
              }),
          }),
        }),
      }),
      delete: () => ({
        eq: () =>
          Promise.resolve({ error: { message: 'Mock client - no database' } }),
      }),
    }),
  } as unknown as SupabaseClient;
};
