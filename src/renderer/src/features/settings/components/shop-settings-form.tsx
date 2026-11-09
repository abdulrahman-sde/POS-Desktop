import { FormField } from '@/components/shared/form-field'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useSettings } from '../hooks/use-settings'
import { useSettingsForm } from '../hooks/use-settings-form'
import type { ShopSettingsFormProps } from '../types'

export function ShopSettingsForm(): React.JSX.Element | null {
  const { settings, isLoading } = useSettings()
  if (isLoading) return null
  return <SettingsFields settings={settings} />
}

function SettingsFields(props: ShopSettingsFormProps): React.JSX.Element {
  const { form, errors, saving, set, submit } = useSettingsForm(props)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shop settings</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <FormField label="Shop name" htmlFor="st-name" error={errors.shopName}>
            <Input id="st-name" value={form.shopName} onChange={set('shopName')} />
          </FormField>
          <FormField label="Owner name" htmlFor="st-owner" error={errors.ownerName}>
            <Input id="st-owner" value={form.ownerName} onChange={set('ownerName')} />
          </FormField>
          <FormField label="Phone" htmlFor="st-phone" error={errors.phone}>
            <Input id="st-phone" type="tel" value={form.phone} onChange={set('phone')} />
          </FormField>
          <FormField
            label="Phone code for WhatsApp"
            htmlFor="st-code"
            error={errors.countryCode}
            hint="Pakistan is 92"
          >
            <Input id="st-code" value={form.countryCode} onChange={set('countryCode')} />
          </FormField>
        </div>
        <FormField label="Address" htmlFor="st-address" error={errors.address}>
          <Input id="st-address" value={form.address} onChange={set('address')} />
        </FormField>
        <FormField label="Invoice footer note" htmlFor="st-note" error={errors.invoiceNote}>
          <Textarea id="st-note" value={form.invoiceNote} onChange={set('invoiceNote')} />
        </FormField>

        <div className="mt-2 flex flex-col gap-1 border-t border-foreground/10 pt-4">
          <h3 className="text-sm">Starting values for new products</h3>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <FormField
            label="Warn me when stock is"
            htmlFor="st-reorder"
            error={errors.defaultReorderLevel}
          >
            <Input
              id="st-reorder"
              type="number"
              inputMode="numeric"
              min={0}
              value={form.defaultReorderLevel}
              onChange={set('defaultReorderLevel')}
            />
          </FormField>
          <FormField
            label="Selling price: add this % to the cost price"
            htmlFor="st-markup"
            error={errors.defaultMarkupPercent}
          >
            <Input
              id="st-markup"
              type="number"
              inputMode="decimal"
              step="any"
              min={0}
              value={form.defaultMarkupPercent}
              onChange={set('defaultMarkupPercent')}
            />
          </FormField>
        </div>
        <div>
          <Button onClick={submit} disabled={saving}>
            Save settings
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
