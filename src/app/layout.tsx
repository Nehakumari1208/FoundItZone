'use client'

import { ClerkProvider } from '@clerk/nextjs'
import { shadesOfPurple } from '@clerk/themes'
import { ToastContainer } from 'react-toastify'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import 'react-toastify/dist/ReactToastify.css'
import Navbar from '@/components/Navbar'
import { usePathname } from 'next/navigation'

// Font setup
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const hideNavbarRoutes = ['/', '/sign-in', '/sign-up']
  const shouldShowNavbar = !hideNavbarRoutes.includes(pathname)

  return (
    <ClerkProvider
      appearance={{ baseTheme: shadesOfPurple }}
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignInUrl="/home"
      afterSignUpUrl="/home"
    >
      <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
        <head>
          <title>FoundItZone</title>
          <link rel="icon" href="/favicon.png" />
        </head>
        <body className="antialiased">
          {shouldShowNavbar && <Navbar />}
          <ToastContainer />
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
