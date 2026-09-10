export const todayDate = (): string => new Date().toISOString().slice(0, 10)
export const todayTime = (): string => new Date().toISOString().slice(11, 19)
export const todayDateTime = (): string =>
  new Date().toISOString().slice(0, 19) + 'Z'
