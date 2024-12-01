import React from 'react';
import { Brain, Zap, Clock, Eye, Database, RotateCw, X } from 'lucide-react';
import { Task } from '../../types';
import { Button } from '../ui/button';
import { TaskItem } from './task-item';

interface AutonomousTasksProps {
  tasks: Task[];
  onAddTask: () => void;
  onDeleteTask: (id: string) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onClose: () => void;
}

export function AutonomousTasks({
  tasks,
  onAddTask,
  onDeleteTask,
  onUpdateTask,
  onClose,
}: AutonomousTasksProps) {
  const [selectedFeatures, setSelectedFeatures] = React.useState<string[]>([]);

  const advancedFeatures = [
    {
      id: 'ai-optimization',
      label: 'AI Task Optimization',
      description: 'Automatically optimize task sequences using Claude 3.5',
      icon: Brain,
    },
    {
      id: 'parallel-execution',
      label: 'Parallel Execution',
      description: 'Execute multiple tasks simultaneously for faster automation',
      icon: Zap,
    },
    {
      id: 'smart-scheduling',
      label: 'Smart Scheduling',
      description: 'Schedule tasks based on system load and priority',
      icon: Clock,
    },
    {
      id: 'visual-verification',
      label: 'Visual Verification',
      description: 'Verify task completion using computer vision',
      icon: Eye,
    },
    {
      id: 'state-persistence',
      label: 'State Persistence',
      description: 'Save and restore automation state across sessions',
      icon: Database,
    },
    {
      id: 'auto-recovery',
      label: 'Automatic Recovery',
      description: 'Self-heal and retry failed tasks with intelligent backoff',
      icon: RotateCw,
    },
  ];

  const toggleFeature = (featureId: string) => {
    setSelectedFeatures(prev =>
      prev.includes(featureId)
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-accent">Advanced Features</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="hover:bg-destructive/10"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {advancedFeatures.map(feature => {
          const Icon = feature.icon;
          const isSelected = selectedFeatures.includes(feature.id);
          
          return (
            <div
              key={feature.id}
              className={`
                p-3 rounded-lg border cursor-pointer transition-all duration-200
                ${isSelected 
                  ? 'bg-primary/10 border-primary/30 shadow-lg shadow-primary/5' 
                  : 'bg-secondary/30 border-border/10 hover:bg-secondary/50'
                }
              `}
              onClick={() => toggleFeature(feature.id)}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-md ${isSelected ? 'bg-primary/20' : 'bg-secondary/50'}`}>
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
                <div className="space-y-1">
                  <h4 className={`text-sm font-medium ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                    {feature.label}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-accent">Task Sequence</h3>
          <Button
            variant="primary"
            onClick={onAddTask}
            className="flex items-center gap-1.5"
            size="sm"
          >
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
          {tasks.length === 0 && (
            <div className="text-center py-6 bg-secondary/30 rounded-lg border border-border/10">
              <p className="text-sm text-muted-foreground">
                No tasks added yet. Click "Add Task" to get started.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          variant="ghost"
          size="sm"
          disabled={tasks.length === 0}
        >
          Reset
        </Button>
        <Button
          variant="primary"
          size="sm"
          disabled={tasks.length === 0}
        >
          Execute Sequence
        </Button>
      </div>
    </div>
  );
}