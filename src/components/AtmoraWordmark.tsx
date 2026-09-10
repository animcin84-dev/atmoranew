type Props = { className?: string }

export function AtmoraWordmark({ className = '' }: Props) {
  return (
    <svg
      className={`atmora-wordmark ${className}`.trim()}
      viewBox="0 0 176 28"
      aria-hidden="true"
      focusable="false"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g className="atmora-wordmark__letters" stroke="currentColor" strokeWidth="1.65" strokeLinecap="square" strokeLinejoin="miter">
        <path d="M2 23 11 4l9 19M6.2 14.2h9.6" />
        <path d="M27 4h18M36 4v19" />
        <path d="M53 23V4l10 12 10-12v19" />
        <path d="M84 13.5C84 7.1 88.2 3.5 94 3.5s10 3.6 10 10-4.2 10-10 10-10-3.6-10-10Z" />
        <path d="M114 23V4h8.7c5.1 0 8.1 2.5 8.1 6.4 0 4-3 6.5-8.1 6.5H114M123 16.9l9.7 6.1" />
        <path d="M141 23 150 4l9 19M145.2 14.2h9.6" />
      </g>
      <g className="wordmark-threshold" stroke="currentColor" strokeWidth="1" opacity=".46">
        <path d="M54 26.5h49" />
        <circle cx="94" cy="26.5" r="1.45" fill="currentColor" stroke="none" />
      </g>
      <path d="M166 8v9" stroke="currentColor" strokeWidth="1" opacity=".38" />
      <circle cx="166" cy="20.5" r="1.7" fill="currentColor" />
    </svg>
  )
}
