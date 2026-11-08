import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

import { categoriesPreload } from './modules/categories'
import { customersPreload } from './modules/customers'
import { productsPreload } from './modules/products'

// Everything the screen may ask the backend to do. Add a line here when you add a module.
// This list is the ONLY door from the React app to the computer: anything not listed here
// cannot be reached from the screen.
export const api = {
  categories: categoriesPreload,
  customers: customersPreload,
  products: productsPreload
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
