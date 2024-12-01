import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from '../ui/button';

interface SettingsTabProps {
  id: string;
  label: string;
  icon: LucideIcon;
  isActive: boolean;
  onClick: () => void;
}

export function SettingsTab({
  id,
  label,
  icon: Icon,
  isActive,
  onClick,
}: SettingsTabProps) {
  return (
    <Button
      variant={isActive ? "primary" : "ghost"}
      onClick={onClick}
      className="flex items-center gap-2"
    >
      <Icon className="w-4 h-4" />
      {label}
    </Button>
  );
}