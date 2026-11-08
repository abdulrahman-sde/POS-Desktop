import { useData } from '@/app/providers/data-context'
import { Badge } from '@/components/ui/badge'

// One tinted style per category. The colours are tokens in index.css (--category-1 ... --category-8) and
// avoid the success, warning and destructive colours. Full class names are written out so Tailwind can find them.
const styles = [
  'bg-category-1/12 text-category-1',
  'bg-category-2/12 text-category-2',
  'bg-category-3/12 text-category-3',
  'bg-category-4/12 text-category-4',
  'bg-category-5/12 text-category-5',
  'bg-category-6/12 text-category-6',
  'bg-category-7/12 text-category-7',
  'bg-category-8/12 text-category-8'
]

// A category name as a chip. Each category keeps its own colour, based on its place in the Categories list.
export function CategoryChip({ name }: { name: string }): React.JSX.Element {
  const { categories } = useData()
  const index = Math.max(
    0,
    categories.findIndex((category) => category.name === name)
  )
  return (
    <Badge
      variant="tag"
      className={`h-auto max-w-full whitespace-normal text-left ${styles[index % styles.length]}`}
    >
      {name}
    </Badge>
  )
}
