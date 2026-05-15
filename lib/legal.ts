export interface LegalPage {
  slug: 'privacy' | 'terms' | 'cookies'
  title: string
  eyebrow: string
  updatedAt: string
  intro: string
  sections: {
    title: string
    body: string
  }[]
}

export const legalPages: Record<LegalPage['slug'], LegalPage> = {
  privacy: {
    slug: 'privacy',
    title: 'Privacy Policy',
    eyebrow: 'Privacy',
    updatedAt: 'May 15, 2026',
    intro: 'This page explains how Comcorpe handles account, engagement, and contact information across the public site and dashboard experience.',
    sections: [
      {
        title: 'Information we collect',
        body: 'We may collect contact details, company information, dashboard activity, submitted briefs, support requests, billing context, and referral information you choose to provide.',
      },
      {
        title: 'How we use information',
        body: 'We use information to operate the platform, match clients with suitable operators, manage engagements, provide support, improve the service, and keep necessary commercial records.',
      },
      {
        title: 'Sharing and processors',
        body: 'We share information only where needed to run Comcorpe services, such as with internal operators, contracted service providers, professional advisors, or where required by law.',
      },
      {
        title: 'Retention and control',
        body: 'We keep information for as long as needed for service delivery, legal, security, and business record purposes. You can contact us to request access, correction, or deletion where applicable.',
      },
    ],
  },
  terms: {
    slug: 'terms',
    title: 'Terms of Service',
    eyebrow: 'Terms',
    updatedAt: 'May 15, 2026',
    intro: 'These terms describe the baseline rules for using Comcorpe websites, dashboards, and related services.',
    sections: [
      {
        title: 'Using the service',
        body: 'You are responsible for keeping account access secure and for ensuring information submitted through Comcorpe is accurate, lawful, and authorized by your organization.',
      },
      {
        title: 'Engagements and commercial terms',
        body: 'Specific commercial work may be governed by separate proposals, statements of work, order forms, or master service agreements. Those documents control if they conflict with these general terms.',
      },
      {
        title: 'Acceptable use',
        body: 'Do not misuse the platform, interfere with its operation, attempt unauthorized access, or submit material that infringes rights, violates law, or exposes confidential information without permission.',
      },
      {
        title: 'Availability and changes',
        body: 'We may update, suspend, or change parts of the service as the platform evolves. We aim to preserve continuity for active engagements, but public and dashboard features may change over time.',
      },
    ],
  },
  cookies: {
    slug: 'cookies',
    title: 'Cookie Policy',
    eyebrow: 'Cookies',
    updatedAt: 'May 15, 2026',
    intro: 'This page explains how cookies and similar browser storage may be used by Comcorpe to keep the site and dashboard working.',
    sections: [
      {
        title: 'Essential cookies',
        body: 'Essential cookies and local storage help keep you signed in, preserve dashboard preferences, remember interface state, and support security for account sessions.',
      },
      {
        title: 'Preference storage',
        body: 'Where available, preferences such as theme or local dashboard settings may be stored in your browser so the experience feels consistent between visits.',
      },
      {
        title: 'Analytics and improvement',
        body: 'We may use privacy-conscious analytics or similar tools to understand aggregate usage, diagnose issues, and improve product flows. These tools should not be used to sell personal information.',
      },
      {
        title: 'Managing cookies',
        body: 'You can control cookies through your browser settings. Blocking essential cookies may prevent sign-in, dashboard access, or saved preferences from working correctly.',
      },
    ],
  },
}
