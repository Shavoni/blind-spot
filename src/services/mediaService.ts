class MediaService {
  private stream: MediaStream | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private isRecording = false;
  private recordedChunks: Blob[] = [];

  async initializeCamera(): Promise<boolean> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true
      });
      
      console.log('📹 Camera and microphone access granted');
      return true;
    } catch (error) {
      console.error('❌ Camera/microphone access denied:', error);
      return false;
    }
  }

  async startRecording(): Promise<boolean> {
    if (!this.stream) {
      console.error('❌ No media stream available');
      return false;
    }

    try {
      this.recordedChunks = [];
      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: 'video/webm;codecs=vp9'
      });

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };

      this.mediaRecorder.start(100); // Collect data every 100ms
      this.isRecording = true;
      
      console.log('🔴 Recording started');
      return true;
    } catch (error) {
      console.error('❌ Failed to start recording:', error);
      return false;
    }
  }

  async stopRecording(): Promise<Blob | null> {
    if (!this.mediaRecorder || !this.isRecording) {
      return null;
    }

    return new Promise((resolve) => {
      this.mediaRecorder!.onstop = () => {
        const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
        this.isRecording = false;
        console.log('⏹️ Recording stopped, blob size:', blob.size);
        resolve(blob);
      };

      this.mediaRecorder!.stop();
    });
  }

  async captureFrame(): Promise<string | null> {
    if (!this.stream) return null;

    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return null;

    video.srcObject = this.stream;
    video.muted = true;

    return new Promise((resolve) => {
      video.onloadedmetadata = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);
        
        const dataURL = canvas.toDataURL('image/jpeg', 0.8);
        video.remove();
        resolve(dataURL);
      };
      
      video.onerror = () => {
        video.remove();
        resolve(null);
      };
      
      video.play().catch(() => {
        video.remove();
        resolve(null);
      });
    });
  }

  async processUploadedFile(file: File): Promise<{ type: string; data: any; preview?: string }> {
    const fileType = file.type.split('/')[0];
    
    if (fileType === 'image') {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({
            type: 'image',
            data: e.target?.result as string,
            preview: e.target?.result as string
          });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    } else if (fileType === 'video') {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const blob = new Blob([arrayBuffer], { type: file.type });
          const url = URL.createObjectURL(blob);
          
          resolve({
            type: 'video',
            data: blob,
            preview: url
          });
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
      });
    } else if (fileType === 'audio') {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const blob = new Blob([arrayBuffer], { type: file.type });
          
          resolve({
            type: 'audio',
            data: blob
          });
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
      });
    }

    throw new Error('Unsupported file type');
  }

  getStream(): MediaStream | null {
    return this.stream;
  }

  get recording(): boolean {
    return this.isRecording;
  }

  cleanup(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
    }
    
    this.mediaRecorder = null;
    this.isRecording = false;
    this.recordedChunks = [];
  }
}

export const mediaService = new MediaService();