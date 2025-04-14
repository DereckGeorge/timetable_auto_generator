import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Coict Timetable Generator App',
  description: 'Created with react js, next js',
  generator: 'react',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
