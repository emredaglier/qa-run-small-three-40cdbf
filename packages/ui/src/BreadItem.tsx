import { dayName, dayShort, type Day } from './days'

type Props = {
  name: string
  description: string
  /** The days it is baked. */
  days: readonly Day[]
  /** Heading level of the name; h3 under a section heading by default. */
  as?: 'h2' | 'h3'
}

/** One bread on the menu: name, description and the days it is baked as chips. */
export function BreadItem({ name, description, days, as: Heading = 'h3' }: Props) {
  return (
    <article className="rounded-card bg-flour p-5 sm:p-6">
      <Heading className="text-xl text-ink">{name}</Heading>
      <p className="mt-2 text-ink-soft">{description}</p>
      {days.length > 0 ? (
        <ul aria-label="Baked on" className="mt-4 flex flex-wrap gap-2">
          {days.map((day) => (
            <li
              key={day}
              className="rounded-chip border border-crust px-3 py-0.5 text-sm font-semibold text-crust"
            >
              <span aria-hidden="true">{dayShort(day)}</span>
              <span className="sr-only">{dayName(day)}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  )
}
