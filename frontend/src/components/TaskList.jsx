import React from 'react';
import { TaskCard } from './TaskCard';
import { Sparkles } from 'lucide-react';

export function TaskList({ tasks, onToggleComplete, onDelete, onOpenForm, onEditTask }) {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="glass-card empty-state">
        <div className="empty-icon">
          <Sparkles size={32} />
        </div>
        <h3 className="empty-title">No tasks found</h3>
        <p>You're all caught up or no tasks match your current filter!</p>
        <button className="btn-primary" style={{ marginTop: '0.5rem' }} onClick={onOpenForm}>
          Create New Task
        </button>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onDelete={onDelete}
          onEdit={onEditTask}
        />
      ))}
    </div>
  );
}