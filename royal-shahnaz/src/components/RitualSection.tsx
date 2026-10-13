import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { videos } from '../content'

const blocks = [
  {
    id: 'bridal',
    label: 'Your wedding day',
    body: 'From the first trial to the big morning, we plan your hair and makeup around your outfit, your skin and your schedule, so you can enjoy every moment of the celebration.',
  },
  {
    id: undefined,
    label: 'Every other day',
    body: 'A haircut before work, a facial at the weekend or nails for a party. Book ahead on WhatsApp for busy evenings and specialised treatments, and we will have your chair ready.',
  },
]

export default function RitualSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="bg-ink py-28 md:py-40 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl lg:text-8xl text-white tracking-tight mb-16 md:mb-24 md:text-right"
        >
          Beauty <em className="font-serif italic text-champagne/50">x</em> Ritual
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col justify-center gap-10 md:order-1"
          >
            {blocks.map((block, i) => (
              <div key={block.label} id={block.id} className="flex flex-col gap-10 scroll-mt-24">
                {i > 0 && <div className="w-full h-px bg-gradient-to-r from-champagne/30 to-transparent" />}
                <div>
                  <p className="text-champagne/60 text-xs tracking-widest uppercase mb-4">{block.label}</p>
                  <p className="text-white/70 text-base md:text-lg leading-relaxed">{block.body}</p>
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="rounded-t-[12rem] rounded-b-3xl overflow-hidden aspect-[4/5] md:order-2"
          >
            <video className="w-full h-full object-cover" src={videos.ritual} muted autoPlay loop playsInline preload="auto" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
