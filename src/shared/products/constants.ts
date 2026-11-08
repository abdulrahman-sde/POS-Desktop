// Quality grades a part can have. Optional on a product.
export const partQualities = ['original', 'oem', 'copy', 'refurbished'] as const
export type PartQuality = (typeof partQualities)[number]

// Every product is counted in pieces.
export const PRODUCT_UNIT = 'pcs'
