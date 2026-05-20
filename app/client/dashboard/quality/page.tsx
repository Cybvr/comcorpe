import { redirect } from 'next/navigation'

export default function ClientQualityRedirect() {
  redirect('/client/dashboard/settings/quality')
}
