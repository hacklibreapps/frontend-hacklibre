declare module 'written-number' {
  interface WrittenNumberOptions {
    lang?: string
  }

  const writtenNumber: (value: number, options?: WrittenNumberOptions) => string

  export default writtenNumber
}
