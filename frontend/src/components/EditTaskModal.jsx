import React, { useEffect, useMemo, useState } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';

const DEFAULT_CATEGORIES = [
  'general',
  'work',
  'personal',
  'design',
  'backend',
  'frontend',
  'testing'
];

export function EditTaskModal({ task, onCancel, onSave, saving = false }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('general');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  const categoryOptions = useMemo(() => {
    const current = (task?.category || '').trim();
    const base = new Set(DEFAULT_CATEGORIES);
    if (current && !base.has(current)) base.add(current);
    return Array.from(base);
  }, [task]);

  useEffect(() => {
    if (!task) return;

    setTitle(task.title ?? '');
    setDescription(task.description ?? '');
    setPriority(task.priority ?? 'medium');
    setCategory(task.category ?? 'general');
    setDueDate(task.due_date ? String(task.due_date).slice(0, 10) : '');
    setError('');
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }

    onSave({
      title: title.trim(),
      description: description.trim(),
      priority,
      category,
      due_date: dueDate || null
    });
  };

  if (!task) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Edit task">
      <div className="glass-card modal-card">
        <form onSubmit={handleSubmit} id={`edit-task-form-${task.id}`}>
          <div className="modal-header">
            <h3 className="modal-title">Edit Task</h3>
            <button
              type="button"
              className="icon-btn"
              style={{ width: 32, height: 32 }}
              onClick={onCancel}
              aria-label="Close edit"
              id={`close-edit-task-${task.id}`}
            >
              <X size={16} />
            </button>
          </div>

          {error && (
            <div className="inline-error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label" htmlFor={`edit-title-${task.id}`}>Title *</label>
              <input
                id={`edit-title-${task.id}`}
                type="text"
                className="form-input"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setError('');
                }}
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor={`edit-desc-${task.id}`}>Description (optional)</label>
              <textarea
                id={`edit-desc-${task.id}`}
                className="form-textarea"
                rows="2"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor={`edit-priority-${task.id}`}>Priority</label>
                <select
                  id={`edit-priority-${task.id}`}
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
                <label className="form-label" htmlFor={`edit-category-${task.id}`}>Category</label>
                <select
                  id={`edit-category-${task.id}`}
                  className="form-input"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categoryOptions.map((c) => (
                    <option key={c} value={c}>
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor={`edit-duedate-${task.id}`}>Due Date</label>
                <input
                  id={`edit-duedate-${task.id}`}
                  type="date"
                  className="form-input"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onCancel} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={saving} id={`save-edit-task-${task.id}`}>
              <Save size={16} />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
