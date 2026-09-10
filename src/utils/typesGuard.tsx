export function hasProperty<T>(model: T | null, property: string): model is T {
  return model !== null && typeof model === 'object' && property in model
}
