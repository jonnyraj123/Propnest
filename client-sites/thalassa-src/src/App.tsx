import { motion, useScroll, useTransform, useSpring, type MotionValue, AnimatePresence } from 'framer-motion'
import { Instagram, Linkedin, Twitter, Volume2, VolumeX, Headphones, ArrowRight } from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode, type MouseEvent } from 'react'
import HeroScene from './components/HeroScene'
import { Bubbles, UnderwaterScene } from './components/Underwater'
import { FlaskArt, SubmarineArt, OrganismArt, Logo } from './components/Icons'
import { ocean, type Zone } from './ocean-audio'

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.6, delay, ease: 'easeOut' as const },
})

/* ---------- entry gate (browsers need a click before sound) ---------- */
function Gate({ onEnter }: { onEnter: (sound: boolean) => void }) {
  return (
    <motion.div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[radial-gradient(60%_60%_at_50%_40%,#3524c8,#0b0830)] px-6 text-center"
      exit={{ opacity: 0, scale: 1.04 }} transition={{ duration: 0.8 }}>
      <Bubbles density={30} />
      <motion.div {...fadeUp(0.1)} className="relative z-10 flex flex-col items-center">
        <Logo size="lg" />
        <p className="mt-6 text-xs uppercase tracking-[6px] text-muted-foreground">Deep sea discovery</p>
        <h1 className="mt-3 text-5xl font-medium tracking-[-2px] md:text-7xl">THALASSA</h1>
        <p className="mt-5 flex items-center gap-2 text-sm text-muted-foreground"><Headphones size={16} /> Best with sound on</p>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} onClick={() => onEnter(true)}
          className="mt-8 rounded-full bg-primary px-10 py-4 text-sm font-semibold tracking-[2px] text-primary-foreground shadow-[0_0_40px_hsl(var(--primary)/.5)]">
          DIVE IN WITH SOUND
        </motion.button>
        <button onClick={() => onEnter(false)} className="mt-4 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">Enter quietly</button>
      </motion.div>
    </motion.div>
  )
}

/* ---------- navbar ---------- */
function Navbar({ muted, toggle }: { muted: boolean; toggle: () => void }) {
  const links = [['Home', '#home'], ['Expeditions', '#expeditions'], ['Mission', '#mission'], ['The Lab', '#lab']]
  return (
    <nav className="fixed top-0 z-50 flex w-full items-center justify-between px-5 py-4 md:px-28">
      <div className="flex items-center gap-10">
        <a href="#home" className="flex items-center gap-2.5 text-lg font-bold tracking-wide"><Logo /> Thalassa</a>
        <div className="hidden items-center gap-3 text-sm lg:flex">
          {links.map(([l, h], i) => (
            <span key={l} className="flex items-center gap-3">
              {i > 0 && <span className="text-muted-foreground/50">•</span>}
              <a href={h} className="text-muted-foreground transition-colors hover:text-foreground">{l}</a>
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

/* ---------- depth gauge (signature 1) ---------- */
function DepthGauge() {
  const { scrollYProgress } = useScroll()
  const p = useSpring(scrollYProgress, { stiffness: 80, damping: 20 })
  const [m, setM] = useState(0)
  useEffect(() => p.on('change', v => setM(Math.round(v * 4200))), [p])
  const top = useTransform(p, [0, 1], ['0%', '100%'])
  return (
    <div className="pointer-events-none fixed bottom-5 right-3 z-40 flex flex-col items-end gap-3 opacity-90 md:bottom-auto md:right-4 md:top-1/2 md:-translate-y-1/2 md:items-center">
      <div className="liquid-glass rounded-full px-3 py-1.5 font-mono text-[11px] tracking-wider text-hero-sub md:text-xs">
        <span className="text-muted-foreground">DEPTH </span>{m.toLocaleString()} m
      </div>
      <div className="relative order-first hidden h-56 w-px bg-foreground/20 md:block">
        <motion.span style={{ top }} className="absolute -left-[5px] h-[11px] w-[11px] -translate-y-1/2 rounded-full border-2 border-primary bg-background" />
      </div>
    </div>
  )
}

/* ---------- sonar email form (signature 2: ping on submit) ---------- */
function EmailForm() {
  const [done, setDone] = useState(false)
  const [pings, setPings] = useState<number[]>([])
  return (
    <form onSubmit={e => { e.preventDefault(); setDone(true); setPings(p => [...p, Date.now()]) }}
      className="liquid-glass relative mx-auto mt-10 flex w-full max-w-lg items-center rounded-full p-2">
      {pings.map(id => (
        <motion.span key={id} className="pointer-events-none absolute inset-0 rounded-full border-2 border-accent"
          initial={{ opacity: 0.8, scale: 1 }} animate={{ opacity: 0, scale: 1.6 }} transition={{ duration: 1.4 }} />
      ))}
      <input type="email" required placeholder={done ? 'Welcome aboard 🌊' : 'Your email address'} aria-label="Email address"
        className="min-w-0 flex-1 bg-transparent px-5 text-sm text-foreground placeholder:text-hero-sub/70 focus:outline-none" />
      <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} type="submit"
        className="rounded-full bg-foreground px-6 py-3 text-xs font-semibold tracking-[1.5px] text-background md:px-8">
        {done ? 'SUBSCRIBED' : 'SUBSCRIBE'}
      </motion.button>
    </form>
  )
}

const AVATARS = [['MR', '#ff6f9f'], ['AK', '#7ad8ff'], ['JL', '#ffd166']]

function Hero() {
  return (
    <section id="home" data-zone="surface" className="relative flex min-h-[100svh] flex-col items-center overflow-hidden">
      <HeroScene />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-[70%] bg-[radial-gradient(50%_55%_at_50%_35%,rgba(22,12,90,.45),transparent_70%)]" />
      <div className="absolute inset-x-0 bottom-0 z-[1] h-64 bg-gradient-to-t from-[#1c1580] to-transparent" />
      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center px-5 pt-28 text-center md:pt-32">
        <motion.div {...fadeUp(0.1)} className="flex items-center gap-3 rounded-full bg-[#1a0f6e]/40 py-1.5 pl-1.5 pr-4 backdrop-blur-sm">
          <div className="flex -space-x-2">
            {AVATARS.map(([t, c]) => (
              <span key={t} className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#3b2fc9] text-[10px] font-bold text-[#1a1050]" style={{ background: c }}>{t}</span>
            ))}
          </div>
          <span className="text-sm text-hero-sub">7,000+ ocean explorers already subscribed</span>
        </motion.div>
        <motion.h1 {...fadeUp(0.2)} className="mt-6 text-5xl font-medium tracking-[-2px] drop-shadow-[0_4px_30px_rgba(40,20,140,.45)] md:text-7xl lg:text-8xl">
          Dive into the <span className="font-serif font-normal italic text-[#ffd6e3]">Deep</span>
        </motion.h1>
        <motion.p {...fadeUp(0.3)} className="mt-6 max-w-xl text-lg text-hero-sub">
          Weekly dispatches from beneath the waves — new species, ocean science and the medicines the sea is still hiding.
        </motion.p>
        <motion.div {...fadeUp(0.4)} className="w-full"><EmailForm /></motion.div>
      </div>
    </section>
  )
}

/* ---------- tilt cards (signature 3) ---------- */
function TiltCard({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const move = (e: MouseEvent) => {
    const el = ref.current!; const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5
    el.style.transform = `perspective(900px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateY(-6px)`
    el.style.setProperty('--gx', `${(x + 0.5) * 100}%`); el.style.setProperty('--gy', `${(y + 0.5) * 100}%`)
  }
  const leave = () => { ref.current!.style.transform = '' }
  return (
    <div ref={ref} onMouseMove={move} onMouseLeave={leave}
      className="group relative overflow-hidden rounded-3xl border border-foreground/10 bg-[linear-gradient(160deg,#3b2fc9_0%,#24188f_100%)] px-6 pb-8 pt-4 text-center shadow-[0_30px_60px_-20px_rgba(10,5,60,.8)] transition-transform duration-200 will-change-transform">
      <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
        style={{ background: 'radial-gradient(240px circle at var(--gx) var(--gy), rgba(255,255,255,.18), transparent 60%)' }} />
      {children}
    </div>
  )
}

const CARDS = [
  { n: '01', Art: FlaskArt, t: 'Laboratory', d: 'Samples from the deep become research you can read in five minutes.' },
  { n: '02', Art: SubmarineArt, t: 'Exploration', d: 'Ride along on expeditions, from coral gardens to hydrothermal vents.' },
  { n: '03', Art: OrganismArt, t: 'Organisms', d: 'Meet the glowing jellies, sponges and anemones inspiring new medicine.' },
]

function Expeditions() {
  return (
    <section id="expeditions" data-zone="off" className="relative bg-[linear-gradient(180deg,#1c1580_0%,#170f66_60%,#120a4f_100%)] px-5 pb-6 pt-40 md:px-10 md:pb-9 md:pt-56">
      <div className="mx-auto max-w-6xl text-center">
        <motion.h2 {...fadeUp(0)} className="text-5xl font-medium tracking-[-2px] md:text-7xl lg:text-8xl">
          The ocean has <span className="font-serif font-normal italic text-primary">answers.</span><br className="hidden md:block" /> Are you listening?
        </motion.h2>
        <motion.p {...fadeUp(0.1)} className="mx-auto mb-24 mt-6 max-w-2xl text-lg text-muted-foreground">
          More than 80% of the ocean is still unexplored. Every week we bring back what divers, labs and research partners find down there.
        </motion.p>
        <div className="mb-20 grid gap-12 md:grid-cols-3 md:gap-8">
          {CARDS.map(({ n, Art, t, d }, i) => (
            <motion.div key={t} {...fadeUp(0.1 + i * 0.12)}>
              <TiltCard>
                <span className="absolute right-5 top-4 font-mono text-xs text-muted-foreground">{n}</span>
                <div className="flex justify-center"><Art /></div>
                <h3 className="mt-2 text-base font-semibold">{t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{d}</p>
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
    setO({ x: ((e.clientX - r.left) / r.width - 0.5) * -30, y: ((e.clientY - r.top) / r.height - 0.5) * -30 })
  }
  return (
    <div ref={ref} onMouseMove={move} onMouseLeave={() => setO({ x: 0, y: 0 })}
      className="relative mx-auto aspect-square w-full max-w-[800px] rounded-full border-[14px] border-[#b9a7ff] shadow-[0_0_0_10px_#2a1fae,0_0_120px_rgba(90,120,255,.45),inset_0_0_80px_rgba(0,0,0,.6)] md:border-[22px]">
      <div className="absolute inset-0 overflow-hidden rounded-full">
        <motion.div className="absolute -inset-8" animate={{ x: o.x, y: o.y }} transition={{ type: 'spring', stiffness: 60, damping: 18 }}>
          <UnderwaterScene variant="square" />
          <Bubbles density={36} />
        </motion.div>
        <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(70%_70%_at_30%_25%,rgba(255,255,255,.18),transparent_50%)]" />
      </div>
      {Array.from({ length: 8 }).map((_, i) => (
        <span key={i} className="absolute h-3 w-3 rounded-full bg-[#2a1fae] md:h-4 md:w-4"
          style={{ left: `${50 + 51.5 * Math.cos((i * Math.PI) / 4)}%`, top: `${50 + 51.5 * Math.sin((i * Math.PI) / 4)}%`, transform: 'translate(-50%,-50%)' }} />
      ))}
    </div>
  )
}

function Mission() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start 80%', 'end 60%'] })
  return (
    <section id="mission" data-zone="deep" className="relative bg-[#120a4f] px-5 pb-32 pt-10 md:px-10 md:pb-44">
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
    <section id="lab" data-zone="off" className="relative border-t border-border/30 bg-[linear-gradient(180deg,#120a4f,#0d0738)] px-5 py-32 md:px-10 md:py-44">
      <div className="mx-auto max-w-6xl">
        <motion.p {...fadeUp(0)} className="text-xs uppercase tracking-[3px] text-muted-foreground">The Lab</motion.p>
        <motion.h2 {...fadeUp(0.1)} className="mt-4 text-4xl font-medium tracking-[-1.5px] md:text-6xl">
          The pharmacy beneath the <span className="font-serif font-normal italic text-accent">waves</span>
        </motion.h2>
        <motion.div {...fadeUp(0.2)} className="relative mt-12 aspect-[4/3] overflow-hidden rounded-2xl md:aspect-[3/1]">
          <UnderwaterScene />
          <Bubbles density={28} />
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

function Jelly({ x, y, s, hue, delay }: { x: string; y: string; s: number; hue: number; delay: number }) {
  return (
    <svg className="floaty absolute" style={{ left: x, top: y, width: 90 * s, animationDelay: `${delay}s`, animationDuration: '7s', filter: `drop-shadow(0 0 18px hsl(${hue} 100% 65%))` }} viewBox="0 0 90 140" aria-hidden>
      <path d="M5 50 Q5 5 45 5 Q85 5 85 50 Q75 46 66 52 Q56 45 45 52 Q34 45 24 52 Q15 46 5 50Z" fill={`hsl(${hue} 100% 70% / .55)`} stroke={`hsl(${hue} 100% 80%)`} strokeWidth="2" />
      {[18, 32, 45, 58, 72].map((tx, i) => <path key={i} className="sway" style={{ animationDelay: `${-i * .5}s` }} d={`M${tx} 52 C${tx - 8} 80 ${tx + 8} 105 ${tx} 135`} stroke={`hsl(${hue} 100% 78% / .7)`} strokeWidth="2" fill="none" />)}
    </svg>
  )
}

function CTA() {
  return (
    <section data-zone="abyss" className="relative overflow-hidden border-t border-border/30 bg-[radial-gradient(70%_80%_at_50%_100%,#24127a,#07041f_70%)] px-5 py-32 md:py-44">
      <Bubbles density={70} glow />
      <Jelly x="8%" y="18%" s={1} hue={188} delay={0} />
      <Jelly x="80%" y="12%" s={0.8} hue={320} delay={-2} />
      <Jelly x="70%" y="62%" s={0.6} hue={260} delay={-4} />
      <div className="absolute inset-0 z-[1] bg-background/30" />
      <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center text-center">
        <motion.div {...fadeUp(0)}><Logo size="lg" /></motion.div>
        <motion.h2 {...fadeUp(0.1)} className="mt-6 font-serif text-5xl italic md:text-7xl">Begin Your Descent</motion.h2>
        <motion.p {...fadeUp(0.2)} className="mt-5 text-lg text-muted-foreground">One email a week. Zero noise. Unsubscribe anytime.</motion.p>
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

/* ---------- sound zones: the section at screen centre decides the mix ---------- */
function useSoundZones(active: boolean) {
  useEffect(() => {
    if (!active) return
    const secs = Array.from(document.querySelectorAll<HTMLElement>('[data-zone]'))
    const pick = () => {
      const mid = innerHeight / 2
      const s = secs.find(el => { const r = el.getBoundingClientRect(); return r.top <= mid && r.bottom >= mid })
      ocean.setZone((s?.dataset.zone as Zone) || 'off')
    }
    pick()
    addEventListener('scroll', pick, { passive: true })
    return () => removeEventListener('scroll', pick)
  }, [active])
}

export default function App() {
  const [entered, setEntered] = useState(false)
  const [muted, setMuted] = useState(true)
  useSoundZones(entered)
  useEffect(() => { document.body.style.overflow = entered ? '' : 'hidden' }, [entered])
  useEffect(() => {
    const vis = () => { if (document.hidden) ocean.setMuted(true); else ocean.setMuted(muted) }
    document.addEventListener('visibilitychange', vis)
    return () => document.removeEventListener('visibilitychange', vis)
  }, [muted])

  const enter = (sound: boolean) => {
    setEntered(true); setMuted(!sound)
    if (sound) { ocean.start(); ocean.setMuted(false) }
  }
  const toggle = () => {
    const m = !muted; setMuted(m)
    if (!m) ocean.start()
    ocean.setMuted(m)
  }

  return (
    <div className="grain relative">
      <AnimatePresence>{!entered && <Gate onEnter={enter} />}</AnimatePresence>
      <Navbar muted={muted} toggle={toggle} />
      <DepthGauge />
      <main>
        <Hero />
        <Expeditions />
        <Mission />
        <Lab />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
