import { useState } from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FilterBar } from '../FilterBar';

const baseFilters = {
  search: '',
  status: 'all',
  priority: 'all',
  category: 'all',
  sortBy: 'created_at'
};

function ControlledFilterBar() {
  const [filters, setFilters] = useState(baseFilters);
  return <FilterBar filters={filters} setFilters={setFilters} />;
}

describe('FilterBar category dropdown', () => {
  it('renders with default value "all" and label "All Categories"', () => {
    render(<FilterBar filters={baseFilters} setFilters={() => {}} />);
    const select = document.getElementById('category-select');
    expect(select).toBeTruthy();
    expect(select.value).toBe('all');
    expect(screen.getByText('All Categories')).toBeInTheDocument();
  });

  it('exposes exactly the approved category options', () => {
    render(<FilterBar filters={baseFilters} setFilters={() => {}} />);
    const select = document.getElementById('category-select');
    const values = Array.from(select.options).map(o => o.value);
    expect(values).toEqual(['all', 'general', 'work', 'personal', 'design', 'backend', 'frontend', 'testing']);
  });

  it('updates filters.category via the setFilters updater pattern when a category is selected', () => {
    render(<ControlledFilterBar />);
    const select = document.getElementById('category-select');

    fireEvent.change(select, { target: { value: 'backend' } });

    expect(select.value).toBe('backend');
  });

  it('leaves other filters (search/status/priority) functional alongside category', () => {
    render(<ControlledFilterBar />);

    fireEvent.change(screen.getByPlaceholderText('Search tasks...'), { target: { value: 'foo' } });
    expect(screen.getByPlaceholderText('Search tasks...').value).toBe('foo');

    fireEvent.click(document.getElementById('filter-active-btn'));
    expect(document.getElementById('filter-active-btn').className).toContain('active');

    fireEvent.change(document.getElementById('priority-select'), { target: { value: 'high' } });
    expect(document.getElementById('priority-select').value).toBe('high');

    fireEvent.change(document.getElementById('category-select'), { target: { value: 'design' } });
    expect(document.getElementById('category-select').value).toBe('design');

    expect(screen.getByPlaceholderText('Search tasks...').value).toBe('foo');
    expect(document.getElementById('priority-select').value).toBe('high');
  });
});
