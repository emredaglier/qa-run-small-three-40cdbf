export type NavItem = { href: string; label: string }

export const SITE_NAV: readonly NavItem[] = [
  { href: '/', label: 'Home' },
  { href: '/menu', label: 'Menu' },
  { href: '/visit', label: 'Visit' },
]

/** Whether `href` is the page at `pathname` (Home only on `/`; others also for their sub-pages). */
export function isCurrent(href: string, pathname: string | null | undefined): boolean {
  if (!pathname) return false
  return href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)
}

/** Joins class names, skipping empty ones. */
export const cx = (...names: (string | false | null | undefined)[]) =>
  names.filter(Boolean).join(' ')
