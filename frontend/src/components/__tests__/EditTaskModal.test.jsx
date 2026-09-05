import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EditTaskModal } from '../EditTaskModal';

describe('EditTaskModal', () => {
  it('pre-populates fields from task and calls onSave with updates', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn().mockResolvedValue(undefined);

    render(
      <EditTaskModal
        task={{
          id: 1,
          title: 'Original Title',
          description: 'Original Description',
          priority: 'low',
          category: 'work',
          due_date: '2026-09-01'
        }}
        onCancel={() => {}}
        onSave={onSave}
      />
    );

    expect(screen.getByLabelText(/title/i)).toHaveValue('Original Title');
    expect(screen.getByLabelText(/description/i)).toHaveValue('Original Description');
    expect(screen.getByLabelText(/priority/i)).toHaveValue('low');
    expect(screen.getByLabelText(/category/i)).toHaveValue('work');
    expect(screen.getByLabelText(/due date/i)).toHaveValue('2026-09-01');

    await user.clear(screen.getByLabelText(/title/i));
    await user.type(screen.getByLabelText(/title/i), 'Updated Title');

    await user.click(screen.getByRole('button', { name: /save changes/i }));

    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith({
      title: 'Updated Title',
      description: 'Original Description',
      priority: 'low',
      category: 'work',
      due_date: '2026-09-01'
    });
  });

  it('prevents save when title is empty and shows inline error', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();

    render(
      <EditTaskModal
        task={{ id: 1, title: 'T', description: '', priority: 'medium', category: 'general', due_date: null }}
        onCancel={() => {}}
        onSave={onSave}
      />
    );

    await user.clear(screen.getByLabelText(/title/i));
    await user.click(screen.getByRole('button', { name: /save changes/i }));

    expect(onSave).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent(/task title is required/i);
  });
});
