import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxSearch,
  ComboboxTrigger,
  ComboboxValue
} from '@/components/ui/combobox'
import { matchesSearch } from '@/lib/search'
import type { Option } from './option-select'

type SearchableSelectProps = {
  id?: string
  value: string
  onValueChange: (value: string) => void
  options: Option[]
  placeholder?: string
  className?: string
  disabled?: boolean
}

// Like OptionSelect, with a search box on top of the list. Typing narrows the options by their label and by the
// option's `keywords` (for a customer: the phone number). Use it for lists that can get long.
export function SearchableSelect({
  id,
  value,
  onValueChange,
  options,
  placeholder,
  className,
  disabled
}: SearchableSelectProps): React.JSX.Element {
  const selected = options.find((option) => option.value === value) ?? null

  return (
    <Combobox
      items={options}
      value={selected}
      disabled={disabled}
      itemToStringLabel={(option) => option.label}
      isItemEqualToValue={(a, b) => a.value === b.value}
      filter={(option, query) => matchesSearch(query, [option.label, option.keywords ?? ''])}
      onValueChange={(next) => {
        if (next) onValueChange(next.value)
      }}
    >
      <ComboboxTrigger id={id} className={className ?? 'w-full'}>
        <ComboboxValue>
          {(option: Option | null) =>
            option ? (
              <span>{option.label}</span>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )
          }
        </ComboboxValue>
      </ComboboxTrigger>
      <ComboboxContent>
        <ComboboxSearch placeholder="Search" />
        <ComboboxEmpty>No match.</ComboboxEmpty>
        <ComboboxList>
          {(option: Option) => (
            <ComboboxItem key={option.value} value={option}>
              {option.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
