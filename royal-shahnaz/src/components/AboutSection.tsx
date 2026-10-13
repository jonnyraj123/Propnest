import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Clock, MapPin, Sparkles } from 'lucide-react'
import { salon } from '../content'

const facts = [
  { Icon: Clock, label: 'Open', value: salon.hours },
  { Icon: MapPin, label: 'Find us', value: 'Al Arif Building, Al Karama' },
  { Icon: Sparkles, label: 'Known for', value: 'Bridal makeovers & hairstyling' },
]

export default function AboutSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="relative bg-ink pt-32 md:pt-44 pb-10 md:pb-14 px-6 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_rgba(236,210,180,0.05)_0%,_transparent_70%)]" />
      <div className="relative max-w-6xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-champagne/60 text-sm tracking-widest uppercase mb-8"
        >
          Our Story
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl text-white leading-[1.1] tracking-tight"
        >
          Serving Karama{' '}
          <em className="font-serif italic text-champagne/70">since the early 2000s,</em>
          <br className="hidden md:block" /> with{' '}
          <em className="font-serif italic text-champagne/70">care in every detail.</em>
        </motion.h2>

        <div className="mt-16 md:mt-20 grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 text-left">
          {facts.map(({ Icon, label, value }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.3 + i * 0.12 }}
              className="liquid-glass rounded-2xl p-5 flex items-start gap-4"
            >
              <span className="liquid-glass rounded-full p-2.5 text-champagne shrink-0">
                <Icon size={18} />
              </span>
              <div className="min-w-0">
                <p className="text-white/40 text-xs tracking-widest uppercase mb-1">{label}</p>
                <p className="text-white text-sm leading-relaxed">{value}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
