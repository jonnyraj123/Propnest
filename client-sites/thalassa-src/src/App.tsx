import { motion, useScroll, useTransform, useSpring, useMotionValueEvent, type MotionValue, AnimatePresence } from 'framer-motion'
import { Instagram, Linkedin, Twitter, Volume2, VolumeX, ArrowRight } from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode, type MouseEvent, type MutableRefObject } from "react"
import { Bubbles } from './components/Bubbles'
import { Logo } from './components/Icons'
import { ocean, type Zone } from './ocean-audio'

const M = './media/'
const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.6, delay, ease: 'easeOut' as const },
})

/* ---------- cinema curtain: opens by itself on load ---------- */
function Curtain() {
  const [gone, setGone] = useState(false)
  useEffect(() => { const t = setTimeout(() => setGone(true), 2600); return () => clearTimeout(t) }, [])
  if (gone) return null
  const panel = 'absolute top-0 h-full w-1/2 bg-[linear-gradient(90deg,#120a4f,#2a1fae_70%,#3b2fc9)] shadow-[0_0_60px_rgba(0,0,0,.6)]'
  return (
    <div className="pointer-events-none fixed inset-0 z-[100]" aria-hidden>
      <motion.div className={`${panel} left-0`} initial={{ x: 0 }} animate={{ x: '-101%' }} transition={{ delay: 1.1, duration: 1.4, ease: [0.76, 0, 0.24, 1] }}>
        <div className="absolute inset-y-0 right-0 w-px bg-white/30" />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,.05)_0_2px,transparent_2px_46px)]" />
      </motion.div>
      <motion.div className={`${panel} right-0 scale-x-[-1]`} initial={{ x: 0 }} animate={{ x: '101%' }} transition={{ delay: 1.1, duration: 1.4, ease: [0.76, 0, 0.24, 1] }}>
        <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,.05)_0_2px,transparent_2px_46px)]" />
      </motion.div>
      <motion.div className="absolute inset-0 flex flex-col items-center justify-center" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: [0, 1, 1, 0], scale: 1 }} transition={{ duration: 1.6, times: [0, 0.3, 0.7, 1] }}>
        <Logo size="lg" />
        <p className="mt-5 text-4xl font-medium tracking-[6px] md:text-6xl">THALASSA</p>
        <p className="mt-3 text-xs uppercase tracking-[5px] text-muted-foreground">Deep sea discovery</p>
      </motion.div>
    </div>
  )
}

