import React from 'react';
import { Check, Trash2, Calendar, Tag, AlertCircle } from 'lucide-react';

export function TaskCard({ task, onToggleComplete, onDelete }) {
  const isCompleted = Boolean(task.completed);

  const getPriorityBadge = (p) => {
    switch (p) {
      case 'high':
        return <span className="badge badge-high"><AlertCircle size={12} /> High</span>;
      case 'low':
        return <span className="badge badge-low">Low</span>;
      default:
        return <span className="badge badge-medium">Medium</span>;
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className={`glass-card task-card ${isCompleted ? 'completed' : ''}`} data-task-id={task.id}>
      <div 
        className={`custom-checkbox ${isCompleted ? 'checked' : ''}`} 
        onClick={() => onToggleComplete(task)}
        role="checkbox"
        aria-checked={isCompleted}
        id={`toggle-task-${task.id}`}
        title={isCompleted ? 'Mark as active' : 'Mark as completed'}
      >
        {isCompleted && <Check size={16} strokeWidth={3} />}
      </div>

      <div className="task-content">
        <div className="task-header">
          <h4 className="task-title">{task.title}</h4>
          <div className="task-actions">
            <button 
              className="delete-btn" 
              onClick={() => onDelete(task.id)}
              title="Delete task"
              id={`delete-task-${task.id}`}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {task.description && (
          <p className="task-desc">{task.description}</p>
        )}

        <div className="task-meta">
          {getPriorityBadge(task.priority)}
          
          {task.category && (
            <span className="badge badge-category">
              <Tag size={10} />
              {task.category}
            </span>
          )}

          {task.due_date && (
            <span className="task-date">
              <Calendar size={12} />
              {formatDate(task.due_date)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
