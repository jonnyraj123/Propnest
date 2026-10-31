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
