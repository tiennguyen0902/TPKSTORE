/**
 * Reusable Speech-to-Text Service Abstraction
 * Supports multiple interchangeable providers:
 * 1. WebSpeechSTTProvider (Native Browser Web Speech API for zero-latency real-time vi-VN transcription)
 * 2. BackendGeminiSTTProvider (MediaRecorder audio blob -> Backend Google Gemini Multimodal Audio transcription)
 * 3. HybridSTTService (Auto-detects and coordinates the best provider)
 */

export type MicState =
  | "IDLE"
  | "REQUEST_MICROPHONE_PERMISSION"
  | "LISTENING"
  | "PROCESSING_AUDIO"
  | "TRANSCRIBING"
  | "TRANSCRIPT_READY";

export interface SpeechToTextService {
  startListening(
    onResult: (transcript: string, isFinal: boolean) => void,
    onError: (errorMessage: string) => void,
    onStateChange?: (state: MicState) => void
  ): Promise<void>;
  stopListening(): Promise<string>;
  transcribe(audio: Blob | File): Promise<string>;
  isSupported(): boolean;
  getProviderName(): string;
}

/**
 * Provider 1: Native Web Speech API (Client-side, zero latency, Vietnamese vi-VN)
 */
export class WebSpeechSTTProvider implements SpeechToTextService {
  private recognition: any = null;
  private currentTranscript = "";
  private isRunning = false;
  private onStateChangeCallback?: (state: MicState) => void;

  constructor() {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition ||
      (window as any).mozSpeechRecognition ||
      (window as any).msSpeechRecognition;

    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.lang = "vi-VN";
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 1;
    }
  }

  public isSupported(): boolean {
    return !!this.recognition;
  }

  public getProviderName(): string {
    return "Browser Web Speech API (vi-VN)";
  }

  public async startListening(
    onResult: (transcript: string, isFinal: boolean) => void,
    onError: (errorMessage: string) => void,
    onStateChange?: (state: MicState) => void
  ): Promise<void> {
    if (!this.recognition) {
      onError("Trình duyệt của bạn chưa hỗ trợ Web Speech API.");
      return;
    }

    this.onStateChangeCallback = onStateChange;
    this.currentTranscript = "";
    this.isRunning = true;

    this.onStateChangeCallback?.("REQUEST_MICROPHONE_PERMISSION");

    this.recognition.onstart = () => {
      this.onStateChangeCallback?.("LISTENING");
    };

    this.recognition.onresult = (event: any) => {
      let interim = "";
      let final = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const item = event.results[i];
        if (item.isFinal) {
          final += item[0].transcript;
        } else {
          interim += item[0].transcript;
        }
      }

      const text = (final || interim).trim();
      if (text) {
        this.currentTranscript = text;
        onResult(text, Boolean(final));
      }
    };

    this.recognition.onerror = (event: any) => {
      this.isRunning = false;
      this.onStateChangeCallback?.("IDLE");

      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        onError("Quyền truy cập micro đã bị từ chối. Vui lòng cho phép quyền micro trên trình duyệt để nói.");
      } else if (event.error === "no-speech") {
        onError("Không nghe thấy âm thanh. Vui lòng thử nói lại.");
      } else if (event.error === "audio-capture") {
        onError("Không tìm thấy thiết bị thu âm (micro). Vui lòng cắm micro.");
      } else {
        onError(`Lỗi nhận diện giọng nói: ${event.error || "Không xác định"}`);
      }
    };

    this.recognition.onend = () => {
      if (this.isRunning) {
        this.isRunning = false;
        if (this.currentTranscript) {
          this.onStateChangeCallback?.("TRANSCRIPT_READY");
        } else {
          this.onStateChangeCallback?.("IDLE");
        }
      }
    };

    try {
      this.recognition.start();
    } catch (e: any) {
      this.isRunning = false;
      this.onStateChangeCallback?.("IDLE");
      onError("Không thể khởi động micro: " + (e.message || e));
    }
  }

  public async stopListening(): Promise<string> {
    if (this.recognition && this.isRunning) {
      this.onStateChangeCallback?.("PROCESSING_AUDIO");
      this.recognition.stop();
      this.isRunning = false;
    }
    return this.currentTranscript;
  }

  public async transcribe(_audio: Blob | File): Promise<string> {
    throw new Error("WebSpeechSTTProvider captures real-time microphone audio. Use BackendGeminiSTTProvider for Blob transcription.");
  }
}

/**
 * Provider 2: Server-Side Gemini Multimodal STT (MediaRecorder -> Backend)
 */
