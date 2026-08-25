import { AudioLayersConfig } from '../types';

export const DEFAULT_AUDIO_LAYERS: AudioLayersConfig = {
  ambientWind: true,
  neuralStatic: true,
  hostileClicking: true,
  subBassDrone: true,
  interfaceSFX: true,
};

class AudioManagerClass {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private volume: number = 0.5;
  private isSoundscapeRunning: boolean = false;
  private layers: AudioLayersConfig = { ...DEFAULT_AUDIO_LAYERS };

  // Soundscape node references
  // 1. Ambient Wind nodes
  private windGain: GainNode | null = null;
  private windSource: AudioBufferSourceNode | null = null;
  private windFilter: BiquadFilterNode | null = null;
  private windLfo: OscillatorNode | null = null;

  // 2. Neural Static nodes
  private staticGain: GainNode | null = null;
  private staticSource: AudioBufferSourceNode | null = null;
  private staticFilter: BiquadFilterNode | null = null;

  // 3. Sub-Bass Drone nodes
  private droneGain: GainNode | null = null;
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;

  // 4. Hostile Clicking timer
  private clickingTimer: number | null = null;

  public init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = this.volume;
        this.masterGain.connect(this.ctx.destination);
      }
    }
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public getLayers(): AudioLayersConfig {
    return { ...this.layers };
  }

  public setLayers(newLayers: Partial<AudioLayersConfig>) {
    this.layers = { ...this.layers, ...newLayers };
    this.applyLayerGains();
  }

  public toggleLayer(key: keyof AudioLayersConfig): boolean {
    const nextVal = !this.layers[key];
    this.layers[key] = nextVal;
    this.applyLayerGains();
    return nextVal;
  }

  // --- Soundscape Lifecycle & Node Management ---

  public startSoundscape() {
    this.init();
    if (!this.ctx || !this.masterGain) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (this.isSoundscapeRunning) {
      this.applyLayerGains();
      return;
    }

    this.isSoundscapeRunning = true;
    const now = this.ctx.currentTime;

    // 1. Build Ambient Wind (Noise + Bandpass + LFO Sweep)
    try {
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      this.windSource = this.ctx.createBufferSource();
      this.windSource.buffer = noiseBuffer;
      this.windSource.loop = true;

      this.windFilter = this.ctx.createBiquadFilter();
      this.windFilter.type = 'bandpass';
      this.windFilter.frequency.setValueAtTime(240, now);
      this.windFilter.Q.setValueAtTime(2.5, now);

      this.windLfo = this.ctx.createOscillator();
      this.windLfo.type = 'sine';
      this.windLfo.frequency.setValueAtTime(0.12, now); // slow breathing sweep

      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(90, now);

      this.windLfo.connect(lfoGain);
      lfoGain.connect(this.windFilter.frequency);

      this.windGain = this.ctx.createGain();
      this.windGain.gain.setValueAtTime(this.layers.ambientWind ? 0.09 : 0.0001, now);

      this.windSource.connect(this.windFilter);
      this.windFilter.connect(this.windGain);
      this.windGain.connect(this.masterGain);

      this.windSource.start(now);
      this.windLfo.start(now);
    } catch {
      // ignore
    }

    // 2. Build Neural Static (High-frequency tuned cosmic hiss)
    try {
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      this.staticSource = this.ctx.createBufferSource();
      this.staticSource.buffer = noiseBuffer;
      this.staticSource.loop = true;

      this.staticFilter = this.ctx.createBiquadFilter();
      this.staticFilter.type = 'highpass';
      this.staticFilter.frequency.setValueAtTime(3600, now);

      this.staticGain = this.ctx.createGain();
      this.staticGain.gain.setValueAtTime(this.layers.neuralStatic ? 0.03 : 0.0001, now);

      this.staticSource.connect(this.staticFilter);
      this.staticFilter.connect(this.staticGain);
      this.staticGain.connect(this.masterGain);

      this.staticSource.start(now);
    } catch {
      // ignore
    }

    // 3. Build Sub-Bass Drone (Twin low sine oscillators for deep seismic beating)
    try {
      this.droneOsc1 = this.ctx.createOscillator();
      this.droneOsc2 = this.ctx.createOscillator();

      this.droneOsc1.type = 'sine';
      this.droneOsc1.frequency.setValueAtTime(42, now);

      this.droneOsc2.type = 'sine';
      this.droneOsc2.frequency.setValueAtTime(43.2, now); // ~1.2Hz acoustic beat

      const droneFilter = this.ctx.createBiquadFilter();
      droneFilter.type = 'lowpass';
      droneFilter.frequency.setValueAtTime(80, now);

      this.droneGain = this.ctx.createGain();
      this.droneGain.gain.setValueAtTime(this.layers.subBassDrone ? 0.12 : 0.0001, now);

      this.droneOsc1.connect(droneFilter);
      this.droneOsc2.connect(droneFilter);
      droneFilter.connect(this.droneGain);
      this.droneGain.connect(this.masterGain);

      this.droneOsc1.start(now);
      this.droneOsc2.start(now);
    } catch {
      // ignore
    }

    // 4. Hostile Clicking Loop (periodic organic bio-acoustic echolocation taps)
    this.scheduleNextClicks();
  }

  private scheduleNextClicks() {
    if (this.clickingTimer) {
      window.clearTimeout(this.clickingTimer);
      this.clickingTimer = null;
    }

    const nextDelay = Math.random() * 3200 + 2000; // between 2s and 5.2s
    this.clickingTimer = window.setTimeout(() => {
      if (this.isSoundscapeRunning && this.layers.hostileClicking) {
        this.triggerHostileClickBurst();
      }
      if (this.isSoundscapeRunning) {
        this.scheduleNextClicks();
      }
    }, nextDelay);
  }

  private triggerHostileClickBurst() {
    if (!this.ctx || !this.masterGain || !this.layers.hostileClicking) return;
    if (this.ctx.state === 'suspended') return;

    const count = Math.floor(Math.random() * 4) + 2; // 2 to 5 clicks
    const now = this.ctx.currentTime;
    const baseFreq = Math.random() > 0.5 ? 2400 : 1600;

    for (let i = 0; i < count; i++) {
      const clickTime = now + i * (Math.random() * 0.04 + 0.03);
      const osc = this.ctx.createOscillator();
      const clickGain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(baseFreq + Math.random() * 400, clickTime);
      osc.frequency.exponentialRampToValueAtTime(300, clickTime + 0.015);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(baseFreq, clickTime);
      filter.Q.setValueAtTime(8, clickTime);

      clickGain.gain.setValueAtTime(0.04 * this.volume, clickTime);
      clickGain.gain.exponentialRampToValueAtTime(0.0001, clickTime + 0.015);

      osc.connect(filter);
      filter.connect(clickGain);
      clickGain.connect(this.masterGain);

      osc.start(clickTime);
      osc.stop(clickTime + 0.02);
    }
  }

  public stopSoundscape() {
    this.isSoundscapeRunning = false;
    if (this.clickingTimer) {
      window.clearTimeout(this.clickingTimer);
      this.clickingTimer = null;
    }

    try {
      if (this.windSource) {
        this.windSource.stop();
        this.windSource.disconnect();
        this.windSource = null;
      }
      if (this.windLfo) {
        this.windLfo.stop();
        this.windLfo.disconnect();
        this.windLfo = null;
      }
      if (this.staticSource) {
        this.staticSource.stop();
        this.staticSource.disconnect();
        this.staticSource = null;
      }
      if (this.droneOsc1) {
        this.droneOsc1.stop();
        this.droneOsc1.disconnect();
        this.droneOsc1 = null;
      }
      if (this.droneOsc2) {
        this.droneOsc2.stop();
        this.droneOsc2.disconnect();
        this.droneOsc2 = null;
      }
    } catch {
      // ignore
    }
  }

  private applyLayerGains() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    if (this.windGain) {
      const target = this.layers.ambientWind ? 0.09 : 0.0001;
      this.windGain.gain.setTargetAtTime(target, now, 0.2);
    }

    if (this.staticGain) {
      const target = this.layers.neuralStatic ? 0.03 : 0.0001;
      this.staticGain.gain.setTargetAtTime(target, now, 0.2);
    }

    if (this.droneGain) {
      const target = this.layers.subBassDrone ? 0.12 : 0.0001;
      this.droneGain.gain.setTargetAtTime(target, now, 0.2);
    }
  }

  // --- Preview / Test Function for Settings Menu ---

  public previewLayer(layer: keyof AudioLayersConfig) {
    this.init();
    if (!this.ctx || !this.masterGain) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const now = this.ctx.currentTime;

    if (layer === 'ambientWind') {
      const bufferSize = this.ctx.sampleRate;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) output[i] = Math.random() * 2 - 1;

      const src = this.ctx.createBufferSource();
      src.buffer = noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(240, now);
      filter.frequency.exponentialRampToValueAtTime(420, now + 0.5);
      filter.frequency.exponentialRampToValueAtTime(180, now + 1.2);
      filter.Q.setValueAtTime(3, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.18 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      src.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      src.start(now);
      src.stop(now + 1.2);
    } else if (layer === 'neuralStatic') {
      const bufferSize = this.ctx.sampleRate;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) output[i] = Math.random() * 2 - 1;

      const src = this.ctx.createBufferSource();
      src.buffer = noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(3200, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.08 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

      src.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      src.start(now);
      src.stop(now + 0.8);
    } else if (layer === 'hostileClicking') {
      this.triggerHostileClickBurst();
    } else if (layer === 'subBassDrone') {
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(44, now);
      osc2.frequency.setValueAtTime(46, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.25 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.masterGain);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 1.2);
      osc2.stop(now + 1.2);
    } else if (layer === 'interfaceSFX') {
      this.playAlert();
    }
  }

  // --- Tactical Interactive Sound FX ---

  public playClick() {
    if (!this.layers.interfaceSFX) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(440, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(110, this.ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.12 * this.volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  public playAlert() {
    if (!this.layers.interfaceSFX) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(150, this.ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.2 * this.volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  public playHazard() {
    if (!this.layers.interfaceSFX) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(80, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.25);

    gain.gain.setValueAtTime(0.3 * this.volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.25);
  }

  public playDeath() {
    if (!this.layers.interfaceSFX) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const now = this.ctx.currentTime;
    [120, 80, 50, 30].forEach((freq, i) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + i * 0.12);
      osc.frequency.exponentialRampToValueAtTime(Math.max(10, freq / 2), now + i * 0.12 + 0.2);

      gain.gain.setValueAtTime(0.25 * this.volume, now + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.2);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now + i * 0.12);
      osc.stop(now + i * 0.12 + 0.2);
    });
  }

  public playAmbient() {
    // Starts the continuous soundscape if not already running
    this.startSoundscape();
  }

  public playPurge() {
    if (!this.layers.interfaceSFX) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const now = this.ctx.currentTime;
    // Harmonic soft sine cleanse tone (520Hz sliding smoothly down to 340Hz)
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.35);

    gain.gain.setValueAtTime(0.09 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.35);
  }

  public playSuccess() {
    if (!this.layers.interfaceSFX) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const now = this.ctx.currentTime;
    [330, 440, 660].forEach((freq, i) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.06);

      gain.gain.setValueAtTime(0.15 * this.volume, now + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.1);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now + i * 0.06);
      osc.stop(now + i * 0.06 + 0.1);
    });
  }
}

export const AudioManager = new AudioManagerClass();
