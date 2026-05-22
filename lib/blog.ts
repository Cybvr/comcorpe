export type BlogPost = {
  slug: string
  category: 'Events'
  eyebrow: string
  title: string
  summary: string
  lede: string
  publishedLabel: string
  venueLabel: string
  formatLabel: string
  hostLabel: string
  ctaHref: string
  ctaLabel: string
  agenda: string[]
  notes: string[]
}

export const featuredBlogPost: BlogPost = {
  slug: 'comcorpe-first-townhall',
  category: 'Events',
  eyebrow: 'Blog Announcement',
  title: 'Comcorpe First Town Hall',
  summary:
    'We are opening our first Comcorpe town hall as a Zoom gathering for the community, with an update on where we are headed and room for live questions.',
  lede:
    'This first blog note invites the Comcorpe community into our opening town hall: a short Zoom session where we share what we are building, what comes next, and how people can plug into the journey early.',
  publishedLabel: 'Now on the Comcorpe blog',
  venueLabel: 'Zoom meeting',
  formatLabel: 'Live online session',
  hostLabel: 'Hosted by the Comcorpe team',
  ctaHref: 'mailto:hello@comcorpe.com?subject=Comcorpe%20Town%20Hall%20RSVP',
  ctaLabel: 'Request the Zoom invite',
  agenda: [
    'A quick welcome and opening note',
    'What Comcorpe is building in this next chapter',
    'How collaborators, operators, and community members can plug in',
    'Live questions and an open conversation',
  ],
  notes: [
    'The final Zoom link and timing will be shared directly with confirmed attendees.',
    'This is the first town hall, so the session is intentionally simple, welcoming, and conversation-led.',
  ],
}

export function getBlogHref(slug: string) {
  return `/blog/${slug}`
}
