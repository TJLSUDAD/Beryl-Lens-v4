import React from 'react';
import { FileText, Pause, Play, SkipBack, SkipForward, Square, ExternalLink, Code, MousePointer2 } from 'lucide-react';
import { useStore } from '../../store';
import { cn } from '../../lib/utils';
import ReactMarkdown from 'react-markdown';
import { Action } from '../../types';

export function ArtifactsPanel() {
  const { actions, isProcessing, currentProjectId } = useStore();
  const [isPlaying, setIsPlaying] = React.useState(false);
  const actionsEndRef = React.useRef<HTMLDivElement>(null);
  const [selectedAction, setSelectedAction] = React.useState<Action | null>(null);

  React.useEffect(() => {
    actionsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [actions]);

  const handleControlClick = (control: 'back' | 'play' | 'forward' | 'stop') => {
    switch (control) {
      case 'play':
        setIsPlaying(!isPlaying);
        break;
      case 'stop':
        setIsPlaying(false);
        break;
    }
  };

  const renderActionIcon = (type: Action['type']) => {
    switch (type) {
      case 'automation':
        return <MousePointer2 className="w-4 h-4 text-blue-400" />;
      case 'bolt':
        return <Code className="w-4 h-4 text-emerald-400" />;
      default:
        return null;
    }
  };

  const renderActionDetails = (action: Action) => {
    if (!action.details) return null;

    return (
      <div className="mt-3 space-y-2 text-sm">
        {action.details.url && (
          <div className="flex items-center space-x-2">
            <ExternalLink className="w-4 h-4 text-blue-400" />
            <a
              href={action.details.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              {new URL(action.details.url).hostname}
            </a>
          </div>
        )}
        {action.details.action && (
          <div className="flex items-center space-x-2">
            <MousePointer2 className="w-4 h-4 text-primary" />
            <span>{`${action.details.action} ${action.details.selector || ''}`}</span>
          </div>
        )}
        {action.details.screenshot && (
          <img
            src={action.details.screenshot}
            alt="Action Screenshot"
            className="mt-2 rounded-md border border-border"
          />
        )}
      </div>
    );
  };

  const filteredActions = actions.filter(
    (action) => action.projectId === currentProjectId
  );

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex items-center px-6 py-3 border-b border-border bg-card">
        <FileText className="w-5 h-5 mr-2 text-primary" />
        <h2 className="text-base font-medium text-foreground">Artifacts</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-custom">
        {!currentProjectId ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Select a project to view artifacts
          </div>
        ) : filteredActions.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No actions recorded yet
          </div>
        ) : (
          filteredActions.map((action) => (
            <div
              key={action.id}
              className={cn(
                "p-4 rounded-lg border transition-all duration-200 hover:shadow-md cursor-pointer",
                {
                  'bg-destructive/10 border-destructive/20': action.type === 'error',
                  'bg-primary/10 border-primary/20': action.type === 'result',
                  'bg-blue-500/10 border-blue-500/20': action.type === 'automation',
                  'bg-emerald-500/10 border-emerald-500/20': action.type === 'bolt',
                  'bg-secondary border-border': action.type === 'command',
                  'ring-2 ring-primary': selectedAction?.id === action.id,
                }
              )}
              onClick={() => setSelectedAction(action)}
            >
              <div className="flex items-start space-x-3">
                {renderActionIcon(action.type)}
                <div className="flex-1">
                  <ReactMarkdown className="text-sm leading-relaxed prose prose-sm max-w-none prose-invert">
                    {action.content}
                  </ReactMarkdown>
                  {renderActionDetails(action)}
                </div>
              </div>
              <div className="flex justify-between items-center mt-3">
                <span className="text-xs text-muted-foreground">
                  {action.timestamp.toLocaleTimeString()}
                </span>
                {action.status && (
                  <span className={cn(
                    "text-xs px-2.5 py-1 rounded-full font-medium",
                    {
                      'bg-primary/20 text-primary-foreground': action.status === 'pending',
                      'bg-emerald-500/20 text-emerald-200': action.status === 'completed',
                      'bg-destructive/20 text-destructive-foreground': action.status === 'failed',
                    }
                  )}>
                    {action.status}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={actionsEndRef} />
      </div>

      <div className="px-6 py-4 border-t border-border bg-card">
        <div className="flex justify-center items-center gap-6">
          <button
            onClick={() => handleControlClick('back')}
            disabled={!filteredActions.length || isProcessing}
            className="p-2 text-muted-foreground hover:text-primary transition-colors disabled:opacity-40 disabled:hover:text-muted-foreground"
            title="Previous Action"
          >
            <SkipBack className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleControlClick('play')}
            disabled={!filteredActions.length || isProcessing}
            className="p-2 text-muted-foreground hover:text-primary transition-colors disabled:opacity-40 disabled:hover:text-muted-foreground"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={() => handleControlClick('forward')}
            disabled={!filteredActions.length || isProcessing}
            className="p-2 text-muted-foreground hover:text-primary transition-colors disabled:opacity-40 disabled:hover:text-muted-foreground"
            title="Next Action"
          >
            <SkipForward className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleControlClick('stop')}
            disabled={!isPlaying || isProcessing}
            className="p-2 text-muted-foreground hover:text-primary transition-colors disabled:opacity-40 disabled:hover:text-muted-foreground"
            title="Stop"
          >
            <Square className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}