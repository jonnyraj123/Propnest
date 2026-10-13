import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Crown, MapPin, MessageCircle, Phone } from 'lucide-react'
import AboutSection from './components/AboutSection'
import ApproachSection from './components/ApproachSection'
import RitualSection from './components/RitualSection'
import ServicesSection from './components/ServicesSection'
import VisitSection from './components/VisitSection'
import { salon, services, videos, whatsappLink } from './content'

const FADE_MS = 500
const FADE_OUT_BEFORE_END = 0.55

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 24, filter: 'blur(8px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] },
})

export default function Index() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [service, setService] = useState<string>(services[4].tag)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    let frame = 0
    let restartTimer = 0
    let fadingOut = false

    const fadeTo = (target: number) => {
      cancelAnimationFrame(frame)
      const from = parseFloat(video.style.opacity || '0')
      const start = performance.now()
      const step = (now: number) => {
        const t = Math.min((now - start) / FADE_MS, 1)
        video.style.opacity = String(from + (target - from) * t)
        if (t < 1) frame = requestAnimationFrame(step)
      }
      frame = requestAnimationFrame(step)
    }

    const handleCanPlay = () => {
      video.play().catch(() => {})
      fadeTo(1)
    }

    const handleTimeUpdate = () => {
      if (!video.duration || fadingOut) return
      if (video.duration - video.currentTime <= FADE_OUT_BEFORE_END) {
        fadingOut = true
        fadeTo(0)
      }
    }

    const handleEnded = () => {
      cancelAnimationFrame(frame)
      video.style.opacity = '0'
      restartTimer = window.setTimeout(() => {
        video.currentTime = 0
        video.play().catch(() => {})
        fadingOut = false
        fadeTo(1)
      }, 100)
    }

    video.style.opacity = '0'
    video.addEventListener('canplay', handleCanPlay, { once: true })
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('ended', handleEnded)

    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(restartTimer)
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('ended', handleEnded)
    }
  }, [])

  return (
    <div className="bg-ink">
      <section className="min-h-screen overflow-hidden relative flex flex-col">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover object-bottom"
          style={{ opacity: 0 }}
          src={videos.hero}
          muted
          autoPlay
          playsInline
          preload="auto"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/50 via-ink/10 to-ink pointer-events-none" />

        <nav className="relative z-20 px-6 py-6">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="liquid-glass rounded-full max-w-5xl mx-auto px-6 py-3 flex items-center justify-between"
          >
            <a href="#top" className="flex items-center gap-2">
              <Crown size={22} className="text-champagne" />
              <span className="text-white font-serif text-2xl leading-none">{salon.name}</span>
            </a>
            <div className="hidden md:flex items-center gap-8">
              {[
                ['Services', '#services'],
                ['Bridal', '#bridal'],
                ['Visit', '#visit'],
              ].map(([label, href]) => (
                <a key={href} href={href} className="text-white/80 hover:text-white text-sm font-medium">
                  {label}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <a href={`tel:${salon.phoneTel}`} className="hidden sm:inline text-white text-sm font-medium">
                Call us
              </a>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noreferrer"
                className="liquid-glass rounded-full px-6 py-2 text-champagne text-sm font-medium hover:bg-white/5 transition-colors"
              >
                Book
              </a>
            </div>
          </motion.div>
        </nav>

        <div
          id="top"
          className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center -translate-y-[12%]"
        >
          <motion.p {...rise(0.2)} className="text-champagne/80 text-xs md:text-sm tracking-[0.3em] uppercase mb-6">
            Beauty Salon · {salon.area}
          </motion.p>

          <motion.h1
            {...rise(0.35)}
            className="font-serif text-7xl md:text-8xl lg:text-9xl text-white tracking-tight leading-[0.95]"
          >
            Made to <em className="italic text-shimmer pr-2">glow</em>
          </motion.h1>

          <motion.form
            {...rise(0.55)}
            className="max-w-xl w-full mt-10"
            onSubmit={(e) => {
              e.preventDefault()
              window.open(whatsappLink(service), '_blank', 'noopener')
            }}
          >
            <div className="liquid-glass rounded-full pl-6 pr-2 py-2 flex items-center gap-3">
              <label htmlFor="service" className="sr-only">
                Choose a service
              </label>
              <select
                id="service"
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="flex-1 min-w-0 bg-transparent outline-none text-white text-left appearance-none cursor-pointer"
              >
                {services.map((s) => (
                  <option key={s.key} value={s.tag} className="bg-ink text-white">
                    {s.tag} · {s.title}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                aria-label="Book on WhatsApp"
                className="bg-champagne rounded-full pl-4 pr-5 py-3 text-ink flex items-center gap-2 text-sm font-medium hover:bg-white transition-colors"
              >
                <MessageCircle size={18} />
                <span className="hidden sm:inline">Book on WhatsApp</span>
              </button>
            </div>
          </motion.form>

          <motion.p {...rise(0.7)} className="text-white/80 text-sm leading-relaxed px-4 mt-6 max-w-lg">
            Hair, beauty, nails, body care and bridal makeovers in the heart of Karama. Pick a service and book your
            visit on WhatsApp in one tap.
          </motion.p>

          <motion.a
            {...rise(0.85)}
            href="#bridal"
            className="liquid-glass rounded-full px-8 py-3 text-white text-sm font-medium hover:bg-white/5 transition-colors mt-8"
          >
            Bridal packages
          </motion.a>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.1 }}
          className="relative z-10 flex justify-center gap-4 pb-12"
        >
          {[
            { Icon: MessageCircle, label: 'WhatsApp', href: whatsappLink() },
            { Icon: Phone, label: 'Call', href: `tel:${salon.phoneTel}` },
            { Icon: MapPin, label: 'Directions', href: salon.mapsUrl },
          ].map(({ Icon, label, href }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel="noreferrer"
              aria-label={label}
              className="liquid-glass rounded-full p-4 text-white/80 hover:text-champagne hover:bg-white/5 transition-all"
            >
              <Icon size={20} />
            </a>
          ))}
        </motion.div>
      </section>

      <AboutSection />
      <ApproachSection />
      <RitualSection />
      <ServicesSection />
      <VisitSection />
    </div>
  )
}