/* ---------- navbar ---------- */
function Navbar({ muted, toggle }: { muted: boolean; toggle: () => void }) {
  const links = [['Home', '#home'], ['Expeditions', '#expeditions'], ['Mission', '#mission'], ['The Lab', '#lab']]
  return (
    <nav className="fixed top-0 z-50 flex w-full items-center justify-between px-5 py-4 md:px-28">
      <div className="flex items-center gap-10">
        <a href="#home" className="flex items-center gap-2.5 text-lg font-bold tracking-wide drop-shadow-[0_2px_10px_rgba(20,10,80,.6)]"><Logo /> Thalassa</a>
        <div className="hidden items-center gap-3 text-sm lg:flex">
          {links.map(([l, h], i) => (
            <span key={l} className="flex items-center gap-3">
              {i > 0 && <span className="text-foreground/40">•</span>}
              <a href={h} className="text-foreground/75 transition-colors hover:text-foreground">{l}</a>
            </span>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={toggle} aria-label={muted ? 'Turn sound on' : 'Turn sound off'}
          className="liquid-glass flex h-10 w-10 items-center justify-center rounded-full transition-transform hover:scale-105">
          {muted ? <VolumeX size={17} /> : <Volume2 size={17} />}
        </button>
        {[Instagram, Linkedin, Twitter].map((I, i) => (
          <a key={i} href="#" aria-label="Social link" className="liquid-glass hidden h-10 w-10 items-center justify-center rounded-full transition-transform hover:scale-105 sm:flex"><I size={17} /></a>
        ))}
      </div>
    </nav>
  )
}

/* ---------- depth gauge ---------- */
function DepthGauge() {
  const { scrollYProgress } = useScroll()
  const p = useSpring(scrollYProgress, { stiffness: 80, damping: 20 })
  const [m, setM] = useState(0)
  useMotionValueEvent(p, 'change', v => setM(Math.max(0, Math.round(v * 4200))))
  const top = useTransform(p, [0, 1], ['0%', '100%'])
  return (
    <div className="pointer-events-none fixed bottom-5 right-3 z-40 flex flex-col items-end gap-3 md:bottom-auto md:right-4 md:top-1/2 md:-translate-y-1/2 md:items-center">
      <div className="relative hidden h-56 w-px bg-foreground/25 md:block">
        <motion.span style={{ top }} className="absolute -left-[5px] h-[11px] w-[11px] -translate-y-1/2 rounded-full border-2 border-primary bg-background" />
      </div>
      <div className="liquid-glass rounded-full px-3 py-1.5 font-mono text-[11px] tracking-wider md:text-xs">
        <span className="text-foreground/60">DEPTH </span>{m.toLocaleString()} m
      </div>
    </div>
  )
}

/* ---------- sound hint (shown until the first tap starts the ocean) ---------- */
function SoundHint({ show, onClick }: { show: boolean; onClick: () => void }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.button onClick={onClick} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} transition={{ delay: 2.8 }}
          className="liquid-glass fixed bottom-5 left-4 z-40 flex items-center gap-2 rounded-full px-4 py-2.5 text-xs tracking-wide md:left-8">
          <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-accent" /></span>
          Tap anywhere for ocean sound
        </motion.button>
      )}
    </AnimatePresence>
  )
}

/* ---------- email form with sonar ping ---------- */
function EmailForm() {
  const [done, setDone] = useState(false)
  const [pings, setPings] = useState<number[]>([])
  return (
    <form onSubmit={e => { e.preventDefault(); setDone(true); setPings(p => [...p, Date.now()]) }}
      className="liquid-glass relative mx-auto mt-9 flex w-full max-w-lg items-center rounded-full p-2">
      {pings.map(id => (
        <motion.span key={id} className="pointer-events-none absolute inset-0 rounded-full border-2 border-accent"
          initial={{ opacity: 0.8, scale: 1 }} animate={{ opacity: 0, scale: 1.6 }} transition={{ duration: 1.4 }} />
      ))}
      <input type="email" required placeholder={done ? 'Welcome aboard 🌊' : 'Your email address'} aria-label="Email address"
        className="min-w-0 flex-1 bg-transparent px-5 text-sm text-foreground placeholder:text-foreground/70 focus:outline-none" />
      <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} type="submit"
        className="rounded-full bg-foreground px-6 py-3 text-xs font-semibold tracking-[1.5px] text-background md:px-8">
        {done ? 'SUBSCRIBED' : 'SUBSCRIBE'}
      </motion.button>
    </form>
  )
}

const AVATARS = [['MR', '#ff6f9f'], ['AK', '#7ad8ff'], ['JL', '#ffd166']]

