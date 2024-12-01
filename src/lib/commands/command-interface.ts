import { v4 as uuidv4 } from 'uuid';

export interface Command {
  id: string;
  type: 'cli' | 'voice' | 'natural' | 'gesture' | 'keyboard';
  input: string;
  context?: Record<string, any>;
  timestamp: Date;
}

export interface CommandHandler {
  initialize(): Promise<void>;
  process(input: string, context?: Record<string, any>): Promise<void>;
}

export class CommandInterface {
  private handlers: Map<string, CommandHandler> = new Map();
  private commandHistory: Command[] = [];

  constructor() {
    this.initializeHandlers();
  }

  private async initializeHandlers() {
    // Initialize command handlers
    const handlers: Record<string, CommandHandler> = {
      cli: new CLIHandler(),
      voice: new VoiceHandler(),
      natural: new NaturalLanguageHandler(),
      gesture: new GestureHandler(),
      keyboard: new KeyboardHandler()
    };

    for (const [type, handler] of Object.entries(handlers)) {
      await handler.initialize();
      this.handlers.set(type, handler);
    }
  }

  async processCommand(type: Command['type'], input: string, context?: Record<string, any>): Promise<void> {
    const handler = this.handlers.get(type);
    if (!handler) {
      throw new Error(`No handler found for command type: ${type}`);
    }

    const command: Command = {
      id: uuidv4(),
      type,
      input,
      context,
      timestamp: new Date()
    };

    this.commandHistory.push(command);
    await handler.process(input, context);
  }

  getCommandHistory(): Command[] {
    return [...this.commandHistory];
  }
}

class CLIHandler implements CommandHandler {
  async initialize(): Promise<void> {}
  async process(input: string): Promise<void> {
    console.log(`Processing CLI command: ${input}`);
  }
}

class VoiceHandler implements CommandHandler {
  async initialize(): Promise<void> {}
  async process(input: string): Promise<void> {
    console.log(`Processing voice command: ${input}`);
  }
}

class NaturalLanguageHandler implements CommandHandler {
  async initialize(): Promise<void> {}
  async process(input: string): Promise<void> {
    console.log(`Processing natural language: ${input}`);
  }
}

class GestureHandler implements CommandHandler {
  async initialize(): Promise<void> {}
  async process(input: string): Promise<void> {
    console.log(`Processing gesture: ${input}`);
  }
}

class KeyboardHandler implements CommandHandler {
  async initialize(): Promise<void> {}
  async process(input: string): Promise<void> {
    console.log(`Processing keyboard command: ${input}`);
  }
}

export const commandInterface = new CommandInterface();