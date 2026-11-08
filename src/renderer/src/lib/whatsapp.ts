// Turns a saved phone number into the international digits WhatsApp needs.
// 0300 1234567 + country code 92  ->  923001234567
export function toWhatsAppNumber(phone: string, countryCode: string): string | null {
  let digits = phone.replace(/\D/g, '')
  if (!digits) return null
  if (digits.startsWith('00')) digits = digits.slice(2)
  else if (digits.startsWith('0')) digits = countryCode + digits.slice(1)
  return digits
}

// Opens WhatsApp with the message already typed. In Electron, window.open() is caught by the
// main process (setWindowOpenHandler in src/main/index.ts) and opened in the system browser /
// WhatsApp app, so the user only has to press Send.
export function openWhatsApp(phone: string, countryCode: string, message: string): boolean {
  const number = toWhatsAppNumber(phone, countryCode)
  if (!number) return false
  window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, '_blank')
  return true
}
