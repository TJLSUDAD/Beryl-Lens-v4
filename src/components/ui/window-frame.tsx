import React from 'react';

export function WindowFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg overflow-hidden border border-border/50 bg-card shadow-xl">
      {/* Window Header */}
      <div className="bg-background px-4 py-2 flex items-center justify-between border-b border-border/50">
        <div className="window-controls">
          <div className="window-control window-close" />
          <div className="window-control window-minimize" />
          <div className="window-control window-maximize" />
        </div>
        <div className="text-xs text-muted-foreground">Beryl's Lens</div>
        <div className="text-xs text-muted-foreground">Idle</div>
      </div>

      {/* Window Content */}
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}