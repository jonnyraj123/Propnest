/**
 * Generated ocean soundtrack (Web Audio, no files):
 * - waves: filtered noise that swells like surf
 * - pad: slow, warm chord progression
 * - bells: sparse pentatonic notes with reverb
 * Zones change the mix per section; "off" fades everything out.
 */
export type Zone = 'surface' | 'deep' | 'abyss' | 'off'

const CHORDS = [
  [50, 57, 62, 66, 69, 76], // Dmaj9
  [47, 54, 62, 66, 69, 73], // Bm9
  [43, 50, 59, 62, 66, 69], // Gmaj7
  [45, 52, 57, 61, 64, 71], // A6/9
]
const BELL = [74, 76, 78, 81, 83, 86, 88, 90]
const hz = (m: number) => 440 * Math.pow(2, (m - 69) / 12)

class OceanAudio {
  ctx: AudioContext | null = null
  master!: GainNode
  waveGain!: GainNode
  waveFilter!: BiquadFilterNode
  padGain!: GainNode
  padFilter!: BiquadFilterNode
  bellGain!: GainNode
  reverb!: ConvolverNode
  muted = false
  zone: Zone = 'off'
  timers: number[] = []
  padVoices: { osc: OscillatorNode[]; g: GainNode }[] = []

  start() {
    if (this.ctx) { this.ctx.resume(); return }
    const ctx = new AudioContext()
    this.ctx = ctx
    this.master = ctx.createGain(); this.master.gain.value = 0
    const comp = ctx.createDynamicsCompressor()
    this.master.connect(comp).connect(ctx.destination)

    // reverb (generated impulse)
    this.reverb = ctx.createConvolver()
    const len = ctx.sampleRate * 4, ir = ctx.createBuffer(2, len, ctx.sampleRate)
    for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6) }
    this.reverb.buffer = ir
    const wet = ctx.createGain(); wet.gain.value = 0.55
    this.reverb.connect(wet).connect(this.master)

    // waves
    const nb = ctx.createBuffer(1, ctx.sampleRate * 6, ctx.sampleRate)
    const nd = nb.getChannelData(0); let last = 0
    for (let i = 0; i < nd.length; i++) { const w = Math.random() * 2 - 1; last = (last + 0.02 * w) / 1.02; nd[i] = last * 3.5 }
    const noise = ctx.createBufferSource(); noise.buffer = nb; noise.loop = true
    this.waveFilter = ctx.createBiquadFilter(); this.waveFilter.type = 'lowpass'; this.waveFilter.frequency.value = 900
    const swell = ctx.createGain(); swell.gain.value = 0.5
    const lfo = ctx.createOscillator(); lfo.frequency.value = 0.09
    const lfoAmt = ctx.createGain(); lfoAmt.gain.value = 0.45
    lfo.connect(lfoAmt).connect(swell.gain)
    const lfo2 = ctx.createOscillator(); lfo2.frequency.value = 0.09
    const lfo2Amt = ctx.createGain(); lfo2Amt.gain.value = 500
    lfo2.connect(lfo2Amt).connect(this.waveFilter.frequency)
    this.waveGain = ctx.createGain(); this.waveGain.gain.value = 0
    noise.connect(this.waveFilter).connect(swell).connect(this.waveGain).connect(this.master)
    noise.start(); lfo.start(); lfo2.start()

    // pad
    this.padFilter = ctx.createBiquadFilter(); this.padFilter.type = 'lowpass'; this.padFilter.frequency.value = 1400; this.padFilter.Q.value = 0.4
    this.padGain = ctx.createGain(); this.padGain.gain.value = 0
    this.padFilter.connect(this.padGain); this.padGain.connect(this.master); this.padGain.connect(this.reverb)

    // bells
    this.bellGain = ctx.createGain(); this.bellGain.gain.value = 0
    this.bellGain.connect(this.reverb); this.bellGain.connect(this.master)

    let step = 0
    const nextChord = () => { this.playChord(CHORDS[step++ % CHORDS.length]) }
    nextChord()
    this.timers.push(window.setInterval(nextChord, 8000))
    this.timers.push(window.setInterval(() => { if (Math.random() < 0.55) this.bell() }, 1700))
    this.master.gain.setTargetAtTime(this.muted ? 0 : 0.9, ctx.currentTime, 1.2)
    this.setZone(this.zone, true)
  }

  playChord(notes: number[]) {
    const ctx = this.ctx!; const t = ctx.currentTime
    const old = this.padVoices; this.padVoices = []
    old.forEach(v => { v.g.gain.cancelScheduledValues(t); v.g.gain.setTargetAtTime(0, t, 1.6); v.osc.forEach(o => o.stop(t + 7)) })
    for (const n of notes) {
      const g = ctx.createGain(); g.gain.value = 0
      g.gain.setTargetAtTime(0.045, t, 1.8)
      const osc = [-6, 6].map(det => { const o = ctx.createOscillator(); o.type = 'triangle'; o.frequency.value = hz(n); o.detune.value = det; o.connect(g); o.start(t); return o })
      g.connect(this.padFilter)
      this.padVoices.push({ osc, g })
    }
  }

  bell() {
    const ctx = this.ctx!; const t = ctx.currentTime
    const f = hz(BELL[Math.floor(Math.random() * BELL.length)])
    const g = ctx.createGain(); g.gain.value = 0
    g.gain.linearRampToValueAtTime(0.08, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + 3.2)
    const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = f
    const o2 = ctx.createOscillator(); o2.type = 'sine'; o2.frequency.value = f * 2.01
    const g2 = ctx.createGain(); g2.gain.value = 0.25
    o.connect(g); o2.connect(g2).connect(g); g.connect(this.bellGain)
    o.start(t); o2.start(t); o.stop(t + 3.4); o2.stop(t + 3.4)
  }

  setZone(z: Zone, force = false) {
    if (!force && z === this.zone) return
    this.zone = z
    if (!this.ctx) return
    const t = this.ctx.currentTime, k = 0.9
    const mix: Record<Zone, [number, number, number, number, number]> = {
      // waves, waveCut, pad, padCut, bells
      surface: [0.55, 900, 0.9, 1600, 0.7],
      deep: [0.35, 380, 1.0, 900, 0.9],
      abyss: [0.08, 300, 0.8, 700, 0.5],
      off: [0, 300, 0, 600, 0],
    }
    const [w, wc, p, pc, b] = mix[z]
    this.waveGain.gain.setTargetAtTime(w, t, k)
    this.waveFilter.frequency.setTargetAtTime(wc, t, k)
    this.padGain.gain.setTargetAtTime(p, t, k)
    this.padFilter.frequency.setTargetAtTime(pc, t, k)
    this.bellGain.gain.setTargetAtTime(b, t, k)
  }

  setMuted(m: boolean) {
    this.muted = m
    if (this.ctx) this.master.gain.setTargetAtTime(m ? 0 : 0.9, this.ctx.currentTime, 0.4)
  }
}

export const ocean = new OceanAudio()
