export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private stream: MediaStream | null = null;
  private audioChunks: Blob[] = [];
  private onDataAvailable: (data: Blob) => void;
  private onRecordingComplete: (audioBlob: Blob) => void;

  constructor(
    onDataAvailable: (data: Blob) => void,
    onRecordingComplete: (audioBlob: Blob) => void
  ) {
    this.onDataAvailable = onDataAvailable;
    this.onRecordingComplete = onRecordingComplete;
  }

  async startRecording(): Promise<void> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 44100,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
          this.onDataAvailable(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        this.onRecordingComplete(audioBlob);
        this.cleanup();
      };

      this.mediaRecorder.start(100); // Collect data every 100ms
    } catch (error) {
      console.error('Error starting recording:', error);
      throw new Error('Failed to access microphone. Please check permissions.');
    }
  }

  stopRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
  }

  private cleanup(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.mediaRecorder = null;
  }

  isRecording(): boolean {
    return this.mediaRecorder?.state === 'recording';
  }
}

export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (data:audio/webm;base64,)
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};