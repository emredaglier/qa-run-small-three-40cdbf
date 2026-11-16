import { dayName, type Day } from './days'

export type DayHours = {
  day: Day
  /** Both set when open, e.g. "7:00" and "15:00"; leave out for a closed day. */
  open?: string | null
  close?: string | null
}

type Props = {
  hours: readonly DayHours[]
  /** The row to highlight. */
  today?: Day
}

/** Opening hours, one row per day. The current day is marked in words as well as colour. */
export function HoursTable({ hours, today }: Props) {
  return (
    <table className="w-full border-collapse text-left">
      <caption className="sr-only">Opening hours</caption>
      <tbody>
        {hours.map(({ day, open, close }) => {
          const isToday = day === today
          return (
            <tr
              key={day}
              aria-current={isToday ? 'date' : undefined}
              className="border-b border-line aria-[current=date]:bg-highlight"
            >
              <th scope="row" className="py-3 pr-3 pl-3 font-semibold text-ink">
                {dayName(day)}
                {isToday ? (
                  <span className="ml-2 rounded-chip bg-ink px-2 py-0.5 text-sm font-semibold text-cream">
                    Today
                  </span>
                ) : null}
              </th>
              <td className="py-3 pr-3 text-right text-ink tabular-nums">
                {open && close ? `${open}–${close}` : 'Closed'}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
