import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { StatsSummary } from './components/StatsSummary';
import { FilterBar } from './components/FilterBar';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import { EditTaskModal } from './components/EditTaskModal';
import { Toast } from './components/Toast';
import { api } from './services/api';

export function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, highPriority: 0 });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    priority: 'all',
    category: 'all',
    sortBy: 'created_at'
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [fetchedTasks, fetchedStats] = await Promise.all([
        api.getTasks(filters),
        api.getStats()
      ]);
      setTasks(fetchedTasks);
      setStats(fetchedStats);
    } catch (err) {
      showToast('Error connecting to backend API', 'warning');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filters]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleCreateTask = async (taskData) => {
    try {
      const created = await api.createTask(taskData);
      showToast(`Task "${created.title}" created successfully!`);
      setIsFormOpen(false);
      loadData();
    } catch (err) {
      showToast(err.message || 'Failed to create task', 'warning');
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
  };

  const handleCancelEdit = () => {
    if (savingEdit) return;
    setEditingTask(null);
  };

  const handleSaveEdit = async (updates) => {
    if (!editingTask || savingEdit) return;

    try {
      setSavingEdit(true);
      const updated = await api.updateTask(editingTask.id, updates);
      showToast(`Task "${updated.title}" updated successfully!`);
      setEditingTask(null);
      await loadData();
    } catch (err) {
      showToast(err.message || 'Failed to update task', 'warning');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      const updated = await api.updateTask(task.id, { completed: !task.completed });
      const statusText = updated.completed ? 'completed' : 'reactivated';
      showToast(`Task marked as ${statusText}!`, 'info');
      loadData();
    } catch (err) {
      showToast('Failed to update task status', 'warning');
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      const result = await api.deleteTask(id);
      showToast('Task deleted successfully', 'info');
      loadData();
    } catch (err) {
      showToast('Failed to delete task', 'warning');
    }
  };

  return (
    <div className="app-wrapper">
      <div className="bg-glow-1" />
      <div className="bg-glow-2" />

      <div className="content-container">
        <Header
          theme={theme}
          toggleTheme={toggleTheme}
          onOpenForm={() => setIsFormOpen(prev => !prev)}
        />

        <StatsSummary stats={stats} />

        {isFormOpen && (
          <TaskForm
            onSubmit={handleCreateTask}
            onClose={() => setIsFormOpen(false)}
          />
        )}

        <FilterBar filters={filters} setFilters={setFilters} />

        {loading ? (
          <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            Loading your tasks...
          </div>
        ) : (
          <TaskList
            tasks={tasks}
            onToggleComplete={handleToggleComplete}
            onDelete={handleDeleteTask}
            onEdit={handleEditTask}
            onOpenForm={() => setIsFormOpen(true)}
          />
        )}
      </div>

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          saving={savingEdit}
          onCancel={handleCancelEdit}
          onSave={handleSaveEdit}
        />
      )}

      <Toast toasts={toasts} />
    </div>
  );
}

export default App;
