import { describe, it, expect } from 'vitest';
import { getCategoryFromUrl, buildCategoryUrl } from './categoryUrlFilter';

describe('getCategoryFromUrl', () => {
  it('returns the category from the query string', () => {
    expect(getCategoryFromUrl('?category=work')).toBe('work');
  });

  it('defaults to "all" when no category param is present', () => {
    expect(getCategoryFromUrl('')).toBe('all');
    expect(getCategoryFromUrl('?status=active')).toBe('all');
  });
});

describe('buildCategoryUrl', () => {
  it('sets the category query param', () => {
    expect(buildCategoryUrl('work', { pathname: '/', search: '' })).toBe('/?category=work');
  });

  it('clears the category query param when category is "all"', () => {
    expect(buildCategoryUrl('all', { pathname: '/', search: '?category=work' })).toBe('/');
  });

  it('preserves other existing query params when setting category', () => {
    expect(buildCategoryUrl('work', { pathname: '/', search: '?status=active' })).toBe('/?status=active&category=work');
  });

  it('preserves other existing query params when clearing category', () => {
    expect(buildCategoryUrl('all', { pathname: '/', search: '?status=active&category=work' })).toBe('/?status=active');
  });
});
