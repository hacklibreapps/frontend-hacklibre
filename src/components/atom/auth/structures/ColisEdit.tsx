import { GrFormEdit } from 'react-icons/gr'

const ColisEdit = ({ title }: { title: string }) => {
  return (
    <div className='flex flex-row justify-center items-center'>
      {title}
      <span
        className='cursor-help'
        data-tooltip-id='tooltip'
        data-tooltip-place='left'
        data-tooltip-content='Campo editable'
      >
        <GrFormEdit />
      </span>
    </div>
  )
}
export { ColisEdit }