import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  cn,
  formatAddress,
  formatPrice,
  formatCurrency,
  formatPercentage,
  formatRelativeTime,
} from './utils';

describe('cn', () => {
  it('joins class names with a space', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('excludes falsy values', () => {
    expect(cn('foo', false, undefined, null, 'bar')).toBe('foo bar');
  });

  it('handles conditional class objects', () => {
    expect(cn({ active: true, disabled: false })).toBe('active');
  });

  it('returns empty string when given no truthy classes', () => {
    expect(cn(false, undefined)).toBe('');
  });
});

describe('formatAddress', () => {
  it('returns empty string for an empty input', () => {
    expect(formatAddress('')).toBe('');
  });

  it('truncates a 42-char Ethereum address to first 6 and last 4 chars', () => {
    expect(formatAddress('0xAbCd0000000000000000000000000000000EF12')).toBe(
      '0xAbCd...EF12',
    );
  });

  it('works for short addresses (no crash)', () => {
    const short = '0x1234';
    const result = formatAddress(short);
    expect(result).toContain('...');
  });
});

describe('formatPrice', () => {
  it('formats to 3 decimal places with a $ prefix', () => {
    expect(formatPrice(0.65)).toBe('$0.650');
  });

  it('handles zero', () => {
    expect(formatPrice(0)).toBe('$0.000');
  });

  it('handles a whole number', () => {
    expect(formatPrice(1)).toBe('$1.000');
  });
});

describe('formatCurrency', () => {
  it('formats a round thousand', () => {
    expect(formatCurrency(1000)).toBe('$1,000.00');
  });

  it('formats a fractional dollar amount', () => {
    expect(formatCurrency(0.5)).toBe('$0.50');
  });

  it('formats a large value with commas', () => {
    expect(formatCurrency(1_250_000)).toBe('$1,250,000.00');
  });
});

describe('formatPercentage', () => {
  it('multiplies by 100 and appends %', () => {
    expect(formatPercentage(0.6543)).toBe('65.43%');
  });

  it('handles zero', () => {
    expect(formatPercentage(0)).toBe('0.00%');
  });

  it('handles 1 (100%)', () => {
    expect(formatPercentage(1)).toBe('100.00%');
  });

  it('handles a round half', () => {
    expect(formatPercentage(0.5)).toBe('50.00%');
  });
});

describe('formatRelativeTime', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const NOW = new Date('2026-01-10T12:00:00Z');

  it('returns "just now" for times within the last 60 seconds', () => {
    vi.setSystemTime(NOW);
    expect(formatRelativeTime(new Date('2026-01-10T11:59:30Z'))).toBe('just now');
  });

  it('returns minutes for times 1–59 minutes ago', () => {
    vi.setSystemTime(NOW);
    expect(formatRelativeTime(new Date('2026-01-10T11:55:00Z'))).toBe('5m ago');
    expect(formatRelativeTime(new Date('2026-01-10T11:01:00Z'))).toBe('59m ago');
  });

  it('returns hours for times 1–23 hours ago', () => {
    vi.setSystemTime(NOW);
    expect(formatRelativeTime(new Date('2026-01-10T10:00:00Z'))).toBe('2h ago');
    expect(formatRelativeTime(new Date('2026-01-09T13:00:00Z'))).toBe('23h ago');
  });

  it('returns days for times 1–6 days ago', () => {
    vi.setSystemTime(NOW);
    expect(formatRelativeTime(new Date('2026-01-07T12:00:00Z'))).toBe('3d ago');
  });

  it('falls back to a formatted date for times 7+ days ago', () => {
    vi.setSystemTime(NOW);
    const old = new Date('2026-01-01T00:00:00Z');
    const result = formatRelativeTime(old);
    // Should not be a relative format — check it's not matching the relative patterns
    expect(result).not.toMatch(/^(\d+[mhd] ago|just now)$/);
  });

  it('accepts a date string as input', () => {
    vi.setSystemTime(NOW);
    expect(formatRelativeTime('2026-01-10T11:55:00Z')).toBe('5m ago');
  });
});