function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const vidY = useTransform(scrollYProgress, [0, 1], ['0%', '14%'])
  const boatY = useTransform(scrollYProgress, [0, 1], [0, 140])
  const textY = useTransform(scrollYProgress, [0, 1], [0, -80])
  return (
    <section ref={ref} id="home" data-zone="surface" className="relative flex min-h-[100svh] flex-col items-center overflow-hidden bg-[#1a2b9e]">
      <motion.div style={{ y: vidY }} className="absolute inset-0">
        <video className="h-full w-full object-cover object-[58%_50%]" autoPlay muted loop playsInline poster={M + 'hero.webp'}>
          <source src={M + 'hero.webm'} type="video/webm" />
          <source src={M + 'hero.mp4'} type="video/mp4" />
        </video>
      </motion.div>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[65%] bg-[radial-gradient(55%_60%_at_45%_30%,rgba(25,15,110,.42),transparent_70%)]" />
      {/* the boat rides the swell */}
      <motion.div style={{ y: boatY }} className="absolute bottom-[9%] left-1/2 z-[2] w-[44vw] max-w-[230px] -translate-x-1/2 md:bottom-[7%] md:left-[6%] md:w-[24vw] md:max-w-[400px] md:translate-x-0">
        <img src={M + 'boat.webp'} alt="" className="rock w-full drop-shadow-[0_18px_22px_rgba(10,20,80,.45)] [mask-image:linear-gradient(to_bottom,#000_86%,transparent_99%)]" />
      </motion.div>
      <div className="absolute inset-x-0 bottom-0 z-[3] h-40 bg-gradient-to-t from-[#140c55] to-transparent" />
      <motion.div style={{ y: textY }} className="relative z-10 flex w-full max-w-4xl flex-col items-center px-5 pt-28 text-center md:pt-32">
        <motion.div {...fadeUp(2.2)} className="flex items-center gap-3 rounded-full bg-[#1a0f6e]/35 py-1.5 pl-1.5 pr-4 backdrop-blur-sm">
          <div className="flex -space-x-2">
            {AVATARS.map(([t, c]) => (
              <span key={t} className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#2a1fae] text-[10px] font-bold text-[#1a1050]" style={{ background: c }}>{t}</span>
            ))}
          </div>
          <span className="text-sm text-hero-sub">7,000+ ocean explorers already subscribed</span>
        </motion.div>
        <motion.h1 {...fadeUp(2.35)} className="mt-6 text-5xl font-medium tracking-[-2px] drop-shadow-[0_4px_30px_rgba(30,15,120,.55)] md:text-7xl lg:text-8xl">
          Dive into the <span className="font-serif font-normal italic text-[#ffe0ea]">Deep</span>
        </motion.h1>
        <motion.p {...fadeUp(2.5)} className="mt-6 max-w-xl text-lg text-hero-sub drop-shadow-[0_2px_14px_rgba(30,15,120,.6)]">
          Weekly dispatches from beneath the waves — new species, ocean science and the medicines the sea is still hiding.
        </motion.p>
        <motion.div {...fadeUp(2.65)} className="w-full"><EmailForm /></motion.div>
      </motion.div>
    </section>
  )
}

