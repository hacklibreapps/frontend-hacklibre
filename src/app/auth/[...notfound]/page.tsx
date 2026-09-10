import { ErrorPages } from '@/components/atom/errorPages'

export default function AuthCatchAll() {
  return <ErrorPages error='404' isAuth />
}
