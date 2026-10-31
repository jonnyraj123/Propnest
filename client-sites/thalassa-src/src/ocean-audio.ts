/**
 * Generated ocean soundscape (Web Audio, no files).
 * surface: rolling surf + foam hiss, soft pad
 * deep:    low underwater rumble, muffled current, rising bubbles
 * abyss:   very low drone, faint bubbles
 * Browsers only allow sound after the visitor's first click/tap/key, so start() is
 * called from that first gesture.
 */
export type Zone = 'surface' | 'deep' | 'abyss' | 'off'

const PAD = [
  [50, 57, 62, 66, 69], // Dmaj7
  [47, 54, 62, 66, 69], // Bm9
  [43, 50, 59, 62, 66], // Gmaj7
  [45, 52, 57, 61, 64], // A
]
const hz = (m: number) => 440 * Math.pow(2, (m - 69) / 12)

function noiseBuffer(ctx: AudioContext, kind: 'pink' | 'brown', seconds = 8) {
  const b = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate)
  const d = b.getChannelData(0)
  let b0 = 0, b1 = 0, b2 = 0, last = 0
  for (let i = 0; i < d.length; i++) {
    const w = Math.random() * 2 - 1
    if (kind === 'pink') {
      b0 = 0.99765 * b0 + w * 0.099; b1 = 0.963 * b1 + w * 0.2965; b2 = 0.57 * b2 + w * 1.0526
      d[i] = (b0 + b1 + b2 + w * 0.1848) * 0.11
    } else { last = (last + 0.02 * w) / 1.02; d[i] = last * 3.5 }
  }
  return b
}

class OceanAudio {
  ctx: AudioContext | null = null
  master!: GainNode
  surf!: GainNode
  foam!: GainNode
  deep!: GainNode
  pad!: GainNode
  bubbles!: GainNode
  reverb!: ConvolverNode
  muted = false
  zone: Zone = 'surface'
  voices: { o: OscillatorNode[]; g: GainNode }[] = []
  started = false

