import { useState } from 'react'
import { toast } from 'sonner'

import { useData } from '@/app/providers/data-context'
import { FormField } from '@/components/shared/form-field'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import type { Category } from '../types'

type CategoryFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: Category // when set, we are renaming
  onSaved?: (name: string) => void
}

export function CategoryFormDialog({
  open,
  onOpenChange,
  category,
  onSaved
}: CategoryFormDialogProps): React.JSX.Element {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        {open ? (
          <CategoryForm category={category} onSaved={onSaved} onDone={() => onOpenChange(false)} />
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

function CategoryForm({
  category,
  onSaved,
  onDone
}: {
  category?: Category
  onSaved?: (name: string) => void
  onDone: () => void
}): React.JSX.Element {
  const { categories, addCategory, renameCategory } = useData()
  const [name, setName] = useState(category?.name ?? '')
  const [error, setError] = useState('')

  const submit = (): void => {
    const value = name.trim()
    if (!value) return setError('Type the category name.')
    const taken = categories.some(
      (c) => c.id !== category?.id && c.name.toLowerCase() === value.toLowerCase()
    )
    if (taken) return setError('You already have a category with this name.')

    if (category) {
      renameCategory(category.id, value)
      toast.success('Category renamed')
    } else {
      addCategory(value)
      toast.success(`${value} added`)
    }
    onSaved?.(value)
    onDone()
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{category ? 'Rename category' : 'Add category'}</DialogTitle>
        <DialogDescription>
          {category
            ? 'The new name is also changed on all products in this category.'
            : 'A category is a group of similar items, like Batteries or Chargers.'}
        </DialogDescription>
      </DialogHeader>
      <FormField label="Category name" htmlFor="cat-name" error={error}>
        <Input
          id="cat-name"
          autoFocus
          value={name}
          placeholder="e.g. Phone Holders"
          onChange={(event) => {
            setName(event.target.value)
            setError('')
          }}
          onKeyDown={(event) => event.key === 'Enter' && submit()}
        />
      </FormField>
      <DialogFooter>
        <Button variant="outline" onClick={onDone}>
          Cancel
        </Button>
        <Button onClick={submit}>{category ? 'Save' : 'Add category'}</Button>
      </DialogFooter>
    </>
  )
}
