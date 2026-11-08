import { useState } from 'react'

import { addCategorySchema } from '@shared/categories/schema'
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
import { useAddCategory, useRenameCategory } from '../hooks/use-category-mutations'
import type { CategoryFormDialogProps, CategoryFormProps } from '../types'

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

function CategoryForm({ category, onSaved, onDone }: CategoryFormProps): React.JSX.Element {
  const addCategory = useAddCategory()
  const renameCategory = useRenameCategory()
  const [name, setName] = useState(category?.name ?? '')
  const [error, setError] = useState('')

  const submit = async (): Promise<void> => {
    const checked = addCategorySchema.safeParse({ name })
    if (!checked.success) return setError(checked.error.issues[0].message)
    const value = checked.data.name

    try {
      if (category) await renameCategory.mutateAsync({ id: category.id, name: value })
      else await addCategory.mutateAsync(value)
      onSaved?.(value)
      onDone()
    } catch (error) {
      setError((error as Error).message)
    }
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
        <Button onClick={submit} disabled={addCategory.isPending || renameCategory.isPending}>
          {category ? 'Save' : 'Add category'}
        </Button>
      </DialogFooter>
    </>
  )
}
