export class AudioPlayer {
  private audioContext: AudioContext | null = null;
  private isPlaying = false;

  constructor() {
    // Initialize on first user interaction
  }

  private async initializeAudioContext(): Promise<void> {
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
      
      // Resume context if suspended
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }
    }
  }

  async playAudioFromBase64(base64Audio: string): Promise<void> {
    try {
      await this.initializeAudioContext();
      
      if (!this.audioContext) {
        throw new Error('Failed to initialize audio context');
      }

      // Convert base64 to ArrayBuffer
      const binaryString = atob(base64Audio);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Decode audio data
      const audioBuffer = await this.audioContext.decodeAudioData(bytes.buffer);

      // Create and configure audio source
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioContext.destination);

      // Track playing state
      this.isPlaying = true;
      source.onended = () => {
        this.isPlaying = false;
      };

      // Start playback
      source.start(0);

      return new Promise((resolve) => {
        source.onended = () => {
          this.isPlaying = false;
          resolve();
        };
      });

    } catch (error) {
      console.error('Error playing audio:', error);
      this.isPlaying = false;
      throw new Error('Failed to play audio');
    }
  }

  isCurrentlyPlaying(): boolean {
    return this.isPlaying;
  }

  async stop(): Promise<void> {
    if (this.audioContext) {
      await this.audioContext.close();
      this.audioContext = null;
      this.isPlaying = false;
    }
  }
}