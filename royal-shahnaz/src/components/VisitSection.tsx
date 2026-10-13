import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { MapPin, MessageCircle, Phone } from 'lucide-react'
import { salon, whatsappLink } from '../content'

export default function VisitSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="visit" ref={ref} className="bg-ink pb-16 px-6 overflow-hidden scroll-mt-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9 }}
          className="liquid-glass rounded-[2rem] p-8 md:p-14 grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-10 md:gap-16 bg-[radial-gradient(ellipse_at_top_left,_rgba(236,210,180,0.1)_0%,_transparent_60%)]"
        >
          <div>
            <p className="text-champagne/60 text-xs tracking-widest uppercase mb-4">Visit us</p>
            <h2 className="font-serif text-5xl md:text-7xl text-white tracking-tight leading-[1]">
              Your chair <em className="italic text-champagne">is waiting.</em>
            </h2>
            <div className="mt-10 flex flex-wrap gap-4">
              <motion.a
                href={whatsappLink()}
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-champagne text-ink rounded-full px-7 py-3 text-sm font-medium flex items-center gap-2"
              >
                <MessageCircle size={18} /> Book on WhatsApp
              </motion.a>
              <motion.a
                href={salon.mapsUrl}
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="liquid-glass rounded-full px-7 py-3 text-white text-sm font-medium flex items-center gap-2"
              >
                <MapPin size={18} /> Get directions
              </motion.a>
            </div>
          </div>

          <dl className="flex flex-col gap-6 text-sm md:self-end">
            <div>
              <dt className="text-white/40 text-xs tracking-widest uppercase mb-1">Address</dt>
              <dd className="text-white/80 leading-relaxed">{salon.address}</dd>
            </div>
            <div className="h-px bg-white/10" />
            <div>
              <dt className="text-white/40 text-xs tracking-widest uppercase mb-1">Opening hours</dt>
              <dd className="text-white/80">{salon.hours}</dd>
            </div>
            <div className="h-px bg-white/10" />
            <div>
              <dt className="text-white/40 text-xs tracking-widest uppercase mb-1">Phone</dt>
              <dd>
                <a href={`tel:${salon.phoneTel}`} className="text-white/80 hover:text-champagne inline-flex items-center gap-2">
                  <Phone size={14} /> {salon.phoneDisplay}
                </a>
              </dd>
            </div>
          </dl>
        </motion.div>

        <footer className="mt-12 flex flex-col sm:flex-row justify-between gap-2 text-white/30 text-xs">
          <p>© {new Date().getFullYear()} {salon.fullName}</p>
          <p>Sample homepage by Plastrix Studio</p>
        </footer>
      </div>
    </section>
  )
}
