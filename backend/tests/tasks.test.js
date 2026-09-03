import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { run, initDb } from '../src/db.js';

describe('Task Management API', () => {
  beforeEach(async () => {
    await initDb();
    await run('DELETE FROM tasks');
  });

  it('POST /api/tasks should create a new task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({
        title: 'Buy groceries',
        description: 'Milk, Eggs, Bread',
        priority: 'high',
        category: 'personal'
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe('Buy groceries');
    expect(res.body.completed).toBe(0);
    expect(res.body.priority).toBe('high');
  });

  it('POST /api/tasks should return 400 if title is missing', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ description: 'No title task' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Task title is required');
  });

  it('GET /api/tasks should list all tasks', async () => {
    await request(app).post('/api/tasks').send({ title: 'Task 1' });
    await request(app).post('/api/tasks').send({ title: 'Task 2' });

    const res = await request(app).get('/api/tasks');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
  });

  it('GET /api/tasks?category=X should filter tasks by category', async () => {
    await request(app).post('/api/tasks').send({ title: 'Work task', category: 'work' });
    await request(app).post('/api/tasks').send({ title: 'Personal task', category: 'personal' });

    const res = await request(app).get('/api/tasks?category=work');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].title).toBe('Work task');
  });

  it('GET /api/tasks?category=all should return tasks of every category', async () => {
    await request(app).post('/api/tasks').send({ title: 'Work task', category: 'work' });
    await request(app).post('/api/tasks').send({ title: 'Personal task', category: 'personal' });

    const res = await request(app).get('/api/tasks?category=all');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
  });

  it('PATCH /api/tasks/:id should toggle task completed state', async () => {
    const created = await request(app).post('/api/tasks').send({ title: 'Task to complete' });
    const taskId = created.body.id;

    const patchRes = await request(app)
      .patch(`/api/tasks/${taskId}`)
      .send({ completed: true });

    expect(patchRes.status).toBe(200);
    expect(patchRes.body.completed).toBe(1);
  });

  it('DELETE /api/tasks/:id should remove a task', async () => {
    const created = await request(app).post('/api/tasks').send({ title: 'Task to delete' });
    const taskId = created.body.id;

    const delRes = await request(app).delete(`/api/tasks/${taskId}`);
    expect(delRes.status).toBe(200);

    const getRes = await request(app).get(`/api/tasks/${taskId}`);
    expect(getRes.status).toBe(404);
  });
});
