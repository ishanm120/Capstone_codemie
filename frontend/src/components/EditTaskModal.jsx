import React, { useEffect, useMemo, useState } from 'react';
import { X, Save, AlertCircle, Pencil } from 'lucide-react';

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low Priority' },
  { value: 'medium', label: 'Medium Priority' },
  { value: 'high', label: 'High Priority' }
];

const CATEGORY_OPTIONS = [
  { value: 'general', label: 'General' },
  { value: 'work', label: 'Work' },
  { value: 'personal', label: 'Personal' },
  { value: 'design', label: 'Design' },
  { value: 'backend', label: 'Backend' },
  { value: 'frontend', label: 'Frontend' },
  { value: 'testing', label: 'Testing' }
];

export function EditTaskModal({ task, onCancel, onSave, saving = false }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('general');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  const categoryValue = useMemo(() => {
    if (!category) return 'general';
    const exists = CATEGORY_OPTIONS.some(o => o.value === category);
    return exists ? category : 'general';
  }, [category]);

  useEffect(() => {
    if (!task) return;
    setTitle(task.title || '');
    setDescription(task.description || '');
    setPriority(task.priority || 'medium');
    setCategory(task.category || 'general');
    setDueDate(task.due_date || '');
    setError('');
  }, [task]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }

    await onSave({
      title: title.trim(),
      description: (description || '').trim(),
      priority,
      category: categoryValue,
      due_date: dueDate || null
    });
  };

  if (!task) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="glass-card modal-card">
        <form onSubmit={handleSubmit} id="edit-task-form">
          <div className="modal-header">
            <h3 className="modal-title">
              <Pencil size={18} color="var(--accent-primary)" />
              Edit Task
            </h3>
            <button type="button" className="icon-btn" onClick={onCancel} aria-label="Close edit modal">
              <X size={16} />
            </button>
          </div>

          {error && (
            <div className="form-error" role="alert">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label" htmlFor="edit-task-title-input">Title *</label>
              <input
                id="edit-task-title-input"
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
              <label className="form-label" htmlFor="edit-task-desc-input">Description (optional)</label>
              <textarea
                id="edit-task-desc-input"
                className="form-textarea"
                rows="2"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="edit-task-priority-select">Priority</label>
                <select
                  id="edit-task-priority-select"
                  className="form-input"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  {PRIORITY_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="edit-task-category-select">Category</label>
                <select
                  id="edit-task-category-select"
                  className="form-input"
                  value={categoryValue}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {CATEGORY_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="edit-task-duedate-input">Due Date</label>
                <input
                  id="edit-task-duedate-input"
                  type="date"
                  className="form-input"
                  value={dueDate || ''}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onCancel} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" id="save-edit-task-submit" disabled={saving}>
              <Save size={16} />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
