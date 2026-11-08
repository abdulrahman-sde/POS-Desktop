import { Badge } from '@/components/ui/badge'
import { qualityLabels, qualityShortLabels, type PartQuality } from '@/features/products/types'

const variants: Record<PartQuality, 'success' | 'info' | 'secondary' | 'warning'> = {
  original: 'success',
  oem: 'info',
  copy: 'secondary',
  refurbished: 'warning'
}

// short = a shorter name for small spaces (the full name shows when you hover over it).
export function QualityBadge({
  quality,
  short
}: {
  quality: PartQuality
  short?: boolean
}): React.JSX.Element {
  return (
    <Badge variant={variants[quality]} title={qualityLabels[quality]}>
      {short ? qualityShortLabels[quality] : qualityLabels[quality]}
    </Badge>
  )
}
