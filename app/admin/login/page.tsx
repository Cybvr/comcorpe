import { redirect } from 'next/navigation'

// Admin login is unified — everyone goes through /login
export default function AdminLoginPage() {
  redirect('/login')
}
