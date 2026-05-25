import { redirect } from 'next/navigation'

export default function TalentBillingRedirect() {
  redirect('/talent/dashboard/settings/invoices')
}
