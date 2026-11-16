type Props = {
  title: string
  /** A line under the title. */
  intro?: string | null
}

/** The page's one `<h1>`, with an optional lead line. */
export function PageHeading({ title, intro }: Props) {
  return (
    <div className="mb-10">
      <h1 className="text-3xl text-ink">{title}</h1>
      {intro ? <p className="mt-3 max-w-prose text-lg text-ink-soft">{intro}</p> : null}
    </div>
  )
}
