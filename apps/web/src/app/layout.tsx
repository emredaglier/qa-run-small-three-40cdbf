import { HEAD_SCRIPT, SiteFooter } from '@harbour/ui'
import { fontVariables } from '@harbour/ui/fonts'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import './globals.css'
import { AppHeader } from './AppHeader'
import { DebugPanelLoader } from './DebugPanelLoader'
import { MotionFaultReporter } from './MotionFaultReporter'

// The name is fixed here until the pages read the Site global (tickets 04 to 06).
const SITE_NAME = 'Harbour Bakery'

export const metadata: Metadata = { title: SITE_NAME }

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // data-js is set by the head script before first paint, so React must not complain that the
    // attribute differs from the server HTML.
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: HEAD_SCRIPT }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <MotionFaultReporter />
        <AppHeader name={SITE_NAME} />
        {/* The one <main>: pages render their content only. */}
        <main id="main" className="mx-auto w-full max-w-page flex-1 px-gutter py-10 sm:py-16">
          {children}
        </main>
        {/* Address and today's hours arrive with the pages that read them (tickets 04 to 06). */}
        <SiteFooter name={SITE_NAME} />
        <DebugPanelLoader />
      </body>
    </html>
  )
}
