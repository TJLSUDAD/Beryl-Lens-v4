export interface Task {
  id: string;
  selector: string;
  action: 'click' | 'type' | 'select' | 'submit';
  value?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export type DeploymentStatus = 'idle' | 'deploying' | 'deployed' | 'failed';

export interface AppState {
  tasks: Task[];
  messages: Message[];
  targetUrl: string;
  isDeploying: boolean;
  deploymentStatus: DeploymentStatus;
  currentCommand: any;
  
  setTargetUrl: (url: string) => void;
  addTask: () => void;
  deleteTask: (id: string) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;
  deploy: () => Promise<void>;
  stop: () => Promise<void>;
  executeTask: (taskId: string) => Promise<void>;
}