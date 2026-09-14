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

const workTasks = allTasks.filter(t => t.category === 'work');

describe('App category filter integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.getStats.mockResolvedValue({ total: 2, completed: 0, pending: 2, highPriority: 0 });
    api.getTasks.mockImplementation(({ category } = {}) => {
      if (category && category !== 'all') {
        return Promise.resolve(allTasks.filter(t => t.category === category));
      }
      return Promise.resolve(allTasks);
    });
  });

  it('shows all tasks by default', async () => {
    render(<App />);

    expect(await screen.findByText('Write report')).toBeInTheDocument();
    expect(screen.getByText('Buy groceries')).toBeInTheDocument();
  });

  it('filters the displayed tasks when a category is selected', async () => {
    render(<App />);
    await screen.findByText('Write report');

    fireEvent.change(document.getElementById('category-select'), { target: { value: 'work' } });

    await waitFor(() => {
      expect(api.getTasks).toHaveBeenLastCalledWith(expect.objectContaining({ category: 'work' }));
    });

    expect(await screen.findByText('Write report')).toBeInTheDocument();
    expect(screen.queryByText('Buy groceries')).not.toBeInTheDocument();
  });

  it('resets to all tasks when "All Categories" is re-selected', async () => {
    render(<App />);
    await screen.findByText('Write report');

    const categorySelect = document.getElementById('category-select');
    fireEvent.change(categorySelect, { target: { value: 'work' } });
    await waitFor(() => expect(screen.queryByText('Buy groceries')).not.toBeInTheDocument());

    fireEvent.change(categorySelect, { target: { value: 'all' } });

    await waitFor(() => {
      expect(screen.getByText('Buy groceries')).toBeInTheDocument();
    });
    expect(screen.getByText('Write report')).toBeInTheDocument();
  });
});
