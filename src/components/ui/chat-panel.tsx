import React from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useStore } from '../../store';
import { generateResponse } from '../../lib/gemini';
import ReactMarkdown from 'react-markdown';

export function ChatPanel() {
  const { messages, addMessage, isProcessing, setIsProcessing, currentProjectId } = useStore();
  const [input, setInput] = React.useState('');
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing || !currentProjectId) return;

    const userMessage = {
      role: 'user' as const,
      content: input,
      projectId: currentProjectId,
    };

    addMessage(userMessage);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    setIsProcessing(true);

    try {
      const response = await generateResponse(input);
      addMessage({
        role: 'assistant',
        content: response,
        projectId: currentProjectId,
      });
    } catch (error) {
      addMessage({
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
        projectId: currentProjectId,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const filteredMessages = messages.filter(
    (message) => message.projectId === currentProjectId
  );

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex items-center px-4 py-3 border-b border-border bg-card">
        <MessageSquare className="w-5 h-5 mr-2 text-primary" />
        <h2 className="text-base font-medium text-foreground">Chat</h2>
      </div>

      {!currentProjectId ? (
        <div className="flex-1 flex items-center justify-center text-center p-8">
          <p className="text-muted-foreground">
            Select or create a project to start chatting
          </p>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 scrollbar-custom">
            {filteredMessages.map((message, index) => (
              <div
                key={message.id}
                className={cn(
                  "flex flex-col space-y-1 message-transition",
                  message.role === 'user' ? "items-end" : "items-start",
                  index === filteredMessages.length - 1 ? "message-enter" : ""
                )}
              >
                <div className={cn(
                  "max-w-[85%] rounded-lg px-4 py-2",
                  message.role === 'user'
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                )}>
                  <ReactMarkdown className="text-sm leading-relaxed prose prose-sm max-w-none prose-invert">
                    {message.content}
                  </ReactMarkdown>
                </div>
                <span className="text-xs text-muted-foreground px-1">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-border p-4 bg-card">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    adjustTextareaHeight();
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Message Beryl AI..."
                  disabled={isProcessing}
                  className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:bg-muted min-h-[40px] max-h-[150px] resize-none scrollbar-custom text-foreground placeholder:text-muted-foreground"
                  rows={1}
                />
                <button
                  type="submit"
                  disabled={isProcessing || !input.trim()}
                  className="absolute right-2 bottom-2 inline-flex items-center justify-center p-1.5 text-primary-foreground bg-primary rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:hover:bg-primary"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}