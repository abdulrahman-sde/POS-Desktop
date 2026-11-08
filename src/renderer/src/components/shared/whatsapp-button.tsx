import { Chat } from 'reicon-react'
import { toast } from 'sonner'

import { useData } from '@/app/providers/data-context'
import { Button } from '@/components/ui/button'
import { openWhatsApp, toWhatsAppNumber } from '@/lib/whatsapp'

type WhatsAppButtonProps = {
  phone: string | undefined
  message: string
  label?: string
  variant?: 'default' | 'outline' | 'secondary' | 'success'
}

export function WhatsAppButton({
  phone,
  message,
  label = 'Send on WhatsApp',
  variant = 'success'
}: WhatsAppButtonProps): React.JSX.Element {
  const { settings } = useData()
  const hasNumber = Boolean(phone && toWhatsAppNumber(phone, settings.countryCode))

  return (
    <Button
      variant={variant}
      disabled={!hasNumber}
      title={hasNumber ? undefined : 'No phone number saved for this customer'}
      onClick={() => {
        if (phone && openWhatsApp(phone, settings.countryCode, message)) {
          toast.success('WhatsApp opened with the message ready to send')
        }
      }}
    >
      <Chat data-icon="inline-start" />
      {label}
    </Button>
  )
}
