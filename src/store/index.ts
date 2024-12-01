import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { AppState, Task, Message } from '../types';
import { cli, CLICommand } from '../lib/cli';

export const useStore = create<AppState>((set, get) => ({
  tasks: [],
  messages: [],
  targetUrl: '',
  isDeploying: false,
  deploymentStatus: 'idle',
  currentCommand: null,

  setTargetUrl: (url) => set({ targetUrl: url }),
  
  addTask: () => set((state) => ({
    tasks: [
      ...state.tasks,
      {
        id: uuidv4(),
        selector: '',
        action: 'click',
      },
    ],
  })),

  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter((task) => task.id !== id),
  })),

  updateTask: (id, updates) => set((state) => ({
    tasks: state.tasks.map((task) =>
      task.id === id ? { ...task, ...updates } : task
    ),
  })),

  addMessage: (message) => set((state) => ({
    messages: [...state.messages, {
      id: uuidv4(),
      timestamp: new Date(),
      ...message,
    }],
  })),

  clearMessages: () => set({ messages: [] }),

  deploy: async () => {
    const state = get();
    if (!state.targetUrl || state.isDeploying) return;

    set({ isDeploying: true, deploymentStatus: 'deploying' });

    try {
      const command = await cli.deploy(state.targetUrl);
      set({ 
        currentCommand: command,
        deploymentStatus: command.status === 'completed' ? 'deployed' : 'failed',
        isDeploying: false 
      });
    } catch (error) {
      set({ 
        deploymentStatus: 'failed',
        isDeploying: false,
        currentCommand: {
          id: uuidv4(),
          type: 'deploy',
          status: 'failed',
          error: error.message,
          params: { url: state.targetUrl }
        }
      });
    }
  },

  stop: async () => {
    const state = get();
    if (state.deploymentStatus !== 'deployed') return;

    try {
      const command = await cli.stop();
      set({ 
        currentCommand: command,
        deploymentStatus: 'idle'
      });
    } catch (error) {
      set({ 
        currentCommand: {
          id: uuidv4(),
          type: 'stop',
          status: 'failed',
          error: error.message,
          params: {}
        }
      });
    }
  },

  executeTask: async (taskId: string) => {
    const state = get();
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return;

    try {
      const command = await cli.executeTask({
        selector: task.selector,
        action: task.action,
        value: task.value
      });
      set({ currentCommand: command });
    } catch (error) {
      set({ 
        currentCommand: {
          id: uuidv4(),
          type: 'execute',
          status: 'failed',
          error: error.message,
          params: task
        }
      });
    }
  }
}));

// Subscribe to CLI command updates
cli.onCommandUpdate((command: CLICommand) => {
  useStore.setState({ currentCommand: command });
});