/**
 * Procedural WebAudio sound engine — zero external assets (project rule).
 * Every effect is synthesized from oscillators and filtered noise bursts.
 * The AudioContext is created lazily on the first user gesture and every
 * call is failure-tolerant so headless/CI runs never crash.
 */

export class SoundEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private noise: AudioBuffer | null = null;
  private ambientTimer = 0;
  private stepAccum = 0;
  volume = 0.8;

  /** Create the context (must be called from within a user gesture). */
  unlock(): void {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') void this.ctx.resume().catch(() => undefined);
      return;
    }
    try {
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.volume;
      this.master.connect(this.ctx.destination);
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.value = 0.14;
      this.ambientGain.connect(this.master);
      // 1s of white noise, reused by all burst effects.
      const len = this.ctx.sampleRate;
      this.noise = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const ch = this.noise.getChannelData(0);
      for (let i = 0; i < len; i++) ch[i] = Math.random() * 2 - 1;
    } catch {
      this.ctx = null;
    }
  }

  setVolume(v: number): void {
    this.volume = v;
    if (this.master) this.master.gain.value = v;
  }

  /** Short filtered-noise burst — the workhorse for steps/digs/splashes. */
  private burst(dur: number, freq: number, gain: number, q = 1, type: BiquadFilterType = 'bandpass'): void {
    if (!this.ctx || !this.master || !this.noise) return;
    try {
      const src = this.ctx.createBufferSource();
      src.buffer = this.noise;
      const filter = this.ctx.createBiquadFilter();
      filter.type = type;
      filter.frequency.value = freq;
      filter.Q.value = q;
      const g = this.ctx.createGain();
      const t = this.ctx.currentTime;
      g.gain.setValueAtTime(gain, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      src.connect(filter).connect(g).connect(this.master);
      src.start(t, Math.random() * 0.5, dur + 0.05);
      src.stop(t + dur + 0.06);
    } catch {
      // never let audio kill the frame
    }
  }

  /** Pitched blip (UI, eat, hurt...). */
  private tone(freq: number, dur: number, gain: number, type: OscillatorType = 'square', slide = 0): void {
    if (!this.ctx || !this.master) return;
    try {
      const osc = this.ctx.createOscillator();
      osc.type = type;
      const t = this.ctx.currentTime;
      osc.frequency.setValueAtTime(freq, t);
      if (slide !== 0) osc.frequency.exponentialRampToValueAtTime(Math.max(20, freq + slide), t + dur);
      const g = this.ctx.createGain();
      g.gain.setValueAtTime(gain, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      osc.connect(g).connect(this.master);
      osc.start(t);
      osc.stop(t + dur + 0.02);
    } catch {
      // ignore
    }
  }

  // --- Game events -----------------------------------------------------------
  step(inWater: boolean, hardGround: boolean): void {
    if (inWater) this.burst(0.14, 900, 0.1, 0.8);
    else if (hardGround) this.burst(0.07, 1600, 0.12, 1.2);
    else this.burst(0.09, 500, 0.14, 0.8);
  }

  dig(hard: boolean): void {
    this.burst(0.08, hard ? 1200 : 700, 0.16, 1.5);
  }

  breakBlock(): void {
    this.burst(0.16, 900, 0.3, 0.9);
    this.tone(180, 0.12, 0.12, 'triangle', -80);
  }

  place(): void {
    this.burst(0.07, 1100, 0.2, 1.4);
    this.tone(240, 0.07, 0.1, 'triangle', -60);
  }

  hurt(): void {
    this.tone(340, 0.16, 0.22, 'sawtooth', -160);
  }

  eat(): void {
    this.burst(0.08, 500, 0.16, 0.7);
    this.tone(500, 0.06, 0.06, 'triangle', 120);
  }

  explosion(): void {
    this.burst(0.7, 120, 0.55, 0.4, 'lowpass');
    this.burst(0.3, 900, 0.2, 0.6);
  }

  bow(): void {
    this.tone(700, 0.12, 0.1, 'triangle', 500);
  }

  splash(): void {
    this.burst(0.3, 750, 0.24, 0.7);
  }

  click(): void {
    this.tone(900, 0.04, 0.08, 'square', -200);
  }

  levelup(): void {
    this.tone(520, 0.1, 0.12, 'triangle');
    setTimeout(() => this.tone(660, 0.1, 0.12, 'triangle'), 90);
    setTimeout(() => this.tone(880, 0.16, 0.12, 'triangle'), 180);
  }

  sleep(): void {
    this.tone(420, 0.5, 0.1, 'sine', -180);
  }

  /**
   * Ambient bed: sparse bird chirps by day, cricket pulses by night.
   * Call once per frame; internally throttled.
   */
  update(dt: number, isDay: boolean, moving: boolean, onGround: boolean, inWater: boolean, hardGround: boolean): void {
    if (!this.ctx) return;
    // Footsteps from movement (approx. cadence).
    if (moving && onGround) {
      this.stepAccum += dt;
      if (this.stepAccum > 0.34) {
        this.stepAccum = 0;
        this.step(inWater, hardGround);
      }
    } else {
      this.stepAccum = 0.3; // next step lands quickly after moving again
    }
    // Sparse ambient chirps/crickets.
    this.ambientTimer -= dt;
    if (this.ambientTimer <= 0) {
      this.ambientTimer = 2.5 + Math.random() * 6;
      if (!this.ambientGain) return;
      if (isDay) {
        const base = 1800 + Math.random() * 1400;
        this.ambientChirp(base);
      } else {
        this.ambientCricket();
      }
    }
  }

  private ambientChirp(freq: number): void {
    if (!this.ctx || !this.ambientGain) return;
    try {
      const t = this.ctx.currentTime;
      for (let i = 0; i < 2 + Math.floor(Math.random() * 3); i++) {
        const osc = this.ctx.createOscillator();
        osc.type = 'sine';
        const start = t + i * 0.12;
        osc.frequency.setValueAtTime(freq, start);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.4, start + 0.05);
        const g = this.ctx.createGain();
        g.gain.setValueAtTime(0, start);
        g.gain.linearRampToValueAtTime(0.5, start + 0.02);
        g.gain.exponentialRampToValueAtTime(0.001, start + 0.09);
        osc.connect(g).connect(this.ambientGain);
        osc.start(start);
        osc.stop(start + 0.1);
      }
    } catch {
      // ignore
    }
  }

  private ambientCricket(): void {
    if (!this.ctx || !this.ambientGain) return;
    try {
      const t = this.ctx.currentTime;
      for (let i = 0; i < 6; i++) {
        const osc = this.ctx.createOscillator();
        osc.type = 'triangle';
        const start = t + i * 0.07;
        osc.frequency.setValueAtTime(4200, start);
        const g = this.ctx.createGain();
        g.gain.setValueAtTime(0, start);
        g.gain.linearRampToValueAtTime(0.35, start + 0.01);
        g.gain.exponentialRampToValueAtTime(0.001, start + 0.05);
        osc.connect(g).connect(this.ambientGain);
        osc.start(start);
        osc.stop(start + 0.06);
      }
    } catch {
      // ignore
    }
  }

  dispose(): void {
    try {
      void this.ctx?.close();
    } catch {
      // ignore
    }
    this.ctx = null;
  }
}
