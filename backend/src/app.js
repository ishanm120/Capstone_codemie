import express from 'express';
import cors from 'cors';
import { query, getOne, run, initDb } from './db.js';

export const app = express();

const CONTROLLED_CATEGORIES = new Set([
  'general',
  'work',
  'personal',
  'design',
  'backend',
  'frontend',
  'testing'
]);

function normalizeAndValidateCategory(category) {
  // category omitted is handled by callers (POST default / PATCH keep existing)
  if (category === null || category === undefined) return { ok: false };

  if (typeof category !== 'string') return { ok: false };

  const normalized = category.trim().toLowerCase();
  if (!normalized) return { ok: false };

  if (!CONTROLLED_CATEGORIES.has(normalized)) return { ok: false };

  return { ok: true, value: normalized };
}

app.use(cors());
app.use(express.json());

// Initialize table on boot
initDb().catch(console.error);

// GET /api/tasks - list tasks with filtering, search, sorting
app.get('/api/tasks', async (req, res) => {
  try {
    const { search, status, priority, category, sortBy } = req.query;
    let sql = 'SELECT * FROM tasks WHERE 1=1';
    const params = [];

    if (search) {
      sql += ' AND (title LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (status === 'completed') {
      sql += ' AND completed = 1';
    } else if (status === 'active') {
      sql += ' AND completed = 0';
    }

    if (priority && priority !== 'all') {
      sql += ' AND priority = ?';
      params.push(priority);
    }

    if (category && category !== 'all') {
      // Case-insensitive match without requiring DB migration / collation changes
      sql += ' AND LOWER(category) = LOWER(?)';
      params.push(category);
    }

    if (sortBy === 'due_date') {
      sql += ' ORDER BY due_date IS NULL ASC, due_date ASC, created_at DESC';
    } else if (sortBy === 'priority') {
      sql += ` ORDER BY CASE priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 WHEN 'low' THEN 3 ELSE 4 END ASC`;
    } else if (sortBy === 'title') {
      sql += ' ORDER BY title ASC';
    } else {
      sql += ' ORDER BY created_at DESC';
    }

    const tasks = await query(sql, params);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/tasks/stats - summary stats for dashboard
app.get('/api/tasks/stats', async (req, res) => {
  try {
    const total = await getOne('SELECT COUNT(*) as count FROM tasks');
    const completed = await getOne('SELECT COUNT(*) as count FROM tasks WHERE completed = 1');
    const pending = await getOne('SELECT COUNT(*) as count FROM tasks WHERE completed = 0');
    const highPriority = await getOne('SELECT COUNT(*) as count FROM tasks WHERE priority = "high" AND completed = 0');

    res.json({
      total: total.count,
      completed: completed.count,
      pending: pending.count,
      highPriority: highPriority.count
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/tasks/:id - single task
app.get('/api/tasks/:id', async (req, res) => {
  try {
    const task = await getOne('SELECT * FROM tasks WHERE id = ?', [req.params.id]);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/tasks - create new task
app.post('/api/tasks', async (req, res) => {
  try {
    const { title, description, priority = 'medium', category, due_date } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Task title is required' });
    }

    let categoryToStore = 'general';
    if (category !== undefined) {
      const validated = normalizeAndValidateCategory(category);
      if (!validated.ok) {
        return res.status(400).json({ error: 'INVALID_CATEGORY' });
      }
      categoryToStore = validated.value;
    }

    const result = await run(
      `INSERT INTO tasks (title, description, completed, priority, category, due_date) VALUES (?, ?, 0, ?, ?, ?)`,
      [title.trim(), (description || '').trim(), priority, categoryToStore, due_date || null]
    );

    const newTask = await getOne('SELECT * FROM tasks WHERE id = ?', [result.id]);
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/tasks/:id - toggle complete / update task
app.patch('/api/tasks/:id', async (req, res) => {
  try {
    const existing = await getOne('SELECT * FROM tasks WHERE id = ?', [req.params.id]);
    if (!existing) return res.status(404).json({ error: 'Task not found' });

    // Validate category up-front to ensure no side effects on invalid category.
    // Important: allow patching unrelated fields even if existing.category is legacy-invalid.
    let categoryToStore = existing.category;
    if (req.body.category !== undefined) {
      const validated = normalizeAndValidateCategory(req.body.category);
      if (!validated.ok) {
        return res.status(400).json({ error: 'INVALID_CATEGORY' });
      }
      categoryToStore = validated.value;
    }

    const title = req.body.title !== undefined ? req.body.title.trim() : existing.title;
    const description = req.body.description !== undefined ? req.body.description.trim() : existing.description;
    const completed = req.body.completed !== undefined ? (req.body.completed ? 1 : 0) : existing.completed;
    const priority = req.body.priority !== undefined ? req.body.priority : existing.priority;
    const due_date = req.body.due_date !== undefined ? req.body.due_date : existing.due_date;

    await run(
      `UPDATE tasks SET title = ?, description = ?, completed = ?, priority = ?, category = ?, due_date = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [title, description, completed, priority, categoryToStore, due_date, req.params.id]
    );

    const updatedTask = await getOne('SELECT * FROM tasks WHERE id = ?', [req.params.id]);
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/tasks/:id - delete task
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const existing = await getOne('SELECT * FROM tasks WHERE id = ?', [req.params.id]);
    if (!existing) return res.status(404).json({ error: 'Task not found' });

    await run('DELETE FROM tasks WHERE id = ?', [req.params.id]);
    res.json({ message: 'Task deleted successfully', task: existing });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/tasks - clear completed tasks
app.delete('/api/tasks', async (req, res) => {
  try {
    const result = await run('DELETE FROM tasks WHERE completed = 1');
    res.json({ message: `${result.changes} completed tasks removed` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
