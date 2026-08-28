import React, { useState } from 'react';
import { Plus, X, Calendar, Tag, AlertCircle } from 'lucide-react';

export function TaskForm({ onSubmit, onClose }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('general');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      priority,
      category,
      due_date: dueDate || null
    });

    setTitle('');
    setDescription('');
    setPriority('medium');
    setCategory('general');
    setDueDate('');
    setError('');
  };

  return (
    <form className="glass-card form-card" onSubmit={handleSubmit} id="create-task-form">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} color="var(--accent-primary)" />
          Create New Task
        </h3>
        {onClose && (
          <button type="button" className="icon-btn" style={{ width: 32, height: 32 }} onClick={onClose}>
            <X size={16} />
          </button>
        )}
      </div>

      {error && (
        <div style={{ padding: '0.6rem 1rem', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-md)', color: '#fca5a5', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <div className="form-grid">
        <div className="form-group">
          <label className="form-label" htmlFor="task-title-input">Title *</label>
          <input
            id="task-title-input"
            type="text"
            className="form-input"
            placeholder="e.g. Complete quarterly report presentation"
            value={title}
            onChange={(e) => { setTitle(e.target.value); setError(''); }}
            autoFocus
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="task-desc-input">Description (optional)</label>
          <textarea
            id="task-desc-input"
            className="form-textarea"
            rows="2"
            placeholder="Add additional details or notes..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="task-priority-select">Priority</label>
            <select
              id="task-priority-select"
              className="form-input"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="task-category-select">Category</label>
            <select
              id="task-category-select"
              className="form-input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="general">General</option>
              <option value="work">Work</option>
              <option value="personal">Personal</option>
              <option value="design">Design</option>
              <option value="backend">Backend</option>
              <option value="frontend">Frontend</option>
              <option value="testing">Testing</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="task-duedate-input">Due Date</label>
            <input
              id="task-duedate-input"
              type="date"
              className="form-input"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="form-actions">
        {onClose && (
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
        )}
        <button type="submit" className="btn-primary" id="save-task-submit">
          <Plus size={16} />
          <span>Save Task</span>
        </button>
      </div>
    </form>
  );
}
