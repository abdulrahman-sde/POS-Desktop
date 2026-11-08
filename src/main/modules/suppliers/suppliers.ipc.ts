import { addSupplierSchema, updateSupplierSchema } from '@shared/suppliers/schema'
import { idSchema } from '@shared/common'
import { handle } from '../../lib/ipc'
import * as service from './suppliers.service'

export function registerSuppliersIpc(): void {
  handle('suppliers:list', null, () => service.listSuppliers())
  handle('suppliers:add', addSupplierSchema, (input) => service.addSupplier(input))
  handle('suppliers:update', updateSupplierSchema, (input) => service.updateSupplier(input))
  handle('suppliers:remove', idSchema, ({ id }) => service.deleteSupplier(id))
}