  start() {
    if (this.started) { this.ctx?.resume(); return }
    this.started = true
    const ctx = new AudioContext(); this.ctx = ctx
    this.master = ctx.createGain(); this.master.gain.value = 0
    const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -18
    this.master.connect(comp).connect(ctx.destination)

    this.reverb = ctx.createConvolver()
    const len = ctx.sampleRate * 3.5, ir = ctx.createBuffer(2, len, ctx.sampleRate)
    for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.4) }
    this.reverb.buffer = ir
    const wet = ctx.createGain(); wet.gain.value = 0.45; this.reverb.connect(wet).connect(this.master)

    const lfo = (f: number, amt: number, target: AudioParam, phase = 0) => {
      const o = ctx.createOscillator(); o.frequency.value = f
      const g = ctx.createGain(); g.gain.value = amt
      o.connect(g).connect(target); o.start(ctx.currentTime + phase)
    }

    // surf: pink noise, lowpass swelling with the wave rhythm
    const pink = ctx.createBufferSource(); pink.buffer = noiseBuffer(ctx, 'pink'); pink.loop = true
    const surfLP = ctx.createBiquadFilter(); surfLP.type = 'lowpass'; surfLP.frequency.value = 700; surfLP.Q.value = 0.3
    const surfSwell = ctx.createGain(); surfSwell.gain.value = 0.55
    lfo(0.1, 0.45, surfSwell.gain); lfo(0.1, 550, surfLP.frequency)
    this.surf = ctx.createGain(); this.surf.gain.value = 0
    pink.connect(surfLP).connect(surfSwell).connect(this.surf).connect(this.master)

    // foam: bright hiss riding just after each swell
    const foamBP = ctx.createBiquadFilter(); foamBP.type = 'bandpass'; foamBP.frequency.value = 3200; foamBP.Q.value = 0.6
    const foamSwell = ctx.createGain(); foamSwell.gain.value = 0.25
    lfo(0.1, 0.25, foamSwell.gain, 1.6)
    this.foam = ctx.createGain(); this.foam.gain.value = 0
    pink.connect(foamBP).connect(foamSwell).connect(this.foam).connect(this.master)
    pink.start()

    // deep: brown noise rumble, heavily muffled
    const brown = ctx.createBufferSource(); brown.buffer = noiseBuffer(ctx, 'brown'); brown.loop = true
    const deepLP = ctx.createBiquadFilter(); deepLP.type = 'lowpass'; deepLP.frequency.value = 220
    const deepSwell = ctx.createGain(); deepSwell.gain.value = 0.7
    lfo(0.05, 0.3, deepSwell.gain)
    this.deep = ctx.createGain(); this.deep.gain.value = 0
    brown.connect(deepLP).connect(deepSwell).connect(this.deep).connect(this.master)
    const hum = ctx.createOscillator(); hum.type = 'sine'; hum.frequency.value = 55
    const humG = ctx.createGain(); humG.gain.value = 0.05
    hum.connect(humG).connect(this.deep); hum.start(); brown.start()

    // soft pad
    this.pad = ctx.createGain(); this.pad.gain.value = 0
    const padLP = ctx.createBiquadFilter(); padLP.type = 'lowpass'; padLP.frequency.value = 1100
    padLP.connect(this.pad); this.pad.connect(this.master); this.pad.connect(this.reverb)
    let step = 0
    const chord = () => {
      const t = ctx.currentTime, old = this.voices; this.voices = []
      old.forEach(v => { v.g.gain.setTargetAtTime(0, t, 1.8); v.o.forEach(o => o.stop(t + 8)) })
      for (const n of PAD[step++ % PAD.length]) {
        const g = ctx.createGain(); g.gain.value = 0; g.gain.setTargetAtTime(0.03, t, 2)
        const o = [-5, 5].map(det => { const x = ctx.createOscillator(); x.type = 'triangle'; x.frequency.value = hz(n); x.detune.value = det; x.connect(g); x.start(t); return x })
        g.connect(padLP); this.voices.push({ o, g })
      }
    }
    chord(); setInterval(chord, 9000)

    // bubbles: short rising blips
    this.bubbles = ctx.createGain(); this.bubbles.gain.value = 0
    this.bubbles.connect(this.reverb); this.bubbles.connect(this.master)
    setInterval(() => {
      if (Math.random() > 0.6) return
      const n = 1 + Math.floor(Math.random() * 3)
      for (let i = 0; i < n; i++) {
        const t = ctx.currentTime + i * 0.09 + Math.random() * 0.05
        const o = ctx.createOscillator(); o.type = 'sine'
        const f = 300 + Math.random() * 500
        o.frequency.setValueAtTime(f, t); o.frequency.exponentialRampToValueAtTime(f * 2.4, t + 0.12)
        const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.05, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16)
        o.connect(g).connect(this.bubbles); o.start(t); o.stop(t + 0.2)
      }
    }, 700)

    this.master.gain.setTargetAtTime(this.muted ? 0 : 0.85, ctx.currentTime, 1.5)
    this.apply(true)
  }

  setZone(z: Zone) { if (z !== this.zone) { this.zone = z; this.apply() } }

  apply(slow = false) {
    if (!this.ctx) return
    const t = this.ctx.currentTime, k = slow ? 2 : 1.1
    //            surf  foam  deep  pad   bubbles
    const m: Record<Zone, number[]> = {
      surface: [0.95, 0.35, 0, 0.45, 0],
      deep: [0.05, 0, 0.9, 0.5, 0.9],
      abyss: [0, 0, 0.55, 0.35, 0.4],
      off: [0, 0, 0, 0, 0],
    }
    const [s, f, d, p, b] = m[this.zone]
    this.surf.gain.setTargetAtTime(s, t, k); this.foam.gain.setTargetAtTime(f, t, k)
    this.deep.gain.setTargetAtTime(d, t, k); this.pad.gain.setTargetAtTime(p, t, k)
    this.bubbles.gain.setTargetAtTime(b, t, k)
  }

  setMuted(m: boolean) {
    this.muted = m
    if (this.ctx) this.master.gain.setTargetAtTime(m ? 0 : 0.85, this.ctx.currentTime, 0.4)
  }
}

export const ocean = new OceanAudio()
