import type { Metadata } from 'next';
import './globals.css';
import { AppProviders } from '@/components/app-providers';
import { AppLayout } from '@/components/app-layout';
import React from 'react';

export const metadata: Metadata = {
  title: 'Prism Papers',
  description: 'Decentralized Publishing & Reviewing Platform.',
}

const links: { label: string; path: string }[] = [
  // More links...
  { label: 'Home', path: '/' },
  { label: 'Papers', path: '/papers' },
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Publish', path: '/publish' },
]

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased`}>
        <AppProviders>
          <AppLayout links={links}>{children}</AppLayout>
        </AppProviders>
      </body>
    </html>
  )
}

declare global {
  interface BigInt {
    toJSON(): string
  }
}

BigInt.prototype.toJSON = function () {
  return this.toString()
}
