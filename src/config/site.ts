// TODO: confirm with client: social profiles.
export const site = {
  name: 'Bueno Landscaping',
  legalName: 'Bueno Landscaping Inc.',
  // TODO: set NEXT_PUBLIC_SITE_URL once the domain is decided.
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, ''),
  description:
    'Lawn care, landscaping, hardscape, masonry, irrigation, drainage and shed installation in Patchogue and nearby Long Island towns.',
  phone: {
    display: '(631) 394-1668',
    e164: '+16313941668',
    href: 'tel:+16313941668',
    sms: 'sms:+16313941668',
  },
  address: {
    street: '29 Edwards St',
    locality: 'Patchogue',
    postalCode: '11772',
    region: 'NY',
    country: 'US',
  },
  location: 'Patchogue, NY',
  // Shown in the footer, the quote section and the business schema (client, 2026-11-03).
  email: 'birdblack070@gmail.com' as string,
  // `display` is shown on the site, `schema` uses schema.org openingHours format.
  hours: { display: 'Open 7 days, 7am–10pm' as string, schema: ['Mo-Su 07:00-22:00'] as string[] },
  // Horizontal version of the client's round logo, redrawn from a photo (see design/logo).
  logo: { src: '/brand/logo.webp', white: '/brand/logo-white.webp', png: '/brand/logo.png', width: 412, height: 200 },
  // Link preview image (1200x630), cropped from the homepage hero photo.
  ogImage: '/images/og-backyard.jpg',
} as const;

export const navigation = [
  { label: 'Services', href: '/services' },
  { label: 'Our Work', href: '/our-work' },
  { label: 'Service Areas', href: '/service-areas' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
] as const;
