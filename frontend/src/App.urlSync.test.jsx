import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { App } from './App';
import { api } from './services/api';

vi.mock('./services/api', () => ({
  api: {
    getTasks: vi.fn(),
    getStats: vi.fn()
  }
}));

const allTasks = [
  { id: 1, title: 'Write report', category: 'work', priority: 'medium', completed: false },
  { id: 2, title: 'Buy groceries', category: 'personal', priority: 'low', completed: false }
];

describe('App category URL sync', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.history.replaceState({}, '', '/');
    api.getStats.mockResolvedValue({ total: 2, completed: 0, pending: 2, highPriority: 0 });
    api.getTasks.mockImplementation(({ category } = {}) => {
      if (category && category !== 'all') {
        return Promise.resolve(allTasks.filter(t => t.category === category));
      }
      return Promise.resolve(allTasks);
    });
  });

  it('adds a category query param to the URL when a category is selected', async () => {
    render(<App />);
    await screen.findByText('Write report');

    fireEvent.change(document.getElementById('category-select'), { target: { value: 'work' } });

    await waitFor(() => {
      expect(window.location.search).toBe('?category=work');
    });
  });

  it('clears the category query param from the URL when "All Categories" is selected', async () => {
    window.history.replaceState({}, '', '/?category=work');
    render(<App />);
    await screen.findByText('Write report');

    fireEvent.change(document.getElementById('category-select'), { target: { value: 'all' } });

    await waitFor(() => {
      expect(window.location.search).toBe('');
    });
  });

  it('preselects the category filter from the URL on load', async () => {
    window.history.replaceState({}, '', '/?category=work');
    render(<App />);

    await screen.findByText('Write report');
    expect(screen.queryByText('Buy groceries')).not.toBeInTheDocument();
    expect(document.getElementById('category-select').value).toBe('work');
  });
});
