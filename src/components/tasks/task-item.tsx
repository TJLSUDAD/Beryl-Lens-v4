import React from 'react';
import { Trash2 } from 'lucide-react';
import { Task } from '../../types';
import { Input } from '../ui/input';
import { Select } from '../ui/select';

interface TaskItemProps {
  task: Task;
  index: number;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
}

export function TaskItem({ task, index, onDelete, onUpdate }: TaskItemProps) {
  return (
    <div className="task-card">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-muted-foreground">
          Task {index + 1}
        </span>
        <button
          onClick={() => onDelete(task.id)}
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Selector</label>
          <Input
            value={task.selector}
            onChange={(e) => onUpdate(task.id, { selector: e.target.value })}
            placeholder=".button, #element"
            className="h-8 text-xs"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Action</label>
          <Select
            value={task.action}
            onChange={(e) => onUpdate(task.id, { action: e.target.value as Task['action'] })}
            className="h-8 text-xs"
          >
            <option value="click">Click</option>
            <option value="type">Type</option>
            <option value="select">Select</option>
            <option value="submit">Submit</option>
          </Select>
        </div>
      </div>
    </div>
  );
}