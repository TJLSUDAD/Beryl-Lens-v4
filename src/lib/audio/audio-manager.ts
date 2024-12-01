import { v4 as uuidv4 } from 'uuid';

export interface AudioConfig {
  rate: number;
  volume: number;
  pitch: number;
}

export interface VoiceProfile {
  id: string;
  name: string;
  config: AudioConfig;
}

class AudioManager {
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private voiceProfiles: Map<string, VoiceProfile> = new Map();

  constructor() {
    this.initializeVoiceProfiles();
  }

  private initializeVoiceProfiles() {
    const defaultProfiles: VoiceProfile[] = [
      {
        id: 'default',
        name: 'Default',
        config: { rate: 175, volume: 0.9, pitch: 1.0 }
      },
      {
        id: 'announcement',
        name: 'Announcement',
        config: { rate: 150, volume: 1.0, pitch: 1.0 }
      },
      {
        id: 'error',
        name: 'Error',
        config: { rate: 160, volume: 1.0, pitch: 0.9 }
      }
    ];

    defaultProfiles.forEach(profile => {
      this.voiceProfiles.set(profile.id, profile);
    });
  }

  async initialize(): Promise<void> {
    try {
      this.audioContext = new AudioContext();
      await this.audioContext.resume();
      return this.detectAudioDevices();
    } catch (error) {
      console.error('Failed to initialize audio system:', error);
      throw error;
    }
  }

  async detectAudioDevices(): Promise<void> {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioDevices = devices.filter(device => device.kind === 'audioinput');
      
      if (audioDevices.length === 0) {
        throw new Error('No audio input devices found');
      }
    } catch (error) {
      console.error('Failed to detect audio devices:', error);
      throw error;
    }
  }

  async startRecording(): Promise<void> {
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(this.mediaStream);
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        this.audioChunks.push(event.data);
      };

      this.mediaRecorder.start();
    } catch (error) {
      console.error('Failed to start recording:', error);
      throw error;
    }
  }

  async stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('No active recording'));
        return;
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        this.cleanup();
        resolve(audioBlob);
      };

      this.mediaRecorder.stop();
    });
  }

  private cleanup(): void {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
    this.mediaRecorder = null;
    this.audioChunks = [];
  }

  async playAudio(blob: Blob): Promise<void> {
    if (!this.audioContext) {
      throw new Error('Audio context not initialized');
    }

    try {
      const arrayBuffer = await blob.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioContext.destination);
      source.start();
    } catch (error) {
      console.error('Failed to play audio:', error);
      throw error;
    }
  }

  getVoiceProfile(profileId: string): VoiceProfile | undefined {
    return this.voiceProfiles.get(profileId);
  }

  setVoiceProfile(profile: VoiceProfile): void {
    this.voiceProfiles.set(profile.id, profile);
  }
}

export const audioManager = new AudioManager();