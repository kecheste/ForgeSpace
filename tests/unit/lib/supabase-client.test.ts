import { createClient } from '@/lib/supabase/client';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock the entire supabase-js module
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(),
}));

describe('Supabase Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset environment variables
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  });

  it('should create a real Supabase client when environment variables are present', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-key';

    const mockSupabaseClient = {};
    vi.mocked(createSupabaseClient).mockReturnValue(mockSupabaseClient as any);

    const client = createClient();

    expect(createSupabaseClient).toHaveBeenCalledWith(
      'https://test.supabase.co',
      'test-key',
      {
        realtime: {
          params: {
            eventsPerSecond: 10,
          },
        },
      }
    );
    expect(client).toBe(mockSupabaseClient);
  });

  it('should create a mock client when environment variables are missing', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const client = createClient();

    expect(createSupabaseClient).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to create Supabase client - using mock client:',
      expect.anything()
    );

    // Test mock client structure
    const table = client.from('test_table');
    expect(table).toBeDefined();
    expect(typeof table.select).toBe('function');
    expect(typeof table.insert).toBe('function');
    expect(typeof table.update).toBe('function');
    expect(typeof table.delete).toBe('function');

    consoleSpy.mockRestore();
  });

  it('should create a mock client when environment variables are invalid', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = '';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = '';

    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    expect(createSupabaseClient).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to create Supabase client - using mock client:',
      expect.anything()
    );

    consoleSpy.mockRestore();
  });

  it('should create a mock client when Supabase initialization fails', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-key';

    vi.mocked(createSupabaseClient).mockImplementation(() => {
      throw new Error('Initialization error');
    });

    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const client = createClient();

    expect(createSupabaseClient).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to create Supabase client - using mock client:',
      expect.anything()
    );

    consoleSpy.mockRestore();
  });

  describe('Mock Client Operations', () => {
    let client: ReturnType<typeof createClient>;

    beforeEach(() => {
      client = createClient();
    });

    it('should handle select operations', async () => {
      const result = await client
        .from('test')
        .select('*')
        .eq('id', '1')
        .single();
      expect(result).toEqual({
        data: null,
        error: { message: 'Mock client - no database' },
      });
    });

    it('should handle insert operations', async () => {
      const result = await client
        .from('test')
        .insert({ name: 'Test' })
        .select()
        .single();
      expect(result).toEqual({
        data: null,
        error: { message: 'Mock client - no database' },
      });
    });

    it('should handle update operations', async () => {
      const result = await client
        .from('test')
        .update({ name: 'Updated' })
        .eq('id', '1')
        .select()
        .single();
      expect(result).toEqual({
        data: null,
        error: { message: 'Mock client - no database' },
      });
    });

    it('should handle delete operations', async () => {
      const result = await client.from('test').delete().eq('id', '1');
      expect(result).toEqual({
        error: { message: 'Mock client - no database' },
      });
    });

    it('should handle complex chained operations', async () => {
      const result = await client
        .from('test')
        .select('id, name')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(10);
      expect(result).toEqual({
        data: null,
        error: { message: 'Mock client - no database' },
      });
    });
  });
});