/* ---------- the dive: scroll scrubs the descent video ---------- */
const FRAMES = 95
function Dive({ onZone }: { onZone: (z: Zone) => void }) {
  const ref = useRef<HTMLElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const imgs = useRef<HTMLImageElement[]>([])
  const cur = useRef(-1)
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  const draw = (i: number) => {
    const c = canvas.current; if (!c) return
    let img = imgs.current[i]
    if (!img?.complete || !img.naturalWidth) { for (let k = i; k >= 0; k--) { const x = imgs.current[k]; if (x?.complete && x.naturalWidth) { img = x; break } } }
    if (!img?.naturalWidth) return
    const ctx = c.getContext('2d')!; const w = c.width, h = c.height
    const s = Math.max(w / img.naturalWidth, h / img.naturalHeight)
    const dw = img.naturalWidth * s, dh = img.naturalHeight * s
    ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh)
    cur.current = i
  }

  useEffect(() => {
    const dir = innerWidth < 768 ? 'dive-m' : 'dive'
    const order: number[] = []
    for (let step = 8; step >= 1; step = Math.floor(step / 2)) for (let i = 0; i < FRAMES; i += step) if (!order.includes(i)) order.push(i)
    let started = false
    const load = () => {
      if (started) return; started = true
      order.forEach(i => {
        const im = new Image(); im.decoding = 'async'
        im.src = `${M}${dir}/f${String(i + 1).padStart(3, '0')}.webp`
        im.onload = () => { if (Math.abs(i - Math.round(p.get() * (FRAMES - 1))) < 2 || cur.current < 0) draw(Math.round(p.get() * (FRAMES - 1))) }
        imgs.current[i] = im
      })
    }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) load() }, { rootMargin: '150% 0px' })
    if (ref.current) io.observe(ref.current)
    const resize = () => { const c = canvas.current!; const dpr = Math.min(devicePixelRatio || 1, 2); c.width = c.clientWidth * dpr; c.height = c.clientHeight * dpr; draw(Math.max(cur.current, 0)) }
    resize(); addEventListener('resize', resize)
    return () => { io.disconnect(); removeEventListener('resize', resize) }
  }, [])

  useMotionValueEvent(p, 'change', v => {
    const i = Math.min(FRAMES - 1, Math.max(0, Math.round(v * (FRAMES - 1))))
    if (i !== cur.current) requestAnimationFrame(() => draw(i))
    const r = ref.current?.getBoundingClientRect()
    if (r && r.top <= innerHeight / 2 && r.bottom >= innerHeight / 2) onZone(v < 0.28 ? 'surface' : 'deep')
  })

  const c1 = useTransform(p, [0.02, 0.1, 0.22, 0.3], [0, 1, 1, 0])
  const c2 = useTransform(p, [0.36, 0.44, 0.58, 0.66], [0, 1, 1, 0])
  const c3 = useTransform(p, [0.74, 0.82, 0.96, 1], [0, 1, 1, 1])
  const Cap = ({ o, k, t }: { o: MotionValue<number>; k: string; t: ReactNode }) => (
    <motion.div style={{ opacity: o }} className="absolute inset-x-0 bottom-[14%] flex flex-col items-center px-6 text-center">
      <span className="font-mono text-xs tracking-[4px] text-foreground/80">{k}</span>
      <p className="mt-3 max-w-3xl text-3xl font-medium tracking-[-1px] drop-shadow-[0_4px_24px_rgba(10,10,60,.8)] md:text-5xl">{t}</p>
    </motion.div>
  )
  return (
    <section ref={ref} data-zone="dive" className="relative h-[340vh] bg-[#0f6a8c]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <canvas ref={canvas} className="absolute inset-0 h-full w-full" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_70%_at_50%_50%,transparent_55%,rgba(10,8,50,.55))]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0d3f6e] to-transparent" />
        <Cap o={c1} k="0 m · THE SURFACE" t={<>Take a breath. <span className="font-serif italic font-normal">We're going under.</span></>} />
        <Cap o={c2} k="200 m · TWILIGHT ZONE" t={<>Sunlight fades. <span className="font-serif italic font-normal">Wonder begins.</span></>} />
        <Cap o={c3} k="4,000 m · THE LAB" t={<>Where ancient ruins meet <span className="font-serif italic font-normal">new science.</span></>} />
      </div>
    </section>
  )
}

