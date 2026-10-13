import { useEffect, useRef } from 'react'
import { ArrowRight, Globe, Instagram, Twitter } from 'lucide-react'
import AboutSection from './components/AboutSection'
import FeaturedVideoSection from './components/FeaturedVideoSection'
import PhilosophySection from './components/PhilosophySection'
import ServicesSection from './components/ServicesSection'

const HERO_VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_074625_a81f018a-956b-43fb-9aee-4d1508e30e6a.mp4'
const FADE_MS = 500
const FADE_OUT_BEFORE_END = 0.55

export default function Index() {
  const videoRef = useRef<HTMLVideoElement>(null)

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
    <div className="bg-black">
      <section className="min-h-screen overflow-hidden relative flex flex-col">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover object-bottom"
          style={{ opacity: 0 }}
          src={HERO_VIDEO}
          muted
          autoPlay
          playsInline
          preload="auto"
        />

        <nav className="relative z-20 px-6 py-6">
          <div className="liquid-glass rounded-full max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
            <div className="flex items-center">
              <Globe size={24} className="text-white" />
              <span className="text-white font-semibold text-lg ml-2">Propnest</span>
              <div className="hidden md:flex items-center gap-8 ml-8">
                {['Features', 'Pricing', 'About'].map((link) => (
                  <a key={link} href="#" className="text-white/80 hover:text-white text-sm font-medium">
                    {link}
                  </a>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button type="button" className="text-white text-sm font-medium">Sign Up</button>
              <button type="button" className="liquid-glass rounded-full px-6 py-2 text-white text-sm font-medium">
                Login
              </button>
            </div>
          </div>
        </nav>

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center -translate-y-[20%]">
          <h1
            className="text-7xl md:text-8xl lg:text-9xl text-white tracking-tight whitespace-nowrap"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            Know it <em className="italic">all</em>
          </h1>

          <form
            className="max-w-xl w-full mt-10"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="liquid-glass rounded-full pl-6 pr-2 py-2 flex items-center gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                aria-label="Email address"
                className="flex-1 min-w-0 bg-transparent outline-none text-white placeholder:text-white/40"
              />
              <button type="submit" aria-label="Subscribe" className="bg-white rounded-full p-3 text-black">
                <ArrowRight size={20} />
              </button>
            </div>
          </form>

          <p className="text-white text-sm leading-relaxed px-4 mt-6 max-w-xl">
            Stay updated with the latest news and insights. Subscribe to our newsletter today and never miss out on
            exciting updates.
          </p>

          <button
            type="button"
            className="liquid-glass rounded-full px-8 py-3 text-white text-sm font-medium hover:bg-white/5 transition-colors mt-8"
          >
            Manifesto
          </button>
        </div>

        <div className="relative z-10 flex justify-center gap-4 pb-12">
          {[
            { Icon: Instagram, label: 'Instagram' },
            { Icon: Twitter, label: 'Twitter' },
            { Icon: Globe, label: 'Website' },
          ].map(({ Icon, label }) => (
            <button
              key={label}
              type="button"
              aria-label={label}
              className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all"
            >
              <Icon size={20} />
            </button>
          ))}
        </div>
      </section>

      <AboutSection />
      <FeaturedVideoSection />
      <PhilosophySection />
      <ServicesSection />
    </div>
  )
}
