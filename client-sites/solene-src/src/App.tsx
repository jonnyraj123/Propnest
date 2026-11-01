import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { ShoppingBag, Search, Heart, ArrowLeft, ArrowRight, Plus, Minus, X, Instagram, Truck, RotateCcw, Sparkles } from 'lucide-react'
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode, type MouseEvent } from 'react'
import { SHADES, M, PRICE, SIZES, NEWS, REVIEWS, type Shade } from './data'

const ease = [0.22, 1, 0.36, 1] as const
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.8, delay, ease },
})

/* ---------------- store: active colour + bag ---------------- */
type Item = { key: string; name: string; shade: string; size: string; price: number; img: string; qty: number }
type Ctx = {
  idx: number; shade: Shade; go: (i: number, from?: { x: number; y: number }) => void
  origin: { x: number; y: number }
  bag: Item[]; add: (it: Omit<Item, 'qty' | 'key'>) => void; setQty: (k: string, q: number) => void
  open: boolean; setOpen: (b: boolean) => void
}
const Store = createContext<Ctx>(null!)
const useStore = () => useContext(Store)

function Provider({ children }: { children: ReactNode }) {
  const [idx, setIdx] = useState(0)
  const [origin, setOrigin] = useState({ x: 50, y: 50 })
  const [bag, setBag] = useState<Item[]>([])
  const [open, setOpen] = useState(false)
  const shade = SHADES[idx]
  useEffect(() => {
    const r = document.documentElement.style
    r.setProperty('--bg', shade.bg); r.setProperty('--ink', shade.ink); r.setProperty('--soft', shade.soft); r.setProperty('--deep', shade.deep); r.setProperty('--text', shade.text); r.setProperty('--onink', shade.onink)
    document.querySelector('meta[name=theme-color]')?.setAttribute('content', `rgb(${shade.bg.split(' ').join(',')})`)
  }, [shade])
  const go = useCallback((i: number, from?: { x: number; y: number }) => {
    setOrigin(from ?? { x: 50, y: 50 }); setIdx((i + SHADES.length) % SHADES.length)
  }, [])
  const add = (it: Omit<Item, 'qty' | 'key'>) => {
    const key = `${it.name}-${it.shade}-${it.size}`
    setBag(b => b.some(x => x.key === key) ? b.map(x => x.key === key ? { ...x, qty: x.qty + 1 } : x) : [...b, { ...it, key, qty: 1 }])
    setOpen(true)
  }
  const setQty = (k: string, q: number) => setBag(b => q <= 0 ? b.filter(x => x.key !== k) : b.map(x => x.key === k ? { ...x, qty: q } : x))
  return <Store.Provider value={{ idx, shade, go, origin, bag, add, setQty, open, setOpen }}>{children}</Store.Provider>
}

const pct = (e: MouseEvent) => ({ x: (e.clientX / innerWidth) * 100, y: (e.clientY / innerHeight) * 100 })

