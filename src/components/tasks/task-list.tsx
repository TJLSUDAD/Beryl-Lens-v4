import React from 'react';
import { Plus } from 'lucide-react';
import { Task } from '../../types';
import { Button } from '../ui/button';
import { TaskItem } from './task-item';

interface TaskListProps {
  tasks: Task[];
  onAddTask: () => void;
  onDeleteTask: (id: string) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
}

export function TaskList({
  tasks,
  onAddTask,
  onDeleteTask,
  onUpdateTask,
}: TaskListProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-accent">Autonomous Tasks</h3>
        <Button
          variant="primary"
          onClick={onAddTask}
          className="flex items-center gap-1.5"
          size="sm"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Task
        </Button>
      </div>

      <div className="space-y-2">
        {tasks.map((task, index) => (
          <TaskItem
            key={task.id}
            task={task}
            index={index}
            onDelete={onDeleteTask}
            onUpdate={onUpdateTask}
          />
        ))}
      </div>
    </div>
  );
}