// Whether the password has been entered since the app opened. Memory only, so every start is locked.
let unlocked = false

export const isUnlocked = (): boolean => unlocked
export const setUnlocked = (value: boolean): void => {
  unlocked = value
}
