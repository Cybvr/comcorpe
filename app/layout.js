import './globals.css'

export const metadata = {
  title: 'Comcorpᵉ — A Growth Systems Company',
  description: 'Comcorpᵉ orchestrates data, creativity, technology and strategy into unified growth systems.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-paper text-ink font-text antialiased leading-body tracking-body">
        {children}
      </body>
    </html>
  )
}
