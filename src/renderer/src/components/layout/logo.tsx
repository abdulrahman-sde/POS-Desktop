import { useId } from 'react'

import { cn } from '@/lib/utils'
import { LOGO_GRADIENTS, LOGO_SHAPES, LOGO_VIEW_BOX } from './logo-shapes'
import type { LogoProps } from './types'

// Just the icon: no name, no tile behind it. Colours come from the --logo-* tokens in index.css.
export function Logo({ className }: LogoProps): React.JSX.Element {
  const uid = useId().replace(/:/g, '')

  return (
    <svg
      viewBox={LOGO_VIEW_BOX}
      xmlns="http://www.w3.org/2000/svg"
      className={cn('size-8 shrink-0 isolate', className)}
      aria-label="Stockwise"
      role="img"
    >
      <defs>
        {LOGO_GRADIENTS.map((g) => (
          <linearGradient
            key={g.id}
            id={`${uid}-${g.id}`}
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="0"
            x2="1"
            y2="0"
            gradientTransform={`matrix(${g.matrix})`}
          >
            {g.stops.map((s) => (
              <stop key={s.offset} offset={s.offset} style={{ stopColor: `var(${s.token})` }} />
            ))}
          </linearGradient>
        ))}
      </defs>
      <g transform="matrix(1 0 0 -1 0 500)">
        {LOGO_SHAPES.map((shape, i) => (
          <path
            key={i}
            d={shape.d}
            transform={shape.move ? `translate(${shape.move})` : undefined}
            style={{
              fill: shape.gradient ? `url(#${uid}-${shape.gradient})` : `var(${shape.token})`,
              mixBlendMode: shape.multiply ? 'multiply' : undefined
            }}
          />
        ))}
      </g>
    </svg>
  )
}
