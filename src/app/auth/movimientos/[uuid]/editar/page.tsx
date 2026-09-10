import MovimientoBancarioMod from '@/components/organism/auth/movimientobancario/movimientoBancarioMod'

export default async function EditarMovimientoBancarioPage({
  params
}: {
  params: { uuid: string }
}) {
  const { uuid } = params
  return <MovimientoBancarioMod uuid={uuid} />
}