/* ---------------- magnetic button ---------------- */
function Magnetic({ children, className = '', onClick, href }: { children: ReactNode; className?: string; onClick?: (e: MouseEvent) => void; href?: string }) {
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null)
  const move = (e: MouseEvent) => {
    const r = ref.current!.getBoundingClientRect()
    ref.current!.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.22}px, ${(e.clientY - r.top - r.height / 2) * 0.3}px)`
  }
  const leave = () => { ref.current!.style.transform = '' }
  const cls = `inline-flex items-center justify-center gap-2 transition-[transform,background-color,color] duration-300 ease-out ${className}`
  return href
    ? <a ref={ref} href={href} onMouseMove={move} onMouseLeave={leave} className={cls}>{children}</a>
    : <button ref={ref} onClick={onClick} onMouseMove={move} onMouseLeave={leave} className={cls}>{children}</button>
}

/* ---------------- news bar + nav ---------------- */
function NewsBar() {
  const items = ['NEW · The Silk Bow Set in five shades', 'Free worldwide shipping over $150', 'Hand-dyed mulberry silk', 'Easy 30-day returns', 'Members get 10% off the first order']
  const row = [...items, ...items]
  return (
    <div className="tint relative z-50 overflow-hidden bg-tx py-2 text-[11px] font-medium uppercase tracking-[3px] text-soft">
      <div className="marquee flex w-max gap-12 whitespace-nowrap" style={{ ['--d' as string]: '36s' }}>
        {row.map((t, i) => <span key={i} className="flex items-center gap-12">{t}<Sparkles size={11} /></span>)}
      </div>
    </div>
  )
}

function Nav() {
  const { bag, setOpen } = useStore()
  const [solid, setSolid] = useState(false)
  useEffect(() => { const f = () => setSolid(scrollY > 40); f(); addEventListener('scroll', f, { passive: true }); return () => removeEventListener('scroll', f) }, [])
  const n = bag.reduce((s, x) => s + x.qty, 0)
  return (
    <header className={`fixed inset-x-0 top-[34px] z-40 px-4 transition-all duration-500 md:px-10 ${solid ? 'top-3' : ''}`}>
      <nav className={`tint mx-auto flex max-w-[1400px] items-center justify-between rounded-full px-5 py-3 md:px-7 ${solid ? 'glass text-tx' : 'text-ink'}`}>
        <a href="#top" className="serif text-2xl tracking-[6px] md:text-3xl">SOLÈNE</a>
        <div className="hidden items-center gap-8 text-sm font-medium lg:flex">
          {[['Collection', '#edit'], ['Lookbook', '#lookbook'], ['The Set', '#product'], ['Journal', '#journal']].map(([l, h]) => (
            <a key={l} href={h} className="group relative">{l}<span className="absolute -bottom-1 left-0 h-px w-0 bg-current transition-all duration-300 group-hover:w-full" /></a>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <button aria-label="Search" className="hidden h-10 w-10 items-center justify-center rounded-full transition hover:bg-ink/10 sm:flex"><Search size={18} /></button>
          <button aria-label="Wishlist" className="hidden h-10 w-10 items-center justify-center rounded-full transition hover:bg-ink/10 sm:flex"><Heart size={18} /></button>
          <button aria-label="Open bag" onClick={() => setOpen(true)} className="relative flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-ink/10">
            <ShoppingBag size={18} />
            <AnimatePresence>{n > 0 && (
              <motion.span key={n} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-tx px-1 text-[10px] font-bold text-soft">{n}</motion.span>
            )}</AnimatePresence>
          </button>
        </div>
      </nav>
    </header>
  )
}

/* ---------------- HERO: colour world ---------------- */
function Studio() {
  const { shade, origin } = useStore()
  const [layers, setLayers] = useState<{ id: string; k: number; o: { x: number; y: number } }[]>([{ id: shade.id, k: 0, o: origin }])
  useEffect(() => {
    setLayers(l => l[l.length - 1].id === shade.id ? l : [...l.slice(-1), { id: shade.id, k: Date.now(), o: origin }])
  }, [shade.id])
  return (
    <div className="absolute inset-0 overflow-hidden">
      {layers.map((l, i) => (
        <motion.div key={l.k} className="absolute inset-0"
          initial={i === 0 && layers.length === 1 ? false : { clipPath: `circle(0% at ${l.o.x}% ${l.o.y}%)` }}
          animate={{ clipPath: `circle(150% at ${l.o.x}% ${l.o.y}%)` }} transition={{ duration: 1.3, ease: [0.7, 0, 0.2, 1] }}>
          <picture>
            <source media="(max-width: 767px)" srcSet={`${M}studio-${l.id}-m.webp`} />
            <img src={`${M}studio-${l.id}.webp`} alt="" className="breathe h-full w-full object-cover object-[30%_50%]" />
          </picture>
        </motion.div>
      ))}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_60%_60%,transparent_40%,rgba(0,0,0,.18))]" />
      <div className="tint pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgb(var(--bg)/.82)_0%,rgb(var(--bg)/.55)_24%,transparent_46%)] max-md:bg-[linear-gradient(180deg,rgb(var(--bg)/.75)_0%,rgb(var(--bg)/.35)_30%,transparent_50%)]" />
    </div>
  )
}

function BigWord() {
  const { shade } = useStore()
  return (
    <div className="pointer-events-none absolute inset-x-0 top-[33%] z-[2] flex justify-center md:top-[14%]">
      <AnimatePresence mode="popLayout">
        <motion.h2 key={shade.id} className="serif flex text-[30vw] leading-[.8] text-ink/90 md:text-[22vw]"
          initial="i" animate="a" exit="e">
          {shade.word.split('').map((ch, i) => (
            <span key={i} className="inline-block overflow-hidden pb-[.08em]">
              <motion.span className="inline-block" variants={{ i: { y: '105%' }, a: { y: 0, transition: { delay: 0.25 + i * 0.05, duration: 0.9, ease } }, e: { y: '-105%', transition: { delay: i * 0.03, duration: 0.6, ease } } }}>{ch}</motion.span>
            </span>
          ))}
        </motion.h2>
      </AnimatePresence>
    </div>
  )
}

function Hero() {
  const { idx, shade, go, add } = useStore()
  const [paused, setPaused] = useState(false)
  const [dir, setDir] = useState(1)
  const prev = SHADES[(idx + SHADES.length - 1) % SHADES.length]
  const next = SHADES[(idx + 1) % SHADES.length]
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const modelY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const textY = useTransform(scrollYProgress, [0, 1], [0, -120])

  useEffect(() => {
    if (paused) return
    const t = setTimeout(() => { setDir(1); go(idx + 1, { x: 62, y: 55 }) }, 6500)
    return () => clearTimeout(t)
  }, [idx, paused, go])
  const step = (d: number, e?: MouseEvent) => { setDir(d); go(idx + d, e ? pct(e) : undefined) }

  return (
    <section ref={ref} id="top" className="relative h-[100svh] min-h-[640px] overflow-hidden text-ink" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <Studio />
      <BigWord />

      {/* small previous look (left) */}
      <button aria-label={`Show ${prev.name}`} onClick={e => step(-1, e)} className="absolute bottom-[12%] left-[4%] z-[3] hidden w-[9vw] max-w-[150px] opacity-90 transition hover:scale-105 hover:opacity-100 md:block">
        <AnimatePresence mode="popLayout"><motion.img key={prev.id} src={`${M}model-${prev.id}-s.webp`} alt="" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.7, ease }} className="w-full drop-shadow-[0_18px_18px_rgba(0,0,0,.25)]" /></AnimatePresence>
        <span className="mt-2 block text-center text-[10px] font-semibold uppercase tracking-[3px]">← {prev.name}</span>
      </button>
      {/* next look peeking (right) */}
      <button aria-label={`Show ${next.name}`} onClick={e => step(1, e)} className="absolute bottom-[8%] right-[-3%] z-[3] w-[26vw] max-w-[150px] transition hover:right-[-1%] md:right-[-2%] md:w-[13vw] md:max-w-[230px]">
        <AnimatePresence mode="popLayout"><motion.img key={next.id} src={`${M}model-${next.id}-s.webp`} alt="" initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.8, ease }} className="w-full drop-shadow-[0_18px_18px_rgba(0,0,0,.25)]" /></AnimatePresence>
      </button>

      {/* the main model glides in */}
      <motion.div style={{ y: modelY }} className="absolute inset-x-0 bottom-0 z-[4] flex justify-center">
        <div className="relative h-[74svh] w-[min(70vw,520px)] md:h-[90svh] md:w-[min(36vw,560px)]">
          <div className="absolute bottom-[1%] left-1/2 h-8 w-[70%] -translate-x-1/2 rounded-[50%] bg-black/30 blur-xl" />
          <AnimatePresence initial={false} custom={dir} mode="popLayout">
            <motion.img key={shade.id} src={`${M}model-${shade.id}.webp`} alt={`Model wearing the Silk Bow Set in ${shade.name}`}
              custom={dir}
              variants={{
                enter: (d: number) => ({ x: d > 0 ? '70%' : '-70%', opacity: 0, scale: 0.86, filter: 'blur(6px)' }),
                center: { x: 0, opacity: 1, scale: 1, filter: 'blur(0px)', transition: { duration: 1.1, ease, delay: 0.15 } },
                exit: (d: number) => ({ x: d > 0 ? '-60%' : '60%', opacity: 0, scale: 0.8, filter: 'blur(6px)', transition: { duration: 0.8, ease } }),
              }}
              initial="enter" animate="center" exit="exit"
              className="sway absolute bottom-0 left-1/2 h-full w-auto max-w-none -translate-x-1/2 object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,.28)]" />
          </AnimatePresence>
        </div>
      </motion.div>

      {/* copy column */}
      <motion.div style={{ y: textY }} className="absolute left-0 right-0 top-[118px] z-[5] px-5 md:left-10 md:right-auto md:top-[22%] md:w-[30vw] md:max-w-[420px] md:px-0 lg:left-16">
        <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[3px]">
          <span>The Silk Bow Set</span><span className="h-px w-8 bg-current" /><span>{String(idx + 1).padStart(2, '0')} / {String(SHADES.length).padStart(2, '0')}</span>
        </div>
        <div className="mt-3 h-[2.1em] overflow-hidden text-[40px] leading-[1.02] md:mt-5 md:text-[58px]">
          <AnimatePresence mode="popLayout">
            <motion.h1 key={shade.id} className="serif" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '-110%' }} transition={{ duration: 0.9, ease }}>
              {shade.line[0]}<br /><em>{shade.line[1]}</em>
            </motion.h1>
          </AnimatePresence>
        </div>
        <p className="mt-4 hidden max-w-sm text-[15px] leading-relaxed opacity-80 md:block">Mulberry silk blouse with a tie-it-your-way bow and fluid wide-leg trousers. One cut, five moods.</p>
        <div className="mt-5 hidden items-center gap-3 md:flex">
          <Magnetic onClick={() => add({ name: 'Silk Bow Set', shade: shade.name, size: 'M', price: PRICE, img: `${M}model-${shade.id}-s.webp` })} className="tint rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-onink">
            Add to bag — ${PRICE}
          </Magnetic>
          <Magnetic href="#product" className="glass rounded-full px-6 py-3.5 text-sm font-semibold">Details</Magnetic>
        </div>
      </motion.div>

      {/* swatches + progress */}
      <div className="absolute inset-x-0 bottom-5 z-[6] flex items-end justify-between gap-4 px-5 md:bottom-8 md:px-10 lg:px-16">
        <div className="glass flex items-center gap-1.5 rounded-full p-1.5">
          {SHADES.map((s, i) => (
            <button key={s.id} aria-label={s.name} onClick={e => { setDir(i >= idx ? 1 : -1); go(i, pct(e)) }}
              className={`relative flex h-9 items-center gap-2 rounded-full pl-1.5 transition-all duration-500 ${i === idx ? 'bg-white/70 pr-3.5 text-[#1b1b1b]' : 'pr-1.5'}`}>
              <span className="h-6 w-6 rounded-full border-2 border-white/80 shadow" style={{ background: s.hex }} />
              {i === idx && <span className="hidden text-xs font-semibold sm:inline">{s.name}</span>}
              {i === idx && !paused && <motion.span key={idx} className="absolute bottom-0.5 left-3 right-3 h-[2px] origin-left rounded bg-[#1b1b1b]/60" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 6.5, ease: 'linear' }} />}
            </button>
          ))}
        </div>
        <div className="hidden gap-2 md:flex">
          <button aria-label="Previous colour" onClick={e => step(-1, e)} className="glass flex h-12 w-12 items-center justify-center rounded-full transition hover:scale-105"><ArrowLeft size={18} /></button>
          <button aria-label="Next colour" onClick={e => step(1, e)} className="glass flex h-12 w-12 items-center justify-center rounded-full transition hover:scale-105"><ArrowRight size={18} /></button>
        </div>
      </div>
      <button onClick={() => add({ name: 'Silk Bow Set', shade: shade.name, size: 'M', price: PRICE, img: `${M}model-${shade.id}-s.webp` })}
        className="tint absolute bottom-[78px] left-5 z-[6] rounded-full bg-ink px-5 py-3 text-xs font-semibold text-onink md:hidden">Add to bag — ${PRICE}</button>
    </section>
  )
}

/* ---------------- The Colour Edit ---------------- */
function TiltCard({ s, i }: { s: Shade; i: number }) {
  const { go, add, idx } = useStore()
  const ref = useRef<HTMLDivElement>(null)
  const move = (e: MouseEvent) => {
    const r = ref.current!.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5
    ref.current!.style.transform = `perspective(1000px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`
  }
  return (
    <motion.div {...fadeUp(i * 0.08)} className="w-[72vw] shrink-0 snap-center sm:w-auto">
      <div ref={ref} onMouseMove={move} onMouseLeave={() => { ref.current!.style.transform = '' }}
        className="group relative aspect-[3/4.2] overflow-hidden rounded-[28px] transition-transform duration-300 will-change-transform">
        <img src={`${M}studio-${s.id}-m.webp`} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] group-hover:scale-110" />
        <img src={`${M}model-${s.id}-s.webp`} alt={`Silk Bow Set in ${s.name}`} loading="lazy" className="absolute bottom-0 left-1/2 h-[92%] w-auto max-w-none -translate-x-1/2 drop-shadow-[0_20px_20px_rgba(0,0,0,.25)] transition-transform duration-700 ease-out group-hover:-translate-y-3 group-hover:scale-[1.04]" />
        <span className="absolute left-4 top-4 rounded-full bg-white/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[2px] text-[#1b1b1b]">{i === 0 ? 'Bestseller' : i === 3 ? 'New' : s.name}</span>
        <div className="absolute inset-x-3 bottom-3 flex translate-y-2 items-center justify-between gap-2 opacity-100 transition duration-500 md:translate-y-6 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
          <button onClick={e => { go(i, pct(e)); scrollTo({ top: 0, behavior: 'smooth' }) }} className="glass flex-1 rounded-full py-2.5 text-xs font-semibold text-white">View in studio</button>
          <button aria-label={`Add ${s.name} to bag`} onClick={() => add({ name: 'Silk Bow Set', shade: s.name, size: 'M', price: PRICE, img: `${M}model-${s.id}-s.webp` })} className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#1b1b1b] transition hover:scale-110"><Plus size={18} /></button>
        </div>
      </div>
      <div className="mt-4 flex items-start justify-between px-1">
        <div>
          <h3 className="text-[15px] font-semibold">Silk Bow Set — {s.name}</h3>
          <p className="mt-0.5 text-sm opacity-60">Blouse + wide-leg trousers</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`h-3 w-3 rounded-full ring-2 ring-offset-2 ring-offset-soft transition ${idx === i ? 'ring-tx' : 'ring-transparent'}`} style={{ background: s.hex }} />
          <span className="text-[15px] font-semibold">${PRICE}</span>
        </div>
      </div>
    </motion.div>
  )
}

function Edit() {
  return (
    <section id="edit" className="tint relative bg-soft px-0 py-24 text-tx md:px-10 md:py-32 lg:px-16">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col items-start justify-between gap-4 px-5 md:flex-row md:items-end md:px-0">
          <div>
            <motion.p {...fadeUp()} className="text-[11px] font-semibold uppercase tracking-[3px] opacity-70">The colour edit</motion.p>
            <motion.h2 {...fadeUp(0.08)} className="serif mt-3 text-5xl leading-[1] md:text-7xl">Hottest picks <em>of the season</em></motion.h2>
          </div>
          <motion.p {...fadeUp(0.16)} className="max-w-sm text-[15px] leading-relaxed opacity-75">Choose a shade and watch the whole house change colour with you. Every piece is cut from the same soft mulberry silk.</motion.p>
        </div>
        <div className="mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:none] sm:grid sm:grid-cols-3 sm:overflow-visible md:px-0 lg:grid-cols-5 lg:gap-5">
          {SHADES.map((s, i) => <TiltCard key={s.id} s={s} i={i} />)}
        </div>
      </div>
    </section>
  )
}

/* ---------------- Lookbook: runway video opens up on scroll ---------------- */
function Lookbook() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  const inset = useTransform(p, [0, 0.75], [14, 0])
  const radius = useTransform(p, [0, 0.75], [40, 0])
  const clip = useTransform([inset, radius], ([i, r]) => `inset(${i}% ${i}% ${i}% ${i}% round ${r}px)`)
  const scale = useTransform(p, [0, 0.75], [1.25, 1])
  const cap = useTransform(p, [0.55, 0.85], [0, 1])
  return (
    <section ref={ref} id="lookbook" className="tint relative h-[200vh] bg-soft">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.div style={{ clipPath: clip }} className="absolute inset-0">
          <motion.video style={{ scale }} className="h-full w-full object-cover" autoPlay muted loop playsInline poster={`${M}runway.jpg`}>
            <source src={`${M}runway.webm`} type="video/webm" />
            <source src={`${M}runway.mp4`} type="video/mp4" />
          </motion.video>
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />
        </motion.div>
        <motion.div style={{ opacity: cap }} className="absolute inset-x-0 bottom-[10%] z-10 px-6 text-center text-white">
          <p className="text-[11px] font-semibold uppercase tracking-[4px]">Lookbook · Autumn 2026</p>
          <h2 className="serif mt-3 text-5xl md:text-8xl">Walk in <em>colour.</em></h2>
          <Magnetic href="#product" className="mt-7 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-[#1b1b1b]">Shop the look</Magnetic>
        </motion.div>
      </div>
    </section>
  )
}

/* ---------------- Product detail ---------------- */
function Product() {
  const { idx, shade, go, add } = useStore()
  const [size, setSize] = useState('M')
  const [qty, setQty] = useState(1)
  const [tab, setTab] = useState(0)
  const acc = [
    { id: 'bag', name: 'Mini Top-Handle Bag', price: 165, img: `${M}bag.webp` },
    { id: 'sandals', name: 'Ankle-Strap Sandals', price: 129, img: `${M}sandals.webp` },
  ]
  const tabs = [
    ['Details', 'Mulberry silk blouse, 19 momme, with a long bow you can tie three ways. High-waist wide-leg trousers with front pleats and side pockets.'],
    ['Fit', 'True to size, relaxed through the body. Model is 175 cm and wears size S.'],
    ['Delivery', 'Free worldwide shipping over $150. Dispatched in 1–2 days. Free 30-day returns.'],
  ]
  return (
    <section id="product" className="tint relative overflow-hidden bg-soft py-24 text-tx md:py-32">
      <div className="mx-auto grid max-w-[1400px] items-center gap-10 px-5 md:px-10 lg:grid-cols-[1fr_1.15fr_1fr] lg:gap-8 lg:px-16">
        {/* left: title + accessories */}
        <div className="order-2 lg:order-1">
          <motion.p {...fadeUp()} className="text-[11px] font-semibold uppercase tracking-[3px] opacity-70">The set</motion.p>
          <motion.h2 {...fadeUp(0.08)} className="serif mt-3 text-5xl leading-[1] md:text-6xl">{shade.name} Silk<br /><em>Bow Set</em></motion.h2>
          <motion.p {...fadeUp(0.14)} className="mt-4 max-w-sm text-[15px] leading-relaxed opacity-75">Complete the look with pieces dyed to match.</motion.p>
          <div className="mt-8 grid grid-cols-2 gap-3">
            {acc.map((a, i) => (
              <motion.div key={a.id} {...fadeUp(0.2 + i * 0.08)} className="group rounded-3xl bg-white/70 p-3 shadow-[0_20px_40px_-25px_rgba(0,0,0,.35)] backdrop-blur">
                <div className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-white">
                  <img src={a.img} alt={a.name} loading="lazy" className="floaty w-[88%] transition-transform duration-700 group-hover:scale-110" style={{ animationDelay: `${-i * 1.6}s` }} />
                </div>
                <p className="mt-3 text-[13px] font-semibold leading-tight">{a.name}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm font-semibold">${a.price}</span>
                  <button aria-label={`Add ${a.name}`} onClick={() => add({ name: a.name, shade: 'Butter', size: 'One size', price: a.price, img: a.img })} className="tint flex h-8 w-8 items-center justify-center rounded-full bg-tx text-soft transition hover:scale-110"><Plus size={15} /></button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* centre: model on its studio */}
        <motion.div {...fadeUp(0.1)} className="relative order-1 aspect-[4/5] overflow-hidden rounded-[36px] lg:order-2">
          <AnimatePresence mode="popLayout">
            <motion.img key={shade.id + 'b'} src={`${M}studio-${shade.id}-m.webp`} alt="" className="absolute inset-0 h-full w-full object-cover object-[20%_50%]"
              initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1, ease }} />
          </AnimatePresence>
          <AnimatePresence mode="popLayout">
            <motion.img key={shade.id} src={`${M}model-${shade.id}.webp`} alt={`Silk Bow Set in ${shade.name}`}
              className="absolute bottom-0 left-1/2 h-[94%] w-auto max-w-none -translate-x-1/2 drop-shadow-[0_30px_30px_rgba(0,0,0,.3)]"
              initial={{ opacity: 0, y: 60, rotateY: 35 }} animate={{ opacity: 1, y: 0, rotateY: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.9, ease }} />
          </AnimatePresence>
          <div className="glass absolute left-4 top-4 rounded-full px-4 py-2 text-xs font-semibold text-white">★ 4.9 · 312 reviews</div>
        </motion.div>

        {/* right: buy box */}
        <div className="order-3">
          <motion.div {...fadeUp(0.1)} className="flex items-baseline gap-3">
            <span className="text-4xl font-semibold">${PRICE}</span><span className="text-sm line-through opacity-50">$310</span>
            <span className="tint rounded-full bg-tx px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-soft">-20%</span>
          </motion.div>
          <motion.p {...fadeUp(0.14)} className="mt-4 text-[15px] leading-relaxed opacity-75">A fluid two-piece in pure mulberry silk. Dressed up with heels, dressed down with sneakers — always effortless.</motion.p>

          <motion.div {...fadeUp(0.18)} className="mt-7">
            <p className="text-xs font-semibold uppercase tracking-[2px]">Colour — {shade.name}</p>
            <div className="mt-3 flex gap-2.5">
              {SHADES.map((s, i) => (
                <button key={s.id} aria-label={s.name} onClick={e => go(i, pct(e))}
                  className={`h-9 w-9 rounded-full ring-2 ring-offset-2 ring-offset-soft transition ${i === idx ? 'scale-110 ring-tx' : 'ring-transparent hover:scale-105'}`} style={{ background: s.hex }} />
              ))}
            </div>
          </motion.div>

          <motion.div {...fadeUp(0.22)} className="mt-7">
            <div className="flex items-center justify-between"><p className="text-xs font-semibold uppercase tracking-[2px]">Size</p><a href="#product" className="text-xs underline opacity-70">Size guide</a></div>
            <div className="mt-3 flex gap-2">
              {SIZES.map(s => (
                <button key={s} onClick={() => setSize(s)} className={`tint h-11 w-11 rounded-full border text-sm font-semibold transition ${size === s ? 'border-tx bg-tx text-soft' : 'border-tx/25 hover:border-tx'}`}>{s}</button>
              ))}
            </div>
          </motion.div>

          <motion.div {...fadeUp(0.26)} className="mt-8 flex gap-3">
            <div className="flex items-center rounded-full border border-tx/25">
              <button aria-label="Less" onClick={() => setQty(q => Math.max(1, q - 1))} className="flex h-12 w-11 items-center justify-center"><Minus size={15} /></button>
              <span className="w-6 text-center font-semibold">{qty}</span>
              <button aria-label="More" onClick={() => setQty(q => q + 1)} className="flex h-12 w-11 items-center justify-center"><Plus size={15} /></button>
            </div>
            <Magnetic onClick={() => { for (let k = 0; k < qty; k++) add({ name: 'Silk Bow Set', shade: shade.name, size, price: PRICE, img: `${M}model-${shade.id}-s.webp` }) }}
              className="tint flex-1 rounded-full bg-tx py-3.5 text-sm font-semibold text-soft">Add to bag</Magnetic>
          </motion.div>

          <motion.div {...fadeUp(0.3)} className="mt-6 flex gap-5 text-xs font-medium opacity-75">
            <span className="flex items-center gap-1.5"><Truck size={15} /> Free shipping</span>
            <span className="flex items-center gap-1.5"><RotateCcw size={15} /> 30-day returns</span>
          </motion.div>

          <motion.div {...fadeUp(0.34)} className="mt-8 border-t border-tx/15 pt-5">
            <div className="flex gap-5 text-sm font-semibold">
              {tabs.map(([t], i) => <button key={t} onClick={() => setTab(i)} className={`pb-1 transition ${tab === i ? 'border-b-2 border-tx' : 'opacity-50'}`}>{t}</button>)}
            </div>
            <AnimatePresence mode="wait">
              <motion.p key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3 }} className="mt-3 text-sm leading-relaxed opacity-75">{tabs[tab][1]}</motion.p>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ---------------- Journal (news) ---------------- */
function Journal() {
  return (
    <section id="journal" className="tint bg-soft px-5 py-24 text-tx md:px-10 md:py-32 lg:px-16">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex items-end justify-between gap-4">
          <div>
            <motion.p {...fadeUp()} className="text-[11px] font-semibold uppercase tracking-[3px] opacity-70">Journal</motion.p>
            <motion.h2 {...fadeUp(0.08)} className="serif mt-3 text-5xl md:text-7xl">News from <em>the atelier</em></motion.h2>
          </div>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {NEWS.map((n, i) => (
            <motion.a key={n.title} href="#journal" {...fadeUp(i * 0.1)} className="group block">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[24px]">
                <img src={`${M}studio-${n.shade}-m.webp`} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-[1.2s] group-hover:scale-110" />
                <img src={`${M}model-${n.shade}-s.webp`} alt="" loading="lazy" className="absolute bottom-0 right-[8%] h-[95%] w-auto transition-transform duration-700 group-hover:-translate-y-2" />
                <span className="absolute left-4 top-4 rounded-full bg-white/85 px-3 py-1 text-[10px] font-bold uppercase tracking-[2px] text-[#1b1b1b]">{n.tag}</span>
              </div>
              <p className="mt-5 text-xs font-medium opacity-60">{n.date}</p>
              <h3 className="mt-2 text-xl font-semibold leading-snug transition group-hover:opacity-70">{n.title}</h3>
              <p className="mt-2 text-sm leading-relaxed opacity-70">{n.body}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold">Read story <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" /></span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------- Reviews marquee ---------------- */
function Reviews() {
  const Card = ({ r }: { r: string[] }) => (
    <div className="w-[300px] shrink-0 rounded-[22px] bg-white/75 p-5 shadow-[0_20px_40px_-28px_rgba(0,0,0,.35)] md:w-[360px]">
      <div className="text-sm tracking-[2px]">★★★★★</div>
      <p className="mt-3 text-[15px] leading-relaxed">“{r[2]}”</p>
      <div className="mt-4 flex items-center gap-3">
        <span className="tint flex h-9 w-9 items-center justify-center rounded-full bg-bg text-xs font-bold text-ink">{r[0].split(' ').map(w => w[0]).join('')}</span>
        <div><p className="text-sm font-semibold">{r[0]}</p><p className="text-xs opacity-60">{r[1]} · Verified buyer</p></div>
      </div>
    </div>
  )
  const a = REVIEWS.slice(0, 4), b = REVIEWS.slice(4)
  return (
    <section className="tint pause-hover overflow-hidden bg-soft py-24 text-tx md:py-28">
      <div className="px-5 text-center">
        <motion.p {...fadeUp()} className="text-[11px] font-semibold uppercase tracking-[3px] opacity-70">4.9 / 5 from 2,400+ women</motion.p>
        <motion.h2 {...fadeUp(0.08)} className="serif mt-3 text-5xl md:text-7xl">Loved by <em>our customers</em></motion.h2>
      </div>
      <div className="mt-12 space-y-4 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        <div className="marquee flex w-max gap-4" style={{ ['--d' as string]: '55s' }}>{[...a, ...a, ...a, ...a].map((r, i) => <Card key={i} r={r} />)}</div>
        <div className="marquee-rev flex w-max gap-4" style={{ ['--d' as string]: '60s' }}>{[...b, ...b, ...b, ...b].map((r, i) => <Card key={i} r={r} />)}</div>
      </div>
    </section>
  )
}

/* ---------------- Newsletter + footer ---------------- */
function Footer() {
  const [done, setDone] = useState(false)
  const { shade } = useStore()
  return (
    <footer className="tint relative overflow-hidden bg-deep text-soft">
      <div className="relative mx-auto max-w-[1400px] px-5 pb-10 pt-24 md:px-10 lg:px-16">
        <div className="grid items-end gap-10 md:grid-cols-2">
          <div>
            <h2 className="serif text-5xl leading-[1] md:text-7xl">Join the <em>colour club</em></h2>
            <p className="mt-4 max-w-md opacity-75">New shades, early access and 10% off your first order. One email a week, never more.</p>
          </div>
          <form onSubmit={e => { e.preventDefault(); setDone(true) }} className="flex w-full items-center rounded-full bg-white/10 p-1.5 ring-1 ring-white/20 backdrop-blur">
            <input type="email" required aria-label="Email" placeholder={done ? 'Welcome to the club ✦' : 'Your email address'} className="min-w-0 flex-1 bg-transparent px-5 text-sm placeholder:text-soft/60 focus:outline-none" />
            <button className="rounded-full bg-soft px-6 py-3 text-sm font-semibold text-deep transition hover:scale-[1.03]">{done ? 'Joined' : 'Subscribe'}</button>
          </form>
        </div>
        <div className="mt-20 grid gap-10 border-t border-white/15 pt-10 text-sm sm:grid-cols-2 md:grid-cols-4">
          <div>
            <p className="serif text-3xl tracking-[6px]">SOLÈNE</p>
            <p className="mt-3 max-w-[220px] opacity-70">Silk pieces in colours that feel like you. Designed with care, made to last.</p>
          </div>
          {[['Shop', ['The Silk Bow Set', 'Accessories', 'Gift cards', 'New in']], ['Help', ['Shipping', 'Returns', 'Size guide', 'Contact']], ['House', ['Our story', 'Journal', 'Care guide', 'Stockists']]].map(([h, ls]) => (
            <div key={h as string}>
              <p className="font-semibold">{h}</p>
              <ul className="mt-3 space-y-2 opacity-70">{(ls as string[]).map(l => <li key={l}><a href="#top" className="hover:opacity-100 hover:underline">{l}</a></li>)}</ul>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-col items-start justify-between gap-4 text-xs opacity-60 sm:flex-row sm:items-center">
          <p>© 2026 SOLÈNE. All rights reserved. Now showing: {shade.name}.</p>
          <div className="flex items-center gap-4"><Instagram size={16} /><span>Privacy</span><span>Terms</span></div>
        </div>
      </div>
      <p aria-hidden className="serif pointer-events-none select-none whitespace-nowrap text-center text-[24vw] leading-[.75] opacity-10">SOLÈNE</p>
    </footer>
  )
}

/* ---------------- bag drawer ---------------- */
function Bag() {
  const { bag, setQty, open, setOpen } = useStore()
  const [placed, setPlaced] = useState(false)
  const total = bag.reduce((s, x) => s + x.price * x.qty, 0)
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : '' }, [open])
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setOpen(false); setPlaced(false) }} />
          <motion.aside className="tint fixed bottom-0 right-0 top-0 z-[85] flex w-full max-w-[420px] flex-col bg-soft text-tx shadow-2xl"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ duration: 0.6, ease }}>
            <div className="flex items-center justify-between border-b border-tx/10 px-6 py-5">
              <p className="serif text-3xl">Your bag</p>
              <button aria-label="Close bag" onClick={() => { setOpen(false); setPlaced(false) }} className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-tx/10"><X size={18} /></button>
            </div>
            {placed ? (
              <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                <p className="serif text-4xl">Thank you ✦</p>
                <p className="mt-3 opacity-70">This is a demo store, so no payment was taken. Your order would be on its way!</p>
              </div>
            ) : bag.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-8 text-center opacity-70"><ShoppingBag size={36} /><p className="mt-3">Your bag is empty.</p></div>
            ) : (
              <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
                {bag.map(it => (
                  <motion.div layout key={it.key} className="flex gap-4 rounded-2xl bg-white/70 p-3">
                    <div className="flex h-24 w-20 shrink-0 items-end justify-center overflow-hidden rounded-xl bg-bg/60"><img src={it.img} alt="" className="h-full object-contain" /></div>
                    <div className="flex flex-1 flex-col">
                      <p className="text-sm font-semibold">{it.name}</p>
                      <p className="text-xs opacity-60">{it.shade} · {it.size}</p>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-2 rounded-full border border-tx/20 px-1">
                          <button aria-label="Less" onClick={() => setQty(it.key, it.qty - 1)} className="p-1.5"><Minus size={13} /></button>
                          <span className="text-sm font-semibold">{it.qty}</span>
                          <button aria-label="More" onClick={() => setQty(it.key, it.qty + 1)} className="p-1.5"><Plus size={13} /></button>
                        </div>
                        <span className="text-sm font-semibold">${it.price * it.qty}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
            {!placed && bag.length > 0 && (
              <div className="border-t border-tx/10 px-6 py-5">
                <div className="flex justify-between text-sm"><span className="opacity-70">Shipping</span><span>{total >= 150 ? 'Free' : '$12'}</span></div>
                <div className="mt-2 flex justify-between text-lg font-semibold"><span>Total</span><span>${total + (total >= 150 ? 0 : 12)}</span></div>
                <button onClick={() => setPlaced(true)} className="tint mt-4 w-full rounded-full bg-tx py-4 text-sm font-semibold text-soft transition hover:opacity-90">Checkout</button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

/* ---------------- intro ---------------- */
function Intro() {
  const [gone, setGone] = useState(false)
  useEffect(() => { const t = setTimeout(() => setGone(true), 1900); return () => clearTimeout(t) }, [])
  return (
    <AnimatePresence>
      {!gone && (
        <motion.div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#eef0e4]" exit={{ clipPath: 'inset(0 0 100% 0)' }} transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}>
          <div className="overflow-hidden">
            <motion.p className="serif text-6xl tracking-[10px] text-[#18210f] md:text-8xl" initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 0.9, ease }}>SOLÈNE</motion.p>
          </div>
          <div className="absolute bottom-10 flex gap-2">
            {SHADES.map((s, i) => <motion.span key={s.id} className="h-2 w-8 rounded-full" style={{ background: s.hex }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.3 + i * 0.1, duration: 0.5, ease }} />)}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function App() {
  useEffect(() => { SHADES.forEach(s => { [`studio-${s.id}.webp`, `model-${s.id}.webp`].forEach(f => { const i = new Image(); i.src = M + f }) }) }, [])
  return (
    <Provider>
      <div className="grain">
        <Intro />
        <NewsBar />
        <Nav />
        <main>
          <Hero />
          <Edit />
          <Lookbook />
          <Product />
          <Journal />
          <Reviews />
        </main>
        <Footer />
        <Bag />
      </div>
    </Provider>
  )
}
