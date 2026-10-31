import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

/** Sine-like wave band, drawn twice as wide as the viewBox so it can slide seamlessly. */
function wave(y: number, amp: number, len: number, w = 3200, h = 900) {
  let d = `M0 ${y}`
  for (let x = 0; x < w; x += len) {
    d += ` Q${x + len / 4} ${y - amp} ${x + len / 2} ${y} T${x + len} ${y}`
  }
  return `${d} L${w} ${h} L0 ${h} Z`
}

function crest(y: number, amp: number, len: number, w = 3200) {
  let d = `M0 ${y}`
  for (let x = 0; x < w; x += len) d += ` Q${x + len / 4} ${y - amp} ${x + len / 2} ${y} T${x + len} ${y}`
  return d
}

const WAVES = [
  { y: 585, amp: 14, len: 220, fill: '#7c8cff', d: 26, o: 1 },
  { y: 625, amp: 22, len: 320, fill: '#4c55f0', d: 20, o: 1 },
  { y: 690, amp: 30, len: 420, fill: '#3a2fd6', d: 15, o: 1 },
  { y: 770, amp: 36, len: 520, fill: '#2a1fae', d: 11, o: 1 },
  { y: 840, amp: 30, len: 460, fill: '#1c1580', d: 9, o: 1 },
]

function Cloud({ x, y, s, d, delay }: { x: number; y: number; s: number; d: number; delay: number }) {
  return (
    <g className="cloud" style={{ ['--d' as string]: `${d}s`, animationDelay: `${delay}s` }}>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <ellipse cx="0" cy="40" rx="150" ry="40" fill="#e9e3ff" />
        <circle cx="-70" cy="20" r="55" fill="#f4f0ff" />
        <circle cx="0" cy="0" r="75" fill="#ffffff" />
        <circle cx="80" cy="18" r="58" fill="#f4f0ff" />
        <ellipse cx="10" cy="58" rx="160" ry="22" fill="#cbbcff" opacity=".7" />
      </g>
    </g>
  )
}

export function Sailboat() {
  return (
    <g>
      {/* hull */}
      <path d="M-150 0 L150 0 Q130 46 90 58 L-110 58 Q-140 40 -150 0Z" fill="#e2365b" />
      <path d="M-150 0 L150 0 L146 12 L-146 12Z" fill="#ff8aa3" />
      <path d="M-110 58 L90 58 Q120 50 135 30 L-138 30 Q-130 50 -110 58Z" fill="#b51f45" />
      {/* mast */}
      <rect x="-6" y="-300" width="8" height="300" fill="#5b2a1d" />
      {/* main sail */}
      <path d="M8 -292 Q120 -170 150 -18 L8 -18Z" fill="#fde6cc" />
      <path d="M8 -292 Q70 -230 96 -160 L8 -160Z" fill="#ffd2c0" />
      <path d="M8 -120 L132 -120 L138 -100 L8 -100Z" fill="#ff7f98" />
      {/* jib */}
      <path d="M-10 -280 Q-120 -150 -150 -14 L-10 -14Z" fill="#fff2e2" />
      <path d="M-10 -90 L-140 -90 L-146 -72 L-10 -72Z" fill="#ff7f98" />
      {/* flag */}
      <path d="M-2 -300 L40 -288 L-2 -276Z" fill="#ff4d6d" />
      {/* sailor */}
      <circle cx="-70" cy="-22" r="9" fill="#2a1a3e" />
      <rect x="-76" y="-14" width="12" height="18" rx="4" fill="#ffd166" />
    </g>
  )
}