/* ---------- tilt cards ---------- */
function TiltCard({ children, bg }: { children: ReactNode; bg: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const move = (e: MouseEvent) => {
    const el = ref.current!; const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5
    el.style.transform = `perspective(900px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateY(-6px)`
    el.style.setProperty('--gx', `${(x + 0.5) * 100}%`); el.style.setProperty('--gy', `${(y + 0.5) * 100}%`)
  }
  return (
    <div ref={ref} onMouseMove={move} onMouseLeave={() => { ref.current!.style.transform = '' }}
      className="group relative overflow-hidden rounded-3xl border border-foreground/10 pb-8 text-center shadow-[0_30px_60px_-20px_rgba(10,5,60,.85)] transition-transform duration-200 will-change-transform" style={{ background: bg }}>
      <span className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity group-hover:opacity-100"
        style={{ background: 'radial-gradient(260px circle at var(--gx) var(--gy), rgba(255,255,255,.2), transparent 60%)' }} />
      {children}
    </div>
  )
}

const CARDS = [
  { n: '01', img: 'card-lab.webp', bg: '#4629d0', t: 'Laboratory', d: 'Samples from the deep become research you can read in five minutes.' },
  { n: '02', img: 'card-exploration.webp', bg: '#3f3db8', t: 'Exploration', d: 'Ride along on expeditions, from coral gardens to hydrothermal vents.' },
  { n: '03', img: 'card-organisms.webp', bg: '#423dbd', t: 'Organisms', d: 'Meet the glowing jellies and anemones inspiring new medicine.' },
]

function Expeditions() {
  return (
    <section id="expeditions" data-zone="deep" className="relative bg-[linear-gradient(180deg,#0d3f6e_0%,#1a1872_35%,#140c55_100%)] px-5 pb-6 pt-32 md:px-10 md:pb-9 md:pt-44">
      <Bubbles density={24} />
      <div className="relative mx-auto max-w-6xl text-center">
        <motion.h2 {...fadeUp(0)} className="text-5xl font-medium tracking-[-2px] md:text-7xl lg:text-8xl">
          The ocean has <span className="font-serif font-normal italic text-primary">answers.</span><br className="hidden md:block" /> Are you listening?
        </motion.h2>
        <motion.p {...fadeUp(0.1)} className="mx-auto mb-20 mt-6 max-w-2xl text-lg text-muted-foreground">
          More than 80% of the ocean is still unexplored. Every week we bring back what divers, labs and research partners find down there.
        </motion.p>
        <div className="mb-20 grid gap-10 md:grid-cols-3 md:gap-8">
          {CARDS.map(({ n, img, bg, t, d }, i) => (
            <motion.div key={t} {...fadeUp(0.1 + i * 0.12)}>
              <TiltCard bg={bg}>
                <span className="absolute right-5 top-4 z-10 font-mono text-xs text-foreground/70">{n}</span>
                <div className="flex h-[230px] items-center justify-center overflow-hidden">
                  <img src={M + img} alt={t} loading="lazy" className="floaty h-full w-full object-contain p-2" style={{ animationDelay: `${-i * 1.3}s` }} />
                </div>
                <h3 className="mt-2 text-base font-semibold">{t}</h3>
                <p className="mx-auto mt-2 max-w-[260px] text-sm text-foreground/75">{d}</p>
              </TiltCard>
            </motion.div>
          ))}
        </div>
        <motion.p {...fadeUp(0.2)} className="text-center text-sm text-muted-foreground">If we don't explore the deep, we'll never know what it can heal.</motion.p>
      </div>
    </section>
  )
}

/* ---------- mission: porthole + scroll word reveal ---------- */
function Word({ w, p, range, hi }: { w: string; p: MotionValue<number>; range: [number, number]; hi?: boolean }) {
  const o = useTransform(p, range, [0.15, 1])
  return <motion.span style={{ opacity: o }} className={hi ? 'text-foreground' : 'text-hero-sub'}>{w} </motion.span>
}
function Reveal({ text, p, from, to, hi = [], className }: { text: string; p: MotionValue<number>; from: number; to: number; hi?: string[]; className: string }) {
  const words = text.split(' ')
  return (
    <p className={className}>
      {words.map((w, i) => {
        const s = from + ((to - from) * i) / words.length
        return <Word key={i} w={w} p={p} range={[s, s + (to - from) / words.length]} hi={hi.includes(w.replace(/[^a-z]/gi, '').toLowerCase())} />
      })}
    </p>
  )
}

function Porthole() {
  const ref = useRef<HTMLDivElement>(null)
  const [o, setO] = useState({ x: 0, y: 0 })
  const move = (e: MouseEvent) => {
    const r = ref.current!.getBoundingClientRect()
    setO({ x: ((e.clientX - r.left) / r.width - 0.5) * -34, y: ((e.clientY - r.top) / r.height - 0.5) * -34 })
  }
  return (
    <div ref={ref} onMouseMove={move} onMouseLeave={() => setO({ x: 0, y: 0 })}
      className="relative mx-auto aspect-square w-full max-w-[720px] rounded-full border-[14px] border-[#c9b8ff] shadow-[0_0_0_10px_#2a1fae,0_0_140px_rgba(120,110,255,.45),inset_0_0_80px_rgba(0,0,0,.6)] md:border-[22px]">
      <div className="absolute inset-0 overflow-hidden rounded-full">
        <motion.div className="absolute -inset-10" animate={{ x: o.x, y: o.y }} transition={{ type: 'spring', stiffness: 60, damping: 18 }}>
          <img src={M + 'porthole.webp'} alt="A school of fish swirling under sun rays" loading="lazy" className="slowspin h-full w-full object-cover" />
        </motion.div>
        <Bubbles density={30} />
        <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(70%_70%_at_30%_25%,rgba(255,255,255,.2),transparent_50%)]" />
        <div className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_0_90px_rgba(10,5,60,.75)]" />
      </div>
      {Array.from({ length: 8 }).map((_, i) => (
        <span key={i} className="absolute h-3 w-3 rounded-full bg-[#2a1fae] shadow-[inset_0_1px_2px_rgba(255,255,255,.4)] md:h-4 md:w-4"
          style={{ left: `${50 + 51.6 * Math.cos((i * Math.PI) / 4)}%`, top: `${50 + 51.6 * Math.sin((i * Math.PI) / 4)}%`, transform: 'translate(-50%,-50%)' }} />
      ))}
    </div>
  )
}

