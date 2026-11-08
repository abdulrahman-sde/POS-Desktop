export type ShopSettings = {
  shopName: string
  ownerName: string
  phone: string
  address: string
  countryCode: string // used to build WhatsApp numbers, e.g. 92 for Pakistan
  invoiceNote: string
}

export const defaultSettings: ShopSettings = {
  shopName: 'Babar Trades',
  ownerName: 'Babar',
  phone: '03001230000',
  address: 'Shop 14, Mobile Market, Lahore',
  countryCode: '92',
  invoiceNote:
    'Thank you for your business. Warranty as listed per item. Physically damaged or water-damaged parts are not covered.'
}
