import type { Metadata } from 'next'
import './globals.css'
import NetworkHelper from '@/components/NetworkHelper'

export const metadata: Metadata = {
  title: 'Supply Chain Manager',
  description: 'Blockchain-based Supply Chain Management System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <NetworkHelper />
        {children}
      </body>
    </html>
  )
}

