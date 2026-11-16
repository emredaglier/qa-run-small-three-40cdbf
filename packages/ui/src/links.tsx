import Link from 'next/link'
import type { ComponentProps } from 'react'

import { cx } from './nav'

/** An inline link: underlined, so it is not marked by colour alone. */
export function TextLink({ className, ...props }: ComponentProps<typeof Link>) {
  return <Link {...props} className={cx('link', className)} />
}

/** A link that looks like a button, for the one main action on a page. */
export function ButtonLink({ className, ...props }: ComponentProps<typeof Link>) {
  return <Link {...props} className={cx('btn', className)} />
}
