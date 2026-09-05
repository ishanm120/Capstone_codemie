import React, { useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';

/**
 * EditTaskModal
 *
 * Props:
 * - task: task object (required)
 * - onCancel: () => void
 * - onSave: (updates) => Promise<void>
 */
export function EditTaskModal({ task, onCancel, onSave }) {
  const initialDueDate = useMemo(() => {
    if (!task?.due_date) return '';
    // Task due_date is stored as text. Keep only YYYY-MM-DD for the date input.
    return String(task.due_date).slice(0, 10);
  }, [task]);

  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState(task?.priority || 'medium');
  const [category, setCategory] = useState(task?.category || 'general');
  const [dueDate, setDueDate] = useState(initialDueDate);

  const [titleError, setTitleError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // If parent swaps the task, reset form to the new task.
    setTitle(task?.title || '');
    setDescription(task?.description || '');
    setPriority(task?.priority || 'medium');
    setCategory(task?.category || 'general');
    setDueDate(initialDueDate);
    setTitleError('');
    setSaving(false);
  }, [task, initialDueDate]);

  const validate = () => {
    const trimmed = title.trim();
    if (!trimmed) {
      setTitleError('Title is required');
      return false;
    }
    setTitleError('');
    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;

    const updates = {
      title: title.trim(),
      description: description || '',
      priority,
      category,
      due_date: dueDate || null
    };

    try {
      setSaving(true);
      await onSave(updates);
    } finally {
      // Parent handles closing on success; on error it keeps modal open.
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Edit Task">
      <div className="glass-card modal-card">
        <div className="modal-header">
          <h3>Edit Task</h3>
          <button className="icon-btn" onClick={onCancel} title="Close">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <label className="form-label">
            Title <span className="required">*</span>
            <input
              id="edit-task-title"
              className={`input ${titleError ? 'input-error' : ''}`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={validate}
              placeholder="Task title"
              disabled={saving}
              autoFocus
            />
            {titleError && <div className="field-error">{titleError}</div>}
          </label>

          <label className="form-label">
            Description
            <textarea
              id="edit-task-description"
              className="textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details..."
              disabled={saving}
              rows={3}
            />
          </label>

          <div className="form-row">
            <label className="form-label">
              Priority
              <select
                id="edit-task-priority"
                className="select"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                disabled={saving}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>

            <label className="form-label">
              Category
              <input
                id="edit-task-category"
                className="input"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="general"
                disabled={saving}
              />
            </label>
          </div>

          <label className="form-label">
            Due Date
            <input
              id="edit-task-due-date"
              type="date"
              className="input"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              disabled={saving}
            />
          </label>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onCancel} disabled={saving}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleSave} disabled={saving} id="save-task-edits">
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
