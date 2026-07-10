import type { Metadata } from 'next'
import MainLandingPage from '@/components/site/MainLandingPage'

export const metadata: Metadata = {
  title: 'Comcorpe - A Growth Systems Company',
}

export default function Home() {
  return <MainLandingPage />
}
