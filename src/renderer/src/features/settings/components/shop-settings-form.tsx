import { useState } from 'react'
import { toast } from 'sonner'

import { useData } from '@/app/providers/data-context'
import { FormField } from '@/components/shared/form-field'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export function ShopSettingsForm(): React.JSX.Element {
  const { settings, updateSettings } = useData()
  const [form, setForm] = useState(settings)

  const set =
    (key: keyof typeof form) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: event.target.value }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shop details</CardTitle>
        <CardDescription>These appear on every invoice and WhatsApp message.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <FormField label="Shop name" htmlFor="st-name">
            <Input id="st-name" value={form.shopName} onChange={set('shopName')} />
          </FormField>
          <FormField label="Owner name" htmlFor="st-owner">
            <Input id="st-owner" value={form.ownerName} onChange={set('ownerName')} />
          </FormField>
          <FormField label="Phone" htmlFor="st-phone">
            <Input id="st-phone" type="tel" value={form.phone} onChange={set('phone')} />
          </FormField>
          <FormField
            label="Phone code for WhatsApp"
            htmlFor="st-code"
            hint="Pakistan is 92. This lets WhatsApp open on numbers like 0300..."
          >
            <Input id="st-code" value={form.countryCode} onChange={set('countryCode')} />
          </FormField>
        </div>
        <FormField label="Address" htmlFor="st-address">
          <Input id="st-address" value={form.address} onChange={set('address')} />
        </FormField>
        <FormField label="Invoice footer note" htmlFor="st-note">
          <Textarea id="st-note" value={form.invoiceNote} onChange={set('invoiceNote')} />
        </FormField>
        <div>
          <Button
            onClick={() => {
              updateSettings(form)
              toast.success('Settings saved')
            }}
          >
            Save settings
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