export class BackendGeminiSTTProvider implements SpeechToTextService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;
  private onStateChangeCallback?: (state: MicState) => void;
  private transcribeApiFn: (audioBlob: Blob) => Promise<{ transcript: string }>;

  constructor(transcribeApiFn: (audioBlob: Blob) => Promise<{ transcript: string }>) {
    this.transcribeApiFn = transcribeApiFn;
  }

  public isSupported(): boolean {
    return typeof navigator !== "undefined" && !!navigator.mediaDevices && !!navigator.mediaDevices.getUserMedia;
  }

  public getProviderName(): string {
    return "Server Gemini STT (Google AI Multimodal)";
  }

  public async startListening(
    _onResult: (transcript: string, isFinal: boolean) => void,
    onError: (errorMessage: string) => void,
    onStateChange?: (state: MicState) => void
  ): Promise<void> {
    if (!this.isSupported()) {
      onError("Trình duyệt không hỗ trợ MediaDevices ghi âm.");
      return;
    }

    this.onStateChangeCallback = onStateChange;
    this.audioChunks = [];

    try {
      this.onStateChangeCallback?.("REQUEST_MICROPHONE_PERMISSION");
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "audio/mp4";

      this.mediaRecorder = new MediaRecorder(this.stream, { mimeType });

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.start(250);
      this.onStateChangeCallback?.("LISTENING");
    } catch (err: any) {
      this.onStateChangeCallback?.("IDLE");
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        onError("Quyền truy cập micro đã bị từ chối trên trình duyệt.");
      } else {
        onError("Lỗi khi kích hoạt micro: " + (err.message || err));
      }
    }
  }

  public async stopListening(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder || this.mediaRecorder.state === "inactive") {
        this.onStateChangeCallback?.("IDLE");
        resolve("");
        return;
      }

      this.onStateChangeCallback?.("PROCESSING_AUDIO");

      this.mediaRecorder.onstop = async () => {
        try {
          this.onStateChangeCallback?.("TRANSCRIBING");
          const mimeType = this.mediaRecorder?.mimeType || "audio/webm";
          const audioBlob = new Blob(this.audioChunks, { type: mimeType });

          // Cleanup stream tracks
          if (this.stream) {
            this.stream.getTracks().forEach((track) => track.stop());
            this.stream = null;
          }

          if (audioBlob.size === 0) {
            this.onStateChangeCallback?.("IDLE");
            resolve("");
            return;
          }

          const res = await this.transcribeApiFn(audioBlob);
          const transcript = res?.transcript?.trim() || "";
          this.onStateChangeCallback?.("TRANSCRIPT_READY");
          resolve(transcript);
        } catch (err: any) {
          this.onStateChangeCallback?.("IDLE");
          reject(err);
        }
      };

      this.mediaRecorder.stop();
    });
  }

  public async transcribe(audio: Blob | File): Promise<string> {
    const res = await this.transcribeApiFn(audio);
    return res?.transcript || "";
  }
}

/**
 * Hybrid STT Coordinator:
 * Prefers WebSpeech for instant real-time typing feedback,
 * seamlessly falls back to Backend Gemini STT if WebSpeech is unsupported or restricted.
 */
export class HybridSTTService implements SpeechToTextService {
  private webSpeechProvider: WebSpeechSTTProvider;
  private backendProvider: BackendGeminiSTTProvider;
  private activeProvider: SpeechToTextService;

  constructor(transcribeApiFn: (audioBlob: Blob) => Promise<{ transcript: string }>) {
    this.webSpeechProvider = new WebSpeechSTTProvider();
    this.backendProvider = new BackendGeminiSTTProvider(transcribeApiFn);

    // Prefer native WebSpeech API if available in browser
    if (this.webSpeechProvider.isSupported()) {
      this.activeProvider = this.webSpeechProvider;
    } else {
      this.activeProvider = this.backendProvider;
    }
  }

  public isSupported(): boolean {
    return this.webSpeechProvider.isSupported() || this.backendProvider.isSupported();
  }

  public getProviderName(): string {
    return this.activeProvider.getProviderName();
  }

  public async startListening(
    onResult: (transcript: string, isFinal: boolean) => void,
    onError: (errorMessage: string) => void,
    onStateChange?: (state: MicState) => void
  ): Promise<void> {
    if (this.webSpeechProvider.isSupported()) {
      return this.webSpeechProvider.startListening(
        onResult,
        (webSpeechErr) => {
          // If native web speech fails due to network or service error, try falling back to MediaRecorder
          if (this.backendProvider.isSupported()) {
            this.activeProvider = this.backendProvider;
            this.backendProvider.startListening(onResult, onError, onStateChange);
          } else {
            onError(webSpeechErr);
          }
        },
        onStateChange
      );
    } else if (this.backendProvider.isSupported()) {
      this.activeProvider = this.backendProvider;
      return this.backendProvider.startListening(onResult, onError, onStateChange);
    } else {
      onError("Trình duyệt hiện tại không hỗ trợ thu âm giọng nói.");
    }
  }

  public async stopListening(): Promise<string> {
    return this.activeProvider.stopListening();
  }

  public async transcribe(audio: Blob | File): Promise<string> {
    return this.backendProvider.transcribe(audio);
  }
}
