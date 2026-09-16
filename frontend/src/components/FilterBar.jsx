import React from 'react';
import { Search, Filter, ArrowUpDown, Tag } from 'lucide-react';

const CATEGORIES = [
  { value: 'general', label: 'General' },
  { value: 'work', label: 'Work' },
  { value: 'personal', label: 'Personal' },
  { value: 'design', label: 'Design' },
  { value: 'backend', label: 'Backend' },
  { value: 'frontend', label: 'Frontend' },
  { value: 'testing', label: 'Testing' }
];

export function FilterBar({ filters, setFilters }) {
  const handleSearchChange = (e) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
  };

  const handleStatusChange = (status) => {
    setFilters(prev => ({ ...prev, status }));
  };

  const handlePriorityChange = (e) => {
    setFilters(prev => ({ ...prev, priority: e.target.value }));
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setFilters(prev => ({ ...prev, category }));
  };

  const handleSortChange = (e) => {
    setFilters(prev => ({ ...prev, sortBy: e.target.value }));
  };

  return (
    <div className="glass-card toolbar-card">
      <div className="search-box">
        <Search className="search-icon" size={18} />
        <input
          type="text"
          className="search-input"
          placeholder="Search tasks..."
          value={filters.search}
          onChange={handleSearchChange}
          id="task-search-input"
        />
      </div>

      <div className="filter-group">
        <button
          className={`filter-pill ${filters.status === 'all' ? 'active' : ''}`}
          onClick={() => handleStatusChange('all')}
          id="filter-all-btn"
        >
          All
        </button>
        <button
          className={`filter-pill ${filters.status === 'active' ? 'active' : ''}`}
          onClick={() => handleStatusChange('active')}
          id="filter-active-btn"
        >
          Active
        </button>
        <button
          className={`filter-pill ${filters.status === 'completed' ? 'active' : ''}`}
          onClick={() => handleStatusChange('completed')}
          id="filter-completed-btn"
        >
          Completed
        </button>
      </div>

      <div className="filter-group">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Filter size={15} color="var(--text-muted)" />
          <select
            className="select-input"
            value={filters.priority}
            onChange={handlePriorityChange}
            id="priority-select"
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Tag size={15} color="var(--text-muted)" />
          <select
            className="select-input"
            value={filters.category}
            onChange={handleCategoryChange}
            id="category-select"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <ArrowUpDown size={15} color="var(--text-muted)" />
          <select
            className="select-input"
            value={filters.sortBy}
            onChange={handleSortChange}
            id="sort-select"
          >
            <option value="created_at">Newest First</option>
            <option value="due_date">Due Date</option>
            <option value="priority">Priority</option>
            <option value="title">Title A-Z</option>
          </select>
        </div>
      </div>
    </div>
  );
}
