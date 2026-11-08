import type { Category } from './types'

// A starting list for a mobile shop. The owner can add, rename and delete categories.
const names = [
  'Screens & Displays',
  'Batteries',
  'Chargers & Cables',
  'Charging Ports & Flex',
  'Back Covers & Frames',
  'Cameras',
  'Speakers & Mics',
  'Cases & Protectors',
  'Earphones & Audio',
  'Power Banks',
  'Tools & Others',
  'Others'
]

export const demoCategories: Category[] = names.map((name, index) => ({
  id: `cat${index + 1}`,
  name
}))
