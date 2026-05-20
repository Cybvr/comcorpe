import { redirect } from 'next/navigation'

export default function ClientReferralsRedirect() {
  redirect('/client/dashboard/settings/referrals')
}
