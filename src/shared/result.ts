// What every backend call (IPC route) answers with. The main process never throws to the
// screen: it answers { ok: true, data } or { ok: false, message }, where message is a plain
// sentence the owner can read. Electron would otherwise wrap a thrown error in ugly text.
export type ApiResult<T> = { ok: true; data: T } | { ok: false; message: string }
