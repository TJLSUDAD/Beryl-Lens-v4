import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, StopCircle, Camera } from 'lucide-react';
import { Button } from '../ui/button';
import { useStore } from '../../store';
import { useAudio } from '../../hooks/use-audio';
import { ChatMessage } from './chat-message';

export function ChatInterface() {
  const [message, setMessage] = useState('');
  const { messages, addMessage } = useStore();
  const { isRecording, error, startRecording, stopRecording } = useAudio();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim()) return;

    addMessage({
      role: 'user',
      content: message
    });

    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleRecording = async () => {
    if (isRecording) {
      const audioBlob = await stopRecording();
      if (audioBlob) {
        // Handle the recorded audio
        // You can send it to your AI service or process it locally
      }
    } else {
      await startRecording();
    }
  };

  const handleScreenshot = () => {
    // Implement screenshot functionality
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px] bg-secondary/30 rounded-lg">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-muted-foreground">
              Type a message or use voice commands to start
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="mt-4 flex gap-2 items-center">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask the AI assistant..."
            className="input-dark pr-24 py-3"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className={`h-10 w-10 ${
                isRecording ? 'text-destructive hover:text-destructive/90' : 'text-muted-foreground'
              }`}
              onClick={handleRecording}
              title={isRecording ? 'Stop Recording' : 'Start Recording'}
            >
              {isRecording ? (
                <StopCircle className="w-6 h-6" />
              ) : (
                <Mic className="w-6 h-6" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-muted-foreground"
              onClick={handleScreenshot}
              title="Take Screenshot"
            >
              <Camera className="w-6 h-6" />
            </Button>
          </div>
        </div>
        <Button
          variant="primary"
          size="icon"
          className="h-[42px] w-[42px]"
          disabled={!message.trim()}
          onClick={handleSend}
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>

      {error && (
        <div className="mt-2 text-xs text-destructive">
          {error}
        </div>
      )}
    </div>
  );
}