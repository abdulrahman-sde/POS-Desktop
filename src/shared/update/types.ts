// version: the app that is running. readyVersion: a newer version that is downloaded and waiting for a restart.
export type UpdateStatus = { version: string; readyVersion: string | null }
