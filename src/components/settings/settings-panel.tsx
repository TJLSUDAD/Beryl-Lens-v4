import React from 'react';
import { Globe, Key, Activity, LayersIcon, X } from 'lucide-react';
import { Button } from '../ui/button';

interface SettingsPanelProps {
  onClose: () => void;
}

const tabs = [
  { id: 'basic', label: 'Basic', icon: Globe },
  { id: 'pagination', label: 'Pagination', icon: LayersIcon },
  { id: 'content', label: 'Content', icon: Activity },
];

export function SettingsPanel({ onClose }: SettingsPanelProps) {
  const [activeTab, setActiveTab] = React.useState('basic');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-md flex items-center gap-2 transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="hover:bg-destructive/10"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm text-muted-foreground">Target URL</label>
          <input
            type="url"
            placeholder="https://example.com"
            className="input-dark w-full"
          />
        </div>

        <div>
          <label className="text-sm text-muted-foreground">API Key</label>
          <input
            type="password"
            placeholder="Enter API key"
            className="input-dark w-full"
          />
        </div>

        <div>
          <label className="text-sm text-muted-foreground">Deployment Status</label>
          <select className="input-dark w-full">
            <option value="idle">Idle</option>
            <option value="running">Running</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>
    </div>
  );
}