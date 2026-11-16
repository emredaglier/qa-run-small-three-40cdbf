import type { ReactNode } from 'react'

type Props = {
  name: string
  /** One string per line. The block is left out when empty. */
  address?: readonly string[]
  /** Today's opening hours, ready to show ("7:00–15:00" or "Closed"). Left out when empty. */
  todayHours?: ReactNode
}

/** Name, address and today's hours. Everything arrives as props; it reads no data itself. */
export function SiteFooter({ name, address = [], todayHours }: Props) {
  return (
    // --focus-ring: the default ring (crust) is too dark on ink.
    <footer className="mt-section bg-ink text-flour [--focus-ring:var(--color-flour)]">
      <div className="mx-auto grid max-w-page gap-8 px-gutter py-10 sm:grid-cols-2">
        <div>
          <p className="font-display text-xl font-semibold text-cream">{name}</p>
          {address.length > 0 ? (
            <address className="mt-3 not-italic">
              {address.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
          ) : null}
        </div>
        {todayHours ? (
          <div>
            <h2 className="text-sm font-semibold tracking-wide text-sand uppercase">Open today</h2>
            <p className="mt-2 text-lg text-cream">{todayHours}</p>
          </div>
        ) : null}
      </div>
    </footer>
  )
}
