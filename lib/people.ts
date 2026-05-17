import { collection, getDocs } from 'firebase/firestore'
import { db } from './firebase'

export interface LeadershipMember {
  id?: string
  name: string
  title: string
  bio: string
  tags: string[]
  linkedin: string
}

export interface AdvisorMember {
  id?: string
  name: string
  title: string
  bio: string
  fullBio: string
  geo: string
  linkedin: string
}

export const leadership: LeadershipMember[] = [
  {
    name: 'Enyi Odigbo',
    title: 'Chairman',
    bio: 'Enyi Odigbo is a pioneering figure in the African marketing communications landscape and the founder of the Casers Group, one of the continent\'s most formidable media investment networks. With a career spanning over three decades, he has architected strategic growth for global brands and significantly advanced the industry—including serving as President of the AAAN and founding the Lagos Advertising and Ideas Festival (LAIF). A recipient of the National Productivity Order of Merit, Enyi brings unparalleled governance, institutional authority, and strategic foresight to Comcorpe\'s enterprise oversight operations.',
    tags: ['STRATEGY', 'GOVERNANCE'],
    linkedin: '#',
  },
  {
    name: 'Maxwell Marshall',
    title: 'Chief Business Architect',
    bio: 'Maxwell Marshall is a visionary commercial strategist with a proven track record of engineering transformative business models and high-yield enterprise partnerships. As Chief Business Architect, he bridges the gap between complex organizational challenges and scalable market solutions, designing robust commercial frameworks that drive exponential growth. His deep expertise in commercial design ensures that every technological and creative deployment at Comcorpe translates directly into measurable business value and sustained market dominance.',
    tags: ['COMMERCIAL DESIGN', 'PARTNERSHIPS'],
    linkedin: '#',
  },
  {
    name: 'Jide Pinheiro',
    title: 'Chief Creativity Architect',
    bio: 'Jide Pinheiro is a multidisciplinary product architect, technologist, and digital strategist with over 15 years of experience leading high-impact innovation across global markets. As the founder of VisualHQ and a contributor to elite engineering networks like Toptal and Braintrust, he has consistently operated at the frontier of design and technology—including driving early adoption in the Web3 ecosystem. At Comcorpe, Jide orchestrates the vital intersection of human-centered design and advanced engineering, building enterprise-grade platforms that redefine digital experiences.',
    tags: ['PRODUCT DESIGN', 'TECHNOLOGY'],
    linkedin: '#',
  },
]

export const advisors: AdvisorMember[] = [
  {
    name: 'Kristjan Mar Hauksson',
    title: 'Strategic Lead',
    bio: 'Internationally recognized marketing strategist and award-winning creative leader with experience scaling companies across five countries.',
    fullBio: 'Kristjan Mar Hauksson is an internationally recognized marketing strategist and award-winning creative leader. He has developed brand strategies across 20+ global markets for enterprises and Fortune 500 companies. A former board member of Bing Advertising\'s International Advisory Board, he brings strategic insight in branding, marketing automation, and data intelligence.',
    geo: 'Reykjavik',
    linkedin: '#',
  },
  {
    name: 'Olubayo Adekanmbi',
    title: 'AI & Data Lead',
    bio: 'Award-winning technology executive and AI researcher. Founder of EqualyzAI and a recognized authority in emerging-market AI solutions.',
    fullBio: 'Olubayo Adekanmbi is an award-winning technology executive, AI researcher, and founder of EqualyzAI. With over two decades of experience spanning AI and analytics across 30+ African markets, he is an authority in emerging-market AI. He has earned global recognition, including the Bill & Melinda Gates Global Grand Challenge award, bringing deep technical expertise to the network.',
    geo: 'Lagos',
    linkedin: '#',
  },
  {
    name: 'Melanie Vignon',
    title: 'Brand Operations Lead',
    bio: 'Global brand operations leader with deep experience across Europe, the Middle East, and Africa, specializing in cross-cultural collaboration.',
    fullBio: 'Melanie Vignon is a global brand operations leader with extensive experience driving integrated marketing initiatives across EMEA. Having held senior operational roles at networks like DDB, she combines strong organizational leadership with deep expertise in cross-cultural collaboration, bringing an invaluable international perspective to complex brand ecosystems.',
    geo: 'Paris',
    linkedin: '#',
  },
]

export async function getLeadership(): Promise<LeadershipMember[]> {
  try {
    const snap = await getDocs(collection(db, 'leadership'))
    if (snap.empty) return leadership
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as LeadershipMember))
  } catch (error) {
    console.error('Error fetching leadership from Firestore:', error)
    return leadership
  }
}

export async function getAdvisors(): Promise<AdvisorMember[]> {
  try {
    const snap = await getDocs(collection(db, 'advisors'))
    if (snap.empty) return advisors
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as AdvisorMember))
  } catch (error) {
    console.error('Error fetching advisors from Firestore:', error)
    return advisors
  }
}
