import { ChildrenInterface } from "@/interfaces/structures/childrenInterface"

interface FormularyInterface extends ChildrenInterface {
  onSubmit: (e: React.FormEvent) => Promise<void>
  method?: string
  autoComplete?: string
  className?:string
}

const Formulary: React.FC<FormularyInterface> = ({
  children,
  onSubmit,
  method,
  autoComplete,
  className
}) => {
  const formMethod = method ? method : 'POST'
  const formAutoComplete = autoComplete ? autoComplete : 'OFF'
  return (
    <form
      action=''
      autoComplete={formAutoComplete}
      method={formMethod}
      onSubmit={onSubmit}
      className={className}
    >
      {children}
    </form>
  )
}
export default Formulary
