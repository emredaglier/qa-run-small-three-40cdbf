import Link from 'next/link'

import { SITE_NAV, cx, isCurrent, type NavItem } from './nav'

type Props = {
  name: string
  /** The current URL path; the matching nav link is marked `aria-current="page"`. */
  pathname?: string | null
  nav?: readonly NavItem[]
}

/** Site name and the main navigation. Plain links: works with JavaScript off. */
export function SiteHeader({ name, pathname, nav = SITE_NAV }: Props) {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-page flex-col gap-1 px-gutter pt-4 pb-2 sm:flex-row sm:items-center sm:justify-between sm:py-4">
        <Link href="/" className="font-display text-xl font-semibold text-ink">
          {name}
        </Link>
        <nav aria-label="Main">
          <ul className="-mx-3 flex gap-1 sm:mx-0">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  // shortcut: no prefetch while /menu and /visit are missing (404s fail smoke); drop it with tickets 05, 06.
                  prefetch={false}
                  aria-current={isCurrent(item.href, pathname) ? 'page' : undefined}
                  className={cx(
                    'nav-link flex min-h-11 items-center px-3 text-ink-soft hover:text-ink',
                    // Marked by weight and a rule as well as colour.
                    'aria-[current=page]:font-semibold aria-[current=page]:text-ink',
                    'aria-[current=page]:underline aria-[current=page]:decoration-crust',
                    'aria-[current=page]:decoration-2 aria-[current=page]:underline-offset-8',
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
