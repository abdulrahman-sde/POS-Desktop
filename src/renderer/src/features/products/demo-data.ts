import type { PartQuality, Product } from './types'

type Row = [
  name: string,
  category: string,
  brand: string,
  models: string,
  quality: PartQuality,
  color: string,
  warranty: string,
  shelf: string,
  costPrice: number,
  stock: number,
  reorderLevel: number
]

const rows: Row[] = [
  [
    'Samsung A12 LCD Display with Touch',
    'Screens & Displays',
    'Samsung',
    'Galaxy A12, A125F',
    'original',
    'Black',
    '1 month',
    'A1',
    2800,
    14,
    5
  ],
  [
    'iPhone 11 LCD Display',
    'Screens & Displays',
    'Apple',
    'iPhone 11',
    'oem',
    'Black',
    '1 month',
    'A2',
    5200,
    8,
    4
  ],
  [
    'Redmi Note 10 AMOLED Display',
    'Screens & Displays',
    'Xiaomi',
    'Redmi Note 10, Note 10S',
    'original',
    'Black',
    '1 month',
    'A3',
    4600,
    6,
    4
  ],
  [
    'Infinix Hot 11 Battery',
    'Batteries',
    'Infinix',
    'Hot 11, Hot 11S',
    'original',
    '',
    '3 months',
    'B1',
    650,
    30,
    10
  ],
  [
    'Samsung A10 Battery',
    'Batteries',
    'Samsung',
    'Galaxy A10, A105F',
    'original',
    '',
    '3 months',
    'B2',
    550,
    22,
    10
  ],
  ['iPhone 7 Battery', 'Batteries', 'Apple', 'iPhone 7', 'oem', '', '3 months', 'B3', 900, 3, 6],
  [
    '25W Type-C Fast Charger',
    'Chargers & Cables',
    'Samsung',
    'All Type-C Samsung phones',
    'original',
    'White',
    '6 months',
    'C1',
    1100,
    40,
    15
  ],
  [
    'Micro USB Data Cable 1m',
    'Chargers & Cables',
    'Ronin',
    'Android Micro USB',
    'copy',
    'Black',
    '7 days',
    'C2',
    100,
    90,
    30
  ],
  [
    'Lightning Cable 1m',
    'Chargers & Cables',
    'Apple',
    'iPhone 6 to iPhone 14',
    'oem',
    'White',
    '1 month',
    'C3',
    280,
    55,
    20
  ],
  [
    'Tecno Spark 8 Charging Port Flex',
    'Charging Ports & Flex',
    'Tecno',
    'Spark 8, Spark 8C',
    'original',
    '',
    '7 days',
    'D1',
    180,
    0,
    6
  ],
  [
    'Vivo Y20 Back Glass Cover',
    'Back Covers & Frames',
    'Vivo',
    'Y20, Y20i, Y12s',
    'oem',
    'Blue',
    'No warranty',
    'D2',
    400,
    9,
    4
  ],
  [
    'Oppo A15 Rear Camera Module',
    'Cameras',
    'Oppo',
    'A15, A15s',
    'original',
    '',
    '1 month',
    'D3',
    1100,
    5,
    3
  ],
  [
    'Loudspeaker Ringer Module',
    'Speakers & Mics',
    'Samsung',
    'Galaxy A series',
    'oem',
    '',
    '15 days',
    'D4',
    120,
    45,
    15
  ],
  [
    '9H Tempered Glass Protector',
    'Cases & Protectors',
    'Generic',
    'iPhone 12, 12 Pro',
    'copy',
    'Clear',
    'No warranty',
    'E1',
    60,
    120,
    30
  ],
  [
    'Silicone Back Case',
    'Cases & Protectors',
    'Generic',
    'iPhone 13',
    'copy',
    'Black',
    'No warranty',
    'E2',
    150,
    35,
    10
  ],
  [
    'Wireless Earbuds Pro',
    'Earphones & Audio',
    'Audionic',
    'Bluetooth 5.0, all phones',
    'original',
    'White',
    '6 months',
    'F1',
    1500,
    12,
    5
  ],
  [
    'Power Bank 10000mAh',
    'Power Banks',
    'Ronin',
    'All phones',
    'original',
    'Black',
    '6 months',
    'F2',
    2400,
    7,
    5
  ],
  [
    'Type-C OTG Adapter',
    'Tools & Others',
    'Generic',
    'All Type-C phones',
    'copy',
    'Silver',
    '7 days',
    'G1',
    40,
    80,
    20
  ],
  [
    '24-in-1 Repair Screwdriver Kit',
    'Tools & Others',
    'Generic',
    'Phone repair',
    'copy',
    '',
    '1 month',
    'G2',
    350,
    11,
    4
  ],
  [
    'Samsung J7 Prime LCD Display',
    'Screens & Displays',
    'Samsung',
    'Galaxy J7 Prime, G610F',
    'refurbished',
    'Black',
    '15 days',
    'A4',
    2200,
    2,
    4
  ]
]

// The usual selling price of each product above, in the same order.
const salePrices = [
  3600, 6500, 5800, 950, 850, 1400, 1600, 180, 450, 350, 700, 1700, 260, 150, 350, 2400, 3200, 120,
  650, 3000
]

export const demoProducts: Product[] = rows.map(
  (
    [
      name,
      category,
      brand,
      compatibleModels,
      quality,
      color,
      warranty,
      shelf,
      costPrice,
      stock,
      reorderLevel
    ],
    index
  ) => {
    const n = index + 1
    return {
      id: `p${n}`,
      name,
      sku: `${category.slice(0, 3).toUpperCase()}-${String(n).padStart(3, '0')}`,
      barcode: `89610020${String(n).padStart(5, '0')}`,
      category,
      brand,
      compatibleModels,
      quality,
      color,
      warranty,
      shelf,
      unit: name.includes('Kit') ? 'kit' : 'pcs',
      costPrice,
      salePrice: salePrices[index],
      stock,
      reorderLevel
    }
  }
)
