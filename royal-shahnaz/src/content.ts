// All client-specific content lives here. To reuse this design for another
// client, change this file (name, contact details, copy and video URLs).

export const salon = {
  name: 'Royal Shahnaz',
  fullName: 'Royal Shahnaz Beauty Salon',
  area: 'Al Karama, Dubai',
  address: 'Al Arif Building, behind Pizza Hut and Pyramids Building, Al Karama, Dubai',
  hours: 'Daily, 9:30 am – 10:00 pm',
  phoneDisplay: '+971 55 526 6703',
  phoneTel: '+971555266703',
  whatsapp: '971555266703',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Royal+Shahnaz+Beauty+Salon+Al+Karama+Dubai',
}

export const videos = {
  hero: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260307_083826_e938b29f-a43a-41ec-a153-3d4730578ab8.mp4',
  approach: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260324_151826_c7218672-6e92-402c-9e45-f1e0f454bdc4.mp4',
  ritual: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260402_054547_9875cfc5-155a-4229-8ec8-b7ba7125cbf8.mp4',
}

export const services = [
  {
    key: 'hair',
    tag: 'Hair',
    title: 'Cuts, colour & styling',
    description: 'Fresh cuts, colour and elegant hairstyles for everyday wear, parties and family occasions.',
  },
  {
    key: 'beauty',
    tag: 'Beauty',
    title: 'Facials & skin care',
    description: 'Facials, threading and skin treatments with high-quality products, matched to your skin type.',
  },
  {
    key: 'nail',
    tag: 'Nail',
    title: 'Manicure & pedicure',
    description: 'Clean, careful nail care, from a classic manicure to a polish for a special evening.',
  },
  {
    key: 'body',
    tag: 'Body',
    title: 'Body care & waxing',
    description: 'Relaxing body treatments and waxing in a calm, private ladies-only setting.',
  },
  {
    key: 'bridal',
    tag: 'Bridal',
    title: 'Bridal makeovers',
    description:
      'Our best-known service. Full bridal packages covering hair and makeup, planned around your outfit, your skin and your wedding-day schedule.',
  },
] as const

export const whatsappLink = (service?: string) => {
  const text = service
    ? `Hello Royal Shahnaz, I'd like to book an appointment for ${service}.`
    : "Hello Royal Shahnaz, I'd like to book an appointment."
  return `https://wa.me/${salon.whatsapp}?text=${encodeURIComponent(text)}`
}
