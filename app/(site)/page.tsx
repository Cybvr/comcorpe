import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Comcorpe',
}

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <img
        src="/images/comcorpe.png"
        alt="Comcorpe"
        className="h-8 w-auto object-contain md:h-10 dark:invert"
      />
    </main>
  )
}
