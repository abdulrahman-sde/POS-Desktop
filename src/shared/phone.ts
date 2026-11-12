// Pakistani mobile numbers written any usual way (+92 309 0002036, 0092-309-0002036, 923090002036) are saved as
// 03090002036: digits only, the way the owner types them. WhatsApp links are built from this (`toWhatsAppNumber`).
// Anything else (a landline, another country) is kept as it was typed.
export function tidyPhone(value: string): string {
  const typed = value.trim()
  const digits = typed.replace(/\D/g, '')
  if (/^0092\d{10}$/.test(digits)) return `0${digits.slice(4)}`
  if (/^92\d{10}$/.test(digits)) return `0${digits.slice(2)}`
  if (/^0\d{10}$/.test(digits)) return digits
  return typed
}

// True when WhatsApp can open a chat with this number (a Pakistani mobile: 03XX XXXXXXX).
export const isWhatsAppReady = (phone: string): boolean => /^03\d{9}$/.test(tidyPhone(phone))
