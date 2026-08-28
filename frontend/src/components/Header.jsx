import React from 'react';
import { CheckSquare, Moon, Sun, Plus } from 'lucide-react';

export function Header({ theme, toggleTheme, onOpenForm }) {
  return (
    <header className="glass-card header-card">
      <div className="brand-container">
        <div className="brand-icon">
          <CheckSquare size={26} strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="brand-title">TaskMaster Pro1</h1>
          <p className="brand-subtitle">Smart & sleek task management</p>
        </div>
      </div>

      <div className="header-actions">
        <button
          className="icon-btn"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          id="theme-toggle-btn"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button className="btn-primary" onClick={onOpenForm} id="add-task-btn">
          <Plus size={18} />
          <span>New Task</span>
        </button>
      </div>
    </header>
  );
}
