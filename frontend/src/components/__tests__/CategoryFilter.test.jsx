import React, { useState, useMemo } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FilterBar } from '../FilterBar';
import { TaskList } from '../TaskList';

const sampleTasks = [
  { id: 1, title: 'Write docs', category: 'Docs', priority: 'medium' },
  { id: 2, title: 'Fix bug', category: 'Bug', priority: 'high' },
  { id: 3, title: 'Plan sprint', category: 'Planning', priority: 'low' }
];

function Harness({ tasks }) {
  const [filters, setFilters] = useState({
    search: '', status: 'all', priority: 'all', category: 'all', sortBy: 'created_at'
  });

  const categories = useMemo(() => {
    const unique = new Set();
    tasks.forEach(task => { if (task.category) unique.add(task.category); });
    return Array.from(unique).sort();
  }, [tasks]);

  const visibleTasks = useMemo(() => {
    if (filters.category === 'all') return tasks;
    return tasks.filter(task => task.category === filters.category);
  }, [tasks, filters.category]);

  return (
    <div>
      <FilterBar filters={filters} setFilters={setFilters} categories={categories} />
      <TaskList tasks={visibleTasks} onToggleComplete={() => {}} onDelete={() => {}} onOpenForm={() => {}} />
    </div>
  );
}

describe('Category filter dropdown', () => {
  it('renders an All option plus categories derived from loaded tasks', () => {
    render(<Harness tasks={sampleTasks} />);
    const select = screen.getByTestId('category-filter');
    const options = Array.from(select.options).map(o => o.textContent);
    expect(options).toEqual(['All Categories', 'Bug', 'Docs', 'Planning']);
  });

  it('filters visible tasks by the selected category and resets on All', () => {
    render(<Harness tasks={sampleTasks} />);
    const select = screen.getByTestId('category-filter');

    fireEvent.change(select, { target: { value: 'Bug' } });
    expect(screen.getByText('Fix bug')).toBeInTheDocument();
    expect(screen.queryByText('Write docs')).not.toBeInTheDocument();
    expect(screen.queryByText('Plan sprint')).not.toBeInTheDocument();

    fireEvent.change(select, { target: { value: 'all' } });
    expect(screen.getByText('Write docs')).toBeInTheDocument();
    expect(screen.getByText('Fix bug')).toBeInTheDocument();
    expect(screen.getByText('Plan sprint')).toBeInTheDocument();
  });
});
