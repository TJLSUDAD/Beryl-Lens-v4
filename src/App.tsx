import React from 'react';
import { Button } from './components/ui/button';
import { NavButtons } from './components/ui/nav-buttons';
import { AutonomousTasks } from './components/tasks/autonomous-tasks';
import { SettingsPanel } from './components/settings/settings-panel';
import { ChatInterface } from './components/chat/chat-interface';
import { useStore } from './store';
import { BerylLogo } from './components/ui/logo';

export default function App() {
  const [activeView, setActiveView] = React.useState<'chat' | 'settings' | 'tasks'>('chat');
  const [showDropdown, setShowDropdown] = React.useState(false);
  const { tasks, addTask, deleteTask, updateTask } = useStore();

  const handleViewChange = (view: 'chat' | 'settings' | 'tasks') => {
    setActiveView(view);
    setShowDropdown(false);
  };

  const handleDeploy = () => {
    setShowDropdown(!showDropdown);
  };

  const handleStop = () => {
    // Add stop functionality here
    setShowDropdown(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="window-frame">
        <div className="window-header">
          <div className="window-controls">
            <div className="window-control bg-red-500" />
            <div className="window-control bg-yellow-500" />
            <div className="window-control bg-green-500" />
          </div>
          <div className="flex items-center justify-center flex-1">
            <div className="flex items-center gap-2">
              <BerylLogo size={24} className="text-primary" />
              <span className="text-lg font-display font-medium text-primary">Beryl's Lens</span>
            </div>
          </div>
          <span className="window-status">Idle</span>
        </div>

        <div className="p-4 space-y-4">
          <NavButtons 
            onViewChange={handleViewChange}
            onDeployClick={handleDeploy}
            onStopClick={handleStop}
          />

          {/* Main Content */}
          {activeView === 'settings' ? (
            <SettingsPanel onClose={() => handleViewChange('chat')} />
          ) : activeView === 'tasks' ? (
            <AutonomousTasks
              tasks={tasks}
              onAddTask={addTask}
              onDeleteTask={deleteTask}
              onUpdateTask={updateTask}
              onClose={() => handleViewChange('chat')}
            />
          ) : (
            <ChatInterface />
          )}
        </div>
      </div>
    </div>
  );
}