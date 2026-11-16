'use client'

import { SiteHeader } from '@harbour/ui'
import { usePathname } from 'next/navigation'

/** Marks the current page in the nav. Still server-rendered, so the mark is in the HTML. */
export function AppHeader({ name }: { name: string }) {
  return <SiteHeader name={name} pathname={usePathname()} />
}
