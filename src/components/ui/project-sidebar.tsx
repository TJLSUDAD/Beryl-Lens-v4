import React, { useState } from 'react';
import { FolderPlus, Plus, Trash2, Globe } from 'lucide-react';
import { useStore } from '../../store';
import { cn } from '../../lib/utils';
import { Project } from '../../types';

export function ProjectSidebar() {
  const { projects, createProject, setCurrentProject, deleteProject, currentProjectId } = useStore();
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [projectType, setProjectType] = useState<Project['type']>('general');
  const [projectUrl, setProjectUrl] = useState('');

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProjectName.trim()) {
      const config = projectType === 'scraper' ? {
        url: projectUrl,
        saveToSupabase: true,
        exportJson: true,
        exportPdf: true,
      } : undefined;

      createProject(newProjectName.trim(), projectType, config);
      setNewProjectName('');
      setProjectUrl('');
      setProjectType('general');
      setIsCreating(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-card rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h2 className="text-base font-medium text-foreground">Select a Project</h2>
        <button
          onClick={() => setIsCreating(true)}
          className="p-1 text-muted-foreground hover:text-primary transition-colors"
          title="New Project"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2 max-h-[400px] scrollbar-custom">
        {isCreating && (
          <form onSubmit={handleCreateProject} className="p-3 bg-background/50 rounded-md space-y-3">
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Project name..."
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              autoFocus
            />

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setProjectType('general')}
                className={cn(
                  "flex-1 px-3 py-2 text-sm rounded-md border transition-colors",
                  projectType === 'general'
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background border-border hover:border-primary"
                )}
              >
                General
              </button>
              <button
                type="button"
                onClick={() => setProjectType('scraper')}
                className={cn(
                  "flex-1 px-3 py-2 text-sm rounded-md border transition-colors",
                  projectType === 'scraper'
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background border-border hover:border-primary"
                )}
              >
                Web Scraper
              </button>
            </div>

            {projectType === 'scraper' && (
              <input
                type="url"
                value={projectUrl}
                onChange={(e) => setProjectUrl(e.target.value)}
                placeholder="Enter URL to scrape..."
                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            )}
          </form>
        )}

        {projects.length === 0 && !isCreating && (
          <div className="flex flex-col items-center justify-center h-32 text-center px-4">
            <FolderPlus className="w-8 h-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              Create a new project to get started
            </p>
          </div>
        )}

        {projects.map((project) => (
          <div
            key={project.id}
            className={cn(
              "group flex items-center justify-between px-4 py-3 rounded-md cursor-pointer hover:bg-secondary/50 transition-colors",
              currentProjectId === project.id && "bg-secondary"
            )}
            onClick={() => setCurrentProject(project.id)}
          >
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              {project.type === 'scraper' ? (
                <Globe className="w-4 h-4 text-primary flex-shrink-0" />
              ) : (
                <FolderPlus className="w-4 h-4 text-primary flex-shrink-0" />
              )}
              <div>
                <p className="text-sm font-medium truncate">{project.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {project.type === 'scraper' && project.config?.url ? (
                    new URL(project.config.url).hostname
                  ) : (
                    `Last active: ${project.lastActive.toLocaleDateString()}`
                  )}
                </p>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteProject(project.id);
              }}
              className="p-1 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-colors"
              title="Delete Project"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}