function Mission() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start 80%', 'end 60%'] })
  return (
    <section id="mission" data-zone="deep" className="relative bg-[#140c55] px-5 pb-32 pt-16 md:px-10 md:pb-44">
      <motion.div {...fadeUp(0)}><Porthole /></motion.div>
      <div ref={ref} className="mx-auto mt-20 max-w-5xl text-center">
        <Reveal p={p} from={0} to={0.55} hi={['curiosity', 'meets', 'discovery']}
          className="text-2xl font-medium tracking-[-1px] md:text-4xl lg:text-5xl"
          text="We're building a voyage where curiosity meets discovery — where readers dive deeper, scientists find an audience, and every dispatch brings the ocean a little closer." />
        <Reveal p={p} from={0.5} to={1}
          className="mt-10 text-xl font-medium md:text-2xl lg:text-3xl"
          text="A journal where science, story and sea life flow together — with less noise, less jargon, and more wonder for everyone on board." />
      </div>
    </section>
  )
}

const FEATURES = [
  ['Living Library', 'Field notes on the species we study, written for humans, not just scientists.'],
  ['Expedition Logs', 'Weekly logs, photos and audio straight from the boat and the dive.'],
  ['Open Research', 'New papers explained in plain words, always linked to the source.'],
  ['Ocean Pharmacy', 'How sea life is shaping tomorrow’s medicine, one discovery at a time.'],
]

