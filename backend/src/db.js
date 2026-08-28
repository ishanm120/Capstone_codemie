import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = process.env.NODE_ENV === 'test' 
  ? ':memory:' 
  : path.resolve(__dirname, '../tasks.db');

export const db = new sqlite3.Database(dbPath);

// Promisified DB helpers
export const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export const getOne = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

export const initDb = async () => {
  const schema = `
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      completed INTEGER DEFAULT 0,
      priority TEXT DEFAULT 'medium',
      category TEXT DEFAULT 'general',
      due_date TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await run(schema);

  // Seed sample data if database is brand new and empty
  const count = await getOne('SELECT COUNT(*) as count FROM tasks');
  if (count && count.count === 0 && process.env.NODE_ENV !== 'test') {
    const seedTasks = [
      ['Design modern dashboard layout', 'Create glassmorphism design system & responsive cards', 1, 'high', 'design', '2026-08-30'],
      ['Implement Express API endpoints', 'Add GET, POST, PATCH, DELETE routes with SQLite', 1, 'high', 'backend', '2026-08-29'],
      ['Write Playwright E2E tests', 'Verify task creation, completion toggle, and deletion flows', 0, 'medium', 'testing', '2026-08-31'],
      ['Review UI animations and responsiveness', 'Ensure hover micro-interactions and dark mode look crisp', 0, 'low', 'frontend', '2026-09-01']
    ];

    for (const [title, description, completed, priority, category, due_date] of seedTasks) {
      await run(
        `INSERT INTO tasks (title, description, completed, priority, category, due_date) VALUES (?, ?, ?, ?, ?, ?)`,
        [title, description, completed, priority, category, due_date]
      );
    }
  }
};
