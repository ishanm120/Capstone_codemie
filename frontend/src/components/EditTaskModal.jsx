import React, { useEffect, useMemo, useState } from 'react';
import { X, Save, Calendar, Tag, AlertCircle, Pencil } from 'lucide-react';

function toDateInputValue(dateStr) {
  if (!dateStr) return '';
  // Backend stores YYYY-MM-DD; handle full ISO strings defensively.
  const isoMatch = String(dateStr).match(/^\d{4}-\d{2}-\d{2}/);
  return isoMatch ? isoMatch[0] : '';
}

export function EditTaskModal({ task, onCancel, onSave, saving = false }) {
  const initial = useMemo(() => {
    if (!task) return null;
    return {
      title: task.title ?? '',
      description: task.description ?? '',
      priority: task.priority ?? 'medium',
      category: task.category ?? 'general',
      due_date: toDateInputValue(task.due_date)
    };
  }, [task]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('general');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!initial) return;
    setTitle(initial.title);
    setDescription(initial.description);
    setPriority(['low', 'medium', 'high'].includes(initial.priority) ? initial.priority : 'medium');
    setCategory(initial.category || 'general');
    setDueDate(initial.due_date || '');
    setError('');
  }, [initial]);

  if (!task) return null;

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

  return (
    <div className="tm-modal-overlay" role="dialog" aria-modal="true" aria-label="Edit task">
      <div className="glass-card tm-modal" id="edit-task-modal">
        <div className="tm-modal-header">
          <h3 className="tm-modal-title">
            <Pencil size={18} color="var(--accent-primary)" />
            Edit Task
          </h3>
          <button
            type="button"
            className="icon-btn"
            style={{ width: 32, height: 32 }}
            onClick={onCancel}
            disabled={saving}
            aria-label="Close"
            id="edit-task-cancel-x"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="tm-inline-error" id="edit-task-title-error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label" htmlFor="edit-task-title">Title *</label>
              <input
                id="edit-task-title"
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
              <label className="form-label" htmlFor="edit-task-desc">Description</label>
              <textarea
                id="edit-task-desc"
                className="form-textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="edit-task-priority">Priority</label>
                <select
                  id="edit-task-priority"
                  className="select-input"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="edit-task-category">Category</label>
                <div style={{ position: 'relative' }}>
                  <Tag size={14} className="tm-input-icon" />
                  <input
                    id="edit-task-category"
                    type="text"
                    className="form-input"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. general"
                    style={{ paddingLeft: '2.5rem' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="edit-task-due">Due date</label>
                <div style={{ position: 'relative' }}>
                  <Calendar size={14} className="tm-input-icon" />
                  <input
                    id="edit-task-due"
                    type="date"
                    className="form-input"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    style={{ paddingLeft: '2.5rem' }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions tm-modal-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={onCancel}
              disabled={saving}
              id="edit-task-cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={saving}
              id="edit-task-save"
            >
              <Save size={16} />
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
