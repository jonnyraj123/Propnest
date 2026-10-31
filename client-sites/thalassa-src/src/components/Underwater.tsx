import { useEffect, useRef } from 'react'

/** Rising bubbles + drifting plankton on a canvas. Pauses when off-screen. */
export function Bubbles({ density = 40, glow = false }: { density?: number; glow?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const c = ref.current!
    const ctx = c.getContext('2d')!
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    let w = 0, h = 0, raf = 0, visible = true
    const dpr = Math.min(devicePixelRatio || 1, 2)
    const resize = () => {
      w = c.clientWidth; h = c.clientHeight
      c.width = w * dpr; c.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const ro = new ResizeObserver(resize); ro.observe(c)
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting })
    io.observe(c)
    const parts = Array.from({ length: density }, () => ({
      x: Math.random(), y: Math.random(), r: Math.random() * (glow ? 2.2 : 5) + 1,
      s: Math.random() * 0.0012 + 0.0004, p: Math.random() * 6.28,
      hue: glow ? (Math.random() < 0.5 ? 188 : 320) : 220,
    }))
    const draw = (t: number) => {
      raf = requestAnimationFrame(draw)
      if (!visible) return
      ctx.clearRect(0, 0, w, h)
      for (const b of parts) {
        if (!reduce) { b.y -= b.s * (glow ? 0.35 : 1); if (b.y < -0.05) { b.y = 1.05; b.x = Math.random() } }
        const x = b.x * w + Math.sin(t / 1400 + b.p) * (glow ? 18 : 10)
        const y = b.y * h
        ctx.beginPath()
        ctx.arc(x, y, b.r, 0, 6.283)
        if (glow) {
          const a = 0.45 + 0.4 * Math.sin(t / 900 + b.p)
          ctx.fillStyle = `hsla(${b.hue},100%,72%,${a})`
          ctx.shadowColor = `hsla(${b.hue},100%,65%,1)`; ctx.shadowBlur = 14
          ctx.fill()
        } else {
          ctx.shadowBlur = 0
          ctx.strokeStyle = 'rgba(220,235,255,.55)'; ctx.lineWidth = 1.2; ctx.stroke()
          ctx.beginPath(); ctx.arc(x - b.r * .35, y - b.r * .35, b.r * .28, 0, 6.283)
          ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.fill()
        }
      }
    }
    raf = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect() }
  }, [density, glow])
  return <canvas ref={ref} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden />
}

function Fish({ x, y, s, flip, color }: { x: number; y: number; s: number; flip?: boolean; color: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <ellipse cx="0" cy="0" rx="16" ry="7" fill={color} />
      <path d="M14 0 L26 -8 L26 8Z" fill={color} />
      <circle cx="-9" cy="-2" r="1.6" fill="#0b0830" />
    </g>
  )
}

function School({ x, y, color, flip, delay = 0 }: { x: number; y: number; color: string; flip?: boolean; delay?: number }) {
  const pts = [[0, 0], [34, -14], [30, 18], [64, 2], [70, -26], [96, 14], [58, 34], [100, -8], [126, 6], [20, 40]]
  return (
    <g className="floaty" style={{ animationDelay: `${delay}s` }}>
      {pts.map(([a, b], i) => <Fish key={i} x={x + (flip ? -a : a)} y={y + b} s={0.9 + (i % 3) * 0.12} flip={flip} color={color} />)}
    </g>
  )
}

function Weed({ x, h, color, delay }: { x: number; h: number; color: string; delay: number }) {
  return (
    <path className="sway" style={{ animationDelay: `${delay}s` }}
      d={`M${x} 900 C${x - 30} ${900 - h * 0.35} ${x + 30} ${900 - h * 0.65} ${x - 6} ${900 - h} C${x + 16} ${900 - h * 0.6} ${x - 12} ${900 - h * 0.3} ${x + 14} 900Z`}
      fill={color} />
  )
}

