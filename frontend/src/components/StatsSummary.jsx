import React from 'react';
import { ListTodo, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

export function StatsSummary({ stats }) {
  const { total = 0, completed = 0, pending = 0, highPriority = 0 } = stats;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="stats-grid">
      <div className="glass-card stat-card stat-total">
        <div className="stat-icon-wrapper">
          <ListTodo size={22} />
        </div>
        <div className="stat-info">
          <span className="stat-value">{total}</span>
          <span className="stat-label">Total Tasks</span>
        </div>
      </div>

      <div className="glass-card stat-card stat-completed">
        <div className="stat-icon-wrapper">
          <CheckCircle2 size={22} />
        </div>
        <div className="stat-info" style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="stat-value">{completed}</span>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>{percentage}%</span>
          </div>
          <span className="stat-label">Completed</span>
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: `${percentage}%` }} />
          </div>
        </div>
      </div>

      <div className="glass-card stat-card stat-pending">
        <div className="stat-icon-wrapper">
          <Clock size={22} />
        </div>
        <div className="stat-info">
          <span className="stat-value">{pending}</span>
          <span className="stat-label">Pending</span>
        </div>
      </div>

      <div className="glass-card stat-card stat-urgent">
        <div className="stat-icon-wrapper">
          <AlertTriangle size={22} />
        </div>
        <div className="stat-info">
          <span className="stat-value">{highPriority}</span>
          <span className="stat-label">High Priority</span>
        </div>
      </div>
    </div>
  );
}
