import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowUpRight, Crown, Flower2, Hand, Scissors, Sparkles } from 'lucide-react'
import { services, whatsappLink } from '../content'

const icons = { hair: Scissors, beauty: Sparkles, nail: Hand, body: Flower2, bridal: Crown }

export default function ServicesSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="services" ref={ref} className="relative bg-ink py-28 md:py-40 px-6 overflow-hidden scroll-mt-8">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_rgba(217,169,154,0.06)_0%,_transparent_60%)]" />
      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="flex items-end justify-between mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-5xl text-white tracking-tight">
            What we <em className="font-serif italic text-champagne">do</em>
          </h2>
          <p className="hidden md:block text-white/40 text-sm">Tap a service to book</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, i) => {
            const Icon = icons[service.key]
            const featured = service.key === 'bridal'
            return (
              <motion.a
                key={service.key}
                href={whatsappLink(service.tag)}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: i * 0.12 }}
                whileHover={{ y: -6 }}
                className={`liquid-glass rounded-3xl overflow-hidden group p-6 md:p-8 flex flex-col min-h-[16rem] ${
                  featured ? 'md:col-span-2 bg-gradient-to-br from-champagne/10 to-transparent' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-auto">
                  <span className="liquid-glass rounded-full p-3 text-champagne transition-transform duration-500 group-hover:rotate-12">
                    <Icon size={20} />
                  </span>
                  <span className="liquid-glass rounded-full p-2 text-white transition-colors group-hover:text-champagne">
                    <ArrowUpRight size={16} />
                  </span>
                </div>
                <div className="pt-10">
                  <p className="uppercase tracking-widest text-white/40 text-xs mb-3">{service.tag}</p>
                  <h3
                    className={`text-white tracking-tight mb-3 ${
                      featured ? 'font-serif text-3xl md:text-5xl' : 'text-xl md:text-2xl'
                    }`}
                  >
                    {service.title}
                  </h3>
                  <p className={`text-white/50 text-sm leading-relaxed ${featured ? 'max-w-lg' : ''}`}>
                    {service.description}
                  </p>
                </div>
              </motion.a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
