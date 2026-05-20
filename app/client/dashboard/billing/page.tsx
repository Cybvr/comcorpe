import { redirect } from 'next/navigation'

export default function ClientBillingRedirect() {
  redirect('/client/dashboard/settings/billing')
}
