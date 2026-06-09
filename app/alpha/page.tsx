import dynamic from 'next/dynamic'

const AlphaTalentOnboardingFlow = dynamic(() => import('@/components/AlphaTalentOnboardingFlow'), {
  ssr: false,
})

export default function AlphaPage() {
  return <AlphaTalentOnboardingFlow />
}
