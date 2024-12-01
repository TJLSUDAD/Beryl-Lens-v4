import React from 'react';
import { Play, StopCircle, Settings, Brain } from 'lucide-react';
import { Button } from './button';

interface NavButtonsProps {
  onViewChange: (view: 'chat' | 'settings' | 'tasks') => void;
  onDeployClick: () => void;
  onStopClick: () => void;
}

export function NavButtons({ onViewChange, onDeployClick, onStopClick }: NavButtonsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="primary"
        onClick={onDeployClick}
        className="flex items-center gap-1.5 hover:brightness-110 transition-all"
      >
        <Play className="w-3.5 h-3.5" />
        Deploy
      </Button>
      
      <Button 
        variant="destructive" 
        onClick={onStopClick}
        className="flex items-center gap-1.5 hover:brightness-110 transition-all"
      >
        <StopCircle className="w-3.5 h-3.5" />
        Stop
      </Button>

      <Button
        className="btn-metallic ml-auto flex items-center gap-1.5"
        onClick={() => onViewChange('tasks')}
      >
        <Brain className="w-3.5 h-3.5" />
        Autonomous Tasks
      </Button>

      <Button
        className="btn-metallic flex items-center gap-1.5"
        onClick={() => onViewChange('settings')}
      >
        <Settings className="w-3.5 h-3.5" />
        Configure Tasks
      </Button>
    </div>
  );
}