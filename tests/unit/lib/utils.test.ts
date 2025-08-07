import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';

describe('utils', () => {
  describe('cn', () => {
    it('should combine class names correctly', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2');
    });

    it('should handle conditional classes', () => {
      expect(cn('base', true && 'conditional')).toBe('base conditional');
      expect(cn('base', false && 'conditional')).toBe('base');
    });

    it('should handle null and undefined values', () => {
      expect(cn('base', null, undefined, 'valid')).toBe('base valid');
    });

    it('should handle arrays', () => {
      expect(cn(['class1', 'class2'], 'class3')).toBe('class1 class2 class3');
    });

    it('should handle objects', () => {
      expect(cn({ class1: true, class2: false, class3: true })).toBe(
        'class1 class3'
      );
    });

    it('should handle mixed inputs', () => {
      expect(
        cn('base', ['array1', 'array2'], { obj1: true, obj2: false }, 'string')
      ).toBe('base array1 array2 obj1 string');
    });

    it('should handle empty inputs', () => {
      expect(cn('')).toBe('');
      expect(cn(null, undefined, '')).toBe('');
    });

    it('should handle single class', () => {
      expect(cn('single')).toBe('single');
    });

    it('should handle special characters', () => {
      expect(cn('class1', 'class🚀', 'class🎯')).toContain('class1');
      expect(cn('class1', 'class🚀', 'class🎯')).toContain('class🚀');
      expect(cn('class1', 'class🚀', 'class🎯')).toContain('class🎯');
    });

    it('should handle complex combinations', () => {
      const result = cn(
        'base-class',
        ['array-class1', 'array-class2'],
        { 'conditional-class': true, 'hidden-class': false },
        'string-class',
        null,
        undefined
      );

      expect(result).toBe(
        'base-class array-class1 array-class2 conditional-class string-class'
      );
    });
  });
});
