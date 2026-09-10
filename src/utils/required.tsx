const Required = ({ data }: { data: boolean }) => {
  return data ? <span className='text-Red7 font-bold text-xl'>*</span> : null
}
export { Required }
