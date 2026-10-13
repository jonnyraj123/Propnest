import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { videos } from '../content'

export default function ApproachSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const videoScale = useTransform(scrollYProgress, [0, 1], [1.15, 1])

  return (
    <section ref={ref} className="bg-ink pt-6 md:pt-10 pb-20 md:pb-32 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9 }}
          className="relative rounded-[2rem] overflow-hidden aspect-[4/5] sm:aspect-video"
        >
          <motion.video
            style={{ scale: videoScale }}
            className="w-full h-full object-cover"
            src={videos.approach}
            muted
            autoPlay
            loop
            playsInline
            preload="auto"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="liquid-glass rounded-2xl p-6 md:p-8 max-w-md">
              <p className="text-champagne/70 text-xs tracking-widest uppercase mb-3">Our Approach</p>
              <p className="text-white text-sm md:text-base leading-relaxed">
                We blend years of experience with modern trends and high-quality products, so every visit feels calm
                and every result looks effortless.
              </p>
            </div>
            <motion.a
              href="#services"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="liquid-glass rounded-full px-8 py-3 text-white text-sm font-medium self-start md:self-auto"
            >
              See our services
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