export default function HeroScene() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const skyY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const seaY = useTransform(scrollYProgress, [0, 1], ['0%', '-10%'])
  const boatY = useTransform(scrollYProgress, [0, 1], [0, 120])

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden" aria-hidden>
      <motion.svg style={{ y: skyY }} className="absolute inset-0 h-full w-full" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2a1fae" />
            <stop offset=".4" stopColor="#4636d6" />
            <stop offset=".68" stopColor="#8c6cf0" />
            <stop offset="1" stopColor="#ffb3cf" />
          </linearGradient>
          <radialGradient id="sun" cx=".5" cy=".5" r=".5">
            <stop offset="0" stopColor="#fff7e6" />
            <stop offset=".35" stopColor="#ffe3b8" stopOpacity=".9" />
            <stop offset="1" stopColor="#ffb3cf" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="1600" height="900" fill="url(#sky)" />
        <g opacity=".22">
          <g className="rays">
            {Array.from({ length: 18 }).map((_, i) => (
              <polygon key={i} points="1290,170 1270,-700 1310,-700" fill="#fff" transform={`rotate(${i * 20} 1290 170)`} />
            ))}
          </g>
        </g>
        <circle cx="1290" cy="170" r="210" fill="url(#sun)" />
        <circle cx="1290" cy="170" r="58" fill="#fff8ec" />
        <g opacity=".9">
          <Cloud x={120} y={150} s={0.9} d={140} delay={-40} />
          <Cloud x={1420} y={360} s={1.1} d={120} delay={-20} />
          <Cloud x={380} y={420} s={0.6} d={170} delay={-120} />
        </g>
        {/* mountains */}
        <polygon points="980,600 1160,330 1250,420 1330,300 1520,600" fill="#8d6be6" />
        <polygon points="1160,330 1200,600 1100,600" fill="#a98bf2" />
        <polygon points="1330,300 1380,600 1290,600" fill="#b9a0ff" />
        <polygon points="1240,600 1420,380 1600,520 1600,600" fill="#6c4fd6" />
        <polygon points="0,600 120,470 230,600" fill="#7b62e0" />
        <polygon points="120,470 160,600 80,600" fill="#9b84f0" />
        {/* lighthouse cliff */}
        <path d="M1380 600 Q1400 470 1460 450 L1540 450 Q1580 480 1600 600Z" fill="#4b36b8" />
        <g transform="translate(1490 300)">
          <path d="M-22 150 L-14 0 L14 0 L22 150Z" fill="#fff" />
          <path d="M-20 110 L20 110 L21 128 L-21 128Z" fill="#ff4d6d" />
          <path d="M-17 60 L17 60 L18 78 L-18 78Z" fill="#ff4d6d" />
          <path d="M-16 20 L16 20 L17 36 L-17 36Z" fill="#ff4d6d" />
          <rect x="-18" y="-24" width="36" height="24" fill="#2b1f6e" />
          <circle cx="0" cy="-12" r="8" fill="#fff4b8" className="glow" />
          <path d="M-22 -24 L0 -46 L22 -24Z" fill="#ff4d6d" />
          <polygon className="beam" points="0,-12 -620,-120 -620,60" fill="#fff4b8" opacity=".18" />
        </g>
      </motion.svg>

      <motion.svg style={{ y: seaY }} className="absolute inset-0 h-full w-full" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
        {WAVES.slice(0, 2).map((w, i) => (
          <g key={i} className="wave-track" style={{ ['--d' as string]: `${w.d}s` }}>
            <path d={wave(w.y, w.amp, w.len)} fill={w.fill} opacity={w.o} />
          </g>
        ))}
      </motion.svg>

      <motion.div style={{ y: boatY }} className="absolute bottom-[21%] left-1/2 w-[130px] -translate-x-1/2 md:bottom-[24%] md:left-[7%] md:w-[clamp(220px,22vw,330px)] md:translate-x-0 lg:left-[9%]">
        <svg viewBox="-160 -310 330 380" className="bob w-full overflow-visible"><Sailboat /></svg>
      </motion.div>

      <motion.svg style={{ y: seaY }} className="absolute inset-0 h-full w-full" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
        {WAVES.slice(2).map((w, i) => (
          <g key={i} className="wave-track" style={{ ['--d' as string]: `${w.d}s` }}>
            <path d={wave(w.y, w.amp, w.len)} fill={w.fill} />
            <path d={crest(w.y + 4, w.amp, w.len)} fill="none" stroke="#c9d4ff" strokeOpacity=".45" strokeWidth="3" />
          </g>
        ))}
      </motion.svg>
    </div>
  )
}