function Lab() {
  return (
    <section id="lab" data-zone="deep" className="relative border-t border-border/30 bg-[linear-gradient(180deg,#140c55,#0d0738)] px-5 py-32 md:px-10 md:py-44">
      <div className="mx-auto max-w-6xl">
        <motion.p {...fadeUp(0)} className="text-xs uppercase tracking-[3px] text-muted-foreground">The Lab</motion.p>
        <motion.h2 {...fadeUp(0.1)} className="mt-4 text-4xl font-medium tracking-[-1.5px] md:text-6xl">
          The pharmacy beneath the <span className="font-serif font-normal italic text-accent">waves</span>
        </motion.h2>
        <motion.div {...fadeUp(0.2)} className="relative mt-12 aspect-[4/3] overflow-hidden rounded-2xl shadow-[0_40px_80px_-30px_rgba(0,0,0,.8)] md:aspect-[3/1]">
          <img src={M + 'lab.webp'} alt="Underwater ruins, a diver and a glass dome laboratory" loading="lazy" className="pan kenburns h-full w-full object-cover" />
          <div className="shimmer pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(100deg,transparent_0_60px,rgba(255,255,255,.07)_60px_90px,transparent_90px_170px)] mix-blend-screen" />
          <Bubbles density={26} />
          <div className="absolute bottom-4 left-4"><span className="liquid-glass block rounded-full px-4 py-2 text-xs tracking-wider"><span className="glow text-primary">●</span> LIVE FROM THE OCEANIC LAB</span></div>
        </motion.div>
        <div className="mt-16 grid gap-8 md:grid-cols-4">
          {FEATURES.map(([t, d], i) => (
            <motion.div key={t} {...fadeUp(0.1 + i * 0.08)} className="border-t border-border/40 pt-5">
              <h3 className="text-base font-semibold">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTA() {
  return (
    <section data-zone="abyss" className="relative overflow-hidden border-t border-border/30 bg-[#07041f] px-5 py-36 md:py-48">
      <img src={M + 'abyss.webp'} alt="" loading="lazy" className="kenburns absolute inset-0 h-full w-full object-cover" />
      <Bubbles density={60} glow />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-40 bg-gradient-to-b from-[#0d0738] to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-40 bg-gradient-to-t from-[#07041f] to-transparent" />
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(45%_55%_at_50%_50%,rgba(5,3,25,.55),transparent_80%)]" />
      <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center text-center">
        <motion.div {...fadeUp(0)}><Logo size="lg" /></motion.div>
        <motion.h2 {...fadeUp(0.1)} className="mt-6 font-serif text-5xl italic md:text-7xl">Begin Your Descent</motion.h2>
        <motion.p {...fadeUp(0.2)} className="mt-5 text-lg text-hero-sub">One email a week. Zero noise. Unsubscribe anytime.</motion.p>
        <motion.div {...fadeUp(0.3)} className="mt-10 flex flex-col gap-3 sm:flex-row">
          <motion.a whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} href="#home" className="rounded-lg bg-foreground px-8 py-3.5 text-sm font-semibold text-background">Subscribe Now</motion.a>
          <motion.a whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} href="#expeditions" className="liquid-glass flex items-center justify-center gap-2 rounded-lg px-8 py-3.5 text-sm font-semibold">Join an Expedition <ArrowRight size={16} /></motion.a>
        </motion.div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer data-zone="off" className="flex flex-col items-center justify-between gap-4 bg-[#07041f] px-8 py-12 md:flex-row md:px-28">
      <p className="text-sm text-muted-foreground">© 2026 Thalassa. All rights reserved.</p>
      <div className="flex gap-6 text-sm">
        {['Privacy', 'Terms', 'Contact'].map(l => <a key={l} href="#" className="text-muted-foreground hover:text-foreground">{l}</a>)}
      </div>
    </footer>
  )
}

/* ---------- sound zones: the section at screen centre picks the mix ---------- */
function useSoundZones(diveZone: MutableRefObject<Zone>) {
  useEffect(() => {
    const pick = () => {
      const mid = innerHeight / 2
      const s = Array.from(document.querySelectorAll<HTMLElement>('[data-zone]')).find(el => { const r = el.getBoundingClientRect(); return r.top <= mid && r.bottom >= mid })
      const z = s?.dataset.zone
      ocean.setZone(z === 'dive' ? diveZone.current : ((z as Zone) || 'off'))
    }
    pick()
    addEventListener('scroll', pick, { passive: true })
    return () => removeEventListener('scroll', pick)
  }, [diveZone])
}

export default function App() {
  const [muted, setMuted] = useState(false)
  const [started, setStarted] = useState(false)
  const diveZone = useRef<Zone>('surface')
  useSoundZones(diveZone)

  // sound can only begin after the visitor's first tap / click / key press
  useEffect(() => {
    const go = () => { ocean.start(); setStarted(true); off() }
    const evs = ['pointerdown', 'keydown', 'touchend'] as const
    const off = () => evs.forEach(e => removeEventListener(e, go))
    evs.forEach(e => addEventListener(e, go, { passive: true }))
    return off
  }, [])
  useEffect(() => {
    const vis = () => ocean.setMuted(document.hidden || muted)
    document.addEventListener('visibilitychange', vis)
    return () => document.removeEventListener('visibilitychange', vis)
  }, [muted])

  const toggle = () => {
    const m = started ? !muted : false
    setMuted(m); ocean.start(); setStarted(true); ocean.setMuted(m)
  }

  return (
    <div className="grain relative">
      <Curtain />
      <Navbar muted={muted || !started} toggle={toggle} />
      <DepthGauge />
      <SoundHint show={!started} onClick={() => { ocean.start(); setStarted(true) }} />
      <main>
        <Hero />
        <Dive onZone={z => { diveZone.current = z; ocean.setZone(z) }} />
        <Expeditions />
        <Mission />
        <Lab />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
