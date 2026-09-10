import type { ElementType } from 'react'

type Props = {
  as?: 'h1' | 'h2' | 'h3'
  id?: string
  className?: string
  lines: readonly string[]
}

export function CinematicHeading({ as = 'h2', id, className = '', lines }: Props) {
  const Tag = as as ElementType
  return (
    <Tag id={id} className={`cinematic-heading ${className}`.trim()}>
      {lines.map((line, index) => (
        <span className="cinematic-heading__line" key={`${line}-${index}`}>
          <span className="cinematic-heading__inner">{line}</span>
        </span>
      ))}
    </Tag>
  )
}