/** The Oceanic Lab: light shafts, fish, ruins, a diver and a glowing dome. */
export function UnderwaterScene({ variant = 'wide' }: { variant?: 'wide' | 'square' }) {
  return (
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1600 900" preserveAspectRatio={variant === 'wide' ? 'xMidYMax slice' : 'xMidYMid slice'} aria-hidden>
      <defs>
        <linearGradient id="uw" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4a63ff" />
          <stop offset=".45" stopColor="#3524c8" />
          <stop offset="1" stopColor="#140c55" />
        </linearGradient>
        <linearGradient id="ray" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".5" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="dome" cx=".5" cy=".6" r=".6">
          <stop offset="0" stopColor="#bff7ff" stopOpacity=".95" />
          <stop offset="1" stopColor="#5ad7ff" stopOpacity=".25" />
        </radialGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#uw)" />
      {[260, 560, 820, 1120, 1380].map((x, i) => (
        <polygon key={x} className="sway" style={{ animationDelay: `${-i * 1.3}s`, animationDuration: `${8 + i}s` }}
          points={`${x - 40},0 ${x + 60},0 ${x + 220},900 ${x - 120},900`} fill="url(#ray)" opacity=".35" />
      ))}
      <School x={180} y={250} color="#7ad8ff" />
      <School x={1320} y={180} color="#ffb3d1" flip delay={-2} />
      <School x={980} y={420} color="#a5f3ff" delay={-3.5} />
      {variant === 'square' && <School x={640} y={330} color="#ffd166" delay={-1} />}
      {/* sea floor */}
      <path d="M0 760 Q300 700 620 760 T1200 740 T1600 750 L1600 900 L0 900Z" fill="#1d1272" />
      <path d="M0 820 Q400 780 800 820 T1600 810 L1600 900 L0 900Z" fill="#120a52" />
      {/* ruins */}
      <g transform="translate(160 520)">
        <rect x="0" y="0" width="54" height="250" fill="#d9d4ff" />
        <rect x="-14" y="-18" width="82" height="22" fill="#eee9ff" />
        <rect x="120" y="70" width="54" height="180" fill="#c9c1ff" />
        <rect x="106" y="52" width="82" height="22" fill="#e2dcff" />
        <path d="M-20 -18 L200 40 L204 58 L-20 2Z" fill="#b8adff" />
        {[10, 26, 42].map(x => <rect key={x} x={x} y="10" width="4" height="230" fill="#b5acf0" />)}
      </g>
      {/* dome lab */}
      <g transform={variant === 'square' ? 'translate(980 700)' : 'translate(1050 700)'}>
        <ellipse cx="0" cy="70" rx="180" ry="26" fill="#0f0848" />
        <path d="M-150 70 A150 150 0 0 1 150 70Z" fill="url(#dome)" className="glow" />
        <path d="M-150 70 A150 150 0 0 1 150 70" fill="none" stroke="#e8fbff" strokeWidth="5" />
        <path d="M0 -80 L0 70 M-106 -36 L106 -36 M-140 20 L140 20" stroke="#e8fbff" strokeOpacity=".6" strokeWidth="3" />
        <rect x="-20" y="10" width="40" height="60" rx="18" fill="#ff7aa2" />
      </g>
      {/* diver */}
      <g transform="translate(700 600)"><g className="floaty">
        <rect x="-18" y="-10" width="36" height="58" rx="14" fill="#f4f1ff" />
        <circle cx="0" cy="-30" r="24" fill="#f4f1ff" />
        <circle cx="0" cy="-30" r="14" fill="#2b2a7a" />
        <circle cx="-4" cy="-34" r="4" fill="#8fe8ff" />
        <rect x="18" y="-6" width="16" height="44" rx="6" fill="#ffcf5a" />
        <rect x="-16" y="46" width="12" height="34" rx="5" fill="#d9d4ff" />
        <rect x="4" y="46" width="12" height="34" rx="5" fill="#d9d4ff" />
      </g></g>
      {/* coral + weeds */}
      <Weed x={60} h={220} color="#2ad1a0" delay={0} />
      <Weed x={90} h={160} color="#1fae8a" delay={-1} />
      <Weed x={1500} h={240} color="#2ad1a0" delay={-2} />
      <Weed x={1540} h={170} color="#ff6f9f" delay={-.5} />
      <Weed x={520} h={130} color="#ff6f9f" delay={-1.5} />
      {[[420, 820, '#ff7aa2'], [470, 830, '#ffb15a'], [1300, 820, '#ff7aa2'], [1350, 834, '#c78bff']].map(([x, y, c], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          {[0, 1, 2, 3, 4].map(k => <circle key={k} cx={(k - 2) * 14} cy={-Math.abs(k - 2) * -6 - 20} r="13" fill={c as string} />)}
        </g>
      ))}
    </svg>
  )
}
