import { useState } from 'react'
import { toast } from 'sonner'

import { addProductSchema } from '@shared/products/schema'
import { useCategories } from '@/features/categories/hooks/use-categories'
import { toNumber } from '@/lib/format'
import type { ProductFormErrors, ProductFormFields, ProductFormProps } from '../types'
import { autoSalePrice } from '../utils'
import { useAddProduct, useUpdateProduct } from './use-product-mutations'

const fieldOf: Record<string, string> = { categoryId: 'category' }

export function useProductForm({
  product,
  draft,
  stockFromBill,
  onSaved,
  onDone
}: ProductFormProps) {
  const addProduct = useAddProduct()
  const updateProduct = useUpdateProduct()
  const { categories } = useCategories()
  const [form, setForm] = useState<ProductFormFields>({
    name: draft?.values.name ?? product?.name ?? '',
    category: draft?.values.category ?? product?.category ?? categories[0]?.name ?? '',
    brand: draft?.values.brand ?? product?.brand ?? '',
    costPrice: String(draft?.values.costPrice ?? product?.costPrice ?? ''),
    salePrice: String(draft ? (draft.values.salePrice ?? '') : (product?.salePrice ?? '')),
    stock: draft ? String(draft.values.quantity) : product ? String(product.stock) : '',
    reorderLevel: String(draft?.values.reorderLevel ?? product?.reorderLevel ?? '5'),
    shelf: draft?.values.shelf ?? product?.shelf ?? ''
  })
  const [errors, setErrors] = useState<ProductFormErrors>({})

  const askStock = draft ? true : !stockFromBill
  const saving = addProduct.isPending || updateProduct.isPending

  const categoryNames = categories.map((c) => c.name)
  if (form.category && !categoryNames.includes(form.category)) categoryNames.push(form.category)

  const cost = toNumber(form.costPrice)
  const suggested = cost > 0 ? autoSalePrice(cost) : 0
  const price = toNumber(form.salePrice) > 0 ? toNumber(form.salePrice) : suggested
  const profit = price - cost

  const text = (key: keyof ProductFormFields) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }))
    setErrors((prev) => ({ ...prev, [key]: '' }))
  }

  const pick = (key: keyof ProductFormFields) => (value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: '' }))
  }

  const submit = async (): Promise<void> => {
    const category = categories.find((c) => c.name === form.category)
    const stock = askStock ? toNumber(form.stock) : 0
    const checked = addProductSchema.safeParse({
      name: form.name,
      categoryId: category?.id ?? (draft && form.category ? 'new-category' : ''),
      brand: form.brand,
      costPrice: cost,
      salePrice: form.salePrice.trim() === '' ? undefined : toNumber(form.salePrice),
      stock,
      reorderLevel: toNumber(form.reorderLevel),
      shelf: form.shelf
    })

    const next: ProductFormErrors = {}
    if (!checked.success) {
      for (const issue of checked.error.issues) {
        const key = String(issue.path[0])
        next[fieldOf[key] ?? key] ??= issue.message
      }
    }
    if (askStock && form.stock.trim() === '') next.stock = 'Enter how many you have.'
    setErrors(next)
    if (!checked.success || Object.keys(next).length > 0) return
    const values = checked.data

    if (draft) {
      draft.onSave({
        name: values.name,
        category: form.category,
        brand: values.brand ?? '',
        costPrice: values.costPrice,
        salePrice: values.salePrice ?? null,
        quantity: stock,
        reorderLevel: values.reorderLevel ?? 5,
        shelf: values.shelf ?? ''
      })
      onDone()
      return
    }

    try {
      if (product) {
        await updateProduct.mutateAsync({
          id: product.id,
          name: values.name,
          categoryId: values.categoryId,
          brand: values.brand,
          costPrice: values.costPrice,
          salePrice: price,
          reorderLevel: values.reorderLevel,
          shelf: values.shelf,
          stock
        })
      } else {
        const saved = await addProduct.mutateAsync(values)
        onSaved?.(saved)
      }
      onDone()
    } catch (error) {
      const message = (error as Error).message
      if (message.includes('name')) setErrors({ name: message })
      else toast.error(message)
    }
  }

  return {
    form,
    errors,
    askStock,
    saving,
    categoryNames,
    cost,
    suggested,
    price,
    profit,
    text,
    pick,
    submit
  }
}
