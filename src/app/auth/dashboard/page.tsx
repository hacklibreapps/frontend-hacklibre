import AdministradorDashboard from '@/components/organism/auth/dashboard/dashboard'

export async function generateMetadata() {
  return {
    title: 'Escritorio'
  }
}

export default function DashBoardPage() {
  return <AdministradorDashboard />
}
