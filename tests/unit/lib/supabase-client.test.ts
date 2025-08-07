import { createClient } from '@/lib/supabase/client';
import * as supabase from '@supabase/supabase-js';
import { GenericSchema } from '@supabase/supabase-js/dist/module/lib/types';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(),
}));

describe('Supabase Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  });

  it('should create a real Supabase client when environment variables are present', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-key';

    const mockSupabaseClient = {};

    vi.mocked(supabase.createClient).mockReturnValue(
      mockSupabaseClient as supabase.SupabaseClient<
        unknown,
        never,
        GenericSchema
      >
    );

    const client = createClient();

    expect(supabase.createClient).toHaveBeenCalledWith(
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

    expect(supabase.createClient).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to create Supabase client - using mock client:',
      expect.anything()
    );

    // expect(client).toEqual({
    //   from: vi.fn(() => ({
    //     select: vi.fn().mockReturnValue({ data: null, error: null }),
    //     insert: vi.fn().mockReturnValue({ data: null, error: null }),
    //     update: vi.fn().mockReturnValue({ data: null, error: null }),
    //     delete: vi.fn().mockReturnValue({ error: null }),
    //   })),
    // });
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

    expect(supabase.createClient).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to create Supabase client - using mock client:',
      expect.anything()
    );

    consoleSpy.mockRestore();
  });

  it('should create a mock client when Supabase initialization fails', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-key';

    vi.mocked(supabase.createClient).mockImplementation(() => {
      throw new Error('Initialization error');
    });

    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    expect(supabase.createClient).toHaveBeenCalled();
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
        error: null,
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
        error: null,
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
        error: null,
      });
    });

    it('should handle delete operations', async () => {
      const result = await client.from('test').delete().eq('id', '1');
      expect(result).toEqual({
        error: null,
      });
    });

    it('should handle complex chained operations', async () => {
      const result = await client
        .from('test')
        .select('id, name')
        .eq('status', 'active')
        .single();

      expect(result).toEqual({
        data: null,
        error: null,
      });
    });
  });
});
