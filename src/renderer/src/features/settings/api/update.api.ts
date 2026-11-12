export const updateApi = {
  status: () => window.api.update.status(),
  install: () => window.api.update.install(),
  onReady: (callback: (version: string) => void) => window.api.update.onReady(callback)
}
