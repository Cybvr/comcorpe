import { Archivo_Black, Inter_Tight, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const archivoBlack = Archivo_Black({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-archivo-black',
  display: 'swap',
})

const interTight = Inter_Tight({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-inter-tight',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const metadata = {
  title: 'Comcorpᵉ — A Growth Systems Company',
  description: 'Comcorpᵉ orchestrates data, creativity, technology and strategy into unified growth systems.',
}

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${archivoBlack.variable} ${interTight.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-paper text-ink font-text antialiased leading-body tracking-body">
        {children}
      </body>
    </html>
  )
}
