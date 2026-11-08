import { ipcMain } from 'electron'
import type { ZodType } from 'zod'

import type { ApiResult } from '@shared/result'

// Throw this for a mistake the owner can fix ("A product with this name already exists.").
// The message is sent to the screen as it is, so write it in plain words.
export class UserError extends Error {}

// Registers one backend route. Every route in the app goes through this function, so every route:
//   1. checks the incoming data against its Zod schema (the backend never trusts the screen),
//   2. runs your function,
//   3. answers { ok, data } or { ok:false, message } instead of throwing.
export function handle<Input, Output>(
  channel: string,
  schema: ZodType<Input> | null,
  run: (input: Input) => Output | Promise<Output>
): void {
  ipcMain.handle(channel, async (_event, raw: unknown): Promise<ApiResult<Output>> => {
    try {
      let input = undefined as Input
      if (schema) {
        const parsed = schema.safeParse(raw)
        if (!parsed.success) {
          return {
            ok: false,
            message: parsed.error.issues[0]?.message ?? 'Please check what you typed.'
          }
        }
        input = parsed.data
      }
      return { ok: true, data: await run(input) }
    } catch (error) {
      if (error instanceof UserError) return { ok: false, message: error.message }
      // Anything else is our bug, not the owner's mistake: keep the detail in the log.
      console.error(`[${channel}]`, error)
      return { ok: false, message: 'Something went wrong. Please try again.' }
    }
  })
}
