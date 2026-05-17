/**
 * Seeds Firebase Auth email/password users for local seeded Comcorpe accounts.
 *
 * Reads COMCORPE_LOGIN_PASSWORD from .env.local and creates missing
 * @comcorpe.com auth users with that password. Existing users with the same
 * password are left alone. Existing users with a different password are
 * reported because the public Auth API cannot reset them.
 */

import { resolve } from 'path'
import { config } from 'dotenv'

config({ path: resolve(process.cwd(), '.env.local') })

import { clientUsers, users } from '../lib/user'

const ALLOWED_DOMAIN = '@comcorpe.com'

type SeedUser = {
  id: string
  email: string
  name: string
}

type AuthResult =
  | { status: 'ready'; email: string }
  | { status: 'created'; email: string }
  | { status: 'password-mismatch'; email: string }
  | { status: 'failed'; email: string; message: string }

const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
const password = process.env.COMCORPE_LOGIN_PASSWORD

if (!apiKey) throw new Error('Missing NEXT_PUBLIC_FIREBASE_API_KEY')
if (!password) throw new Error('Missing COMCORPE_LOGIN_PASSWORD')

function seededUsers(): SeedUser[] {
  const adminUsers: SeedUser[] = [
    {
      id: 'jide-pinheiro',
      name: 'Jide Pinheiro',
      email: 'jide.pinheiro@comcorpe.com',
    },
  ]

  const records = [
    ...users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email || `${user.id}@comcorpe.com`,
    })),
    ...clientUsers.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email || `${user.id}@comcorpe.com`,
    })),
    ...adminUsers,
  ].filter(user => user.email.toLowerCase().endsWith(ALLOWED_DOMAIN))

  return Array.from(new Map(records.map(user => [user.email.toLowerCase(), user])).values())
}

async function authRequest(endpoint: string, body: object) {
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/${endpoint}?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
  )
  const data = await response.json()
  return { ok: response.ok, data }
}

function authMessage(data: unknown): string {
  if (
    data &&
    typeof data === 'object' &&
    'error' in data &&
    data.error &&
    typeof data.error === 'object' &&
    'message' in data.error &&
    typeof data.error.message === 'string'
  ) {
    return data.error.message
  }
  return 'UNKNOWN_ERROR'
}

async function ensureUser(user: SeedUser): Promise<AuthResult> {
  const signIn = await authRequest('accounts:signInWithPassword', {
    email: user.email,
    password,
    returnSecureToken: true,
  })

  if (signIn.ok) return { status: 'ready', email: user.email }

  const create = await authRequest('accounts:signUp', {
    email: user.email,
    password,
    displayName: user.name,
    returnSecureToken: true,
  })

  if (create.ok) return { status: 'created', email: user.email }

  const message = authMessage(create.data)
  if (message === 'EMAIL_EXISTS') {
    return { status: 'password-mismatch', email: user.email }
  }

  return { status: 'failed', email: user.email, message }
}

async function main() {
  const records = seededUsers()
  const results: AuthResult[] = []

  for (const user of records) {
    results.push(await ensureUser(user))
  }

  const ready = results.filter(result => result.status === 'ready')
  const created = results.filter(result => result.status === 'created')
  const mismatched = results.filter(result => result.status === 'password-mismatch')
  const failed = results.filter(result => result.status === 'failed')

  console.log(`Firebase Auth users checked: ${results.length}`)
  console.log(`Already valid: ${ready.length}`)
  console.log(`Created: ${created.length}`)
  console.log(`Existing with different password: ${mismatched.length}`)
  console.log(`Failed: ${failed.length}`)

  if (mismatched.length > 0) {
    console.log('\nExisting users that do not currently use COMCORPE_LOGIN_PASSWORD:')
    for (const result of mismatched) console.log(`- ${result.email}`)
  }

  if (failed.length > 0) {
    console.log('\nFailures:')
    for (const result of failed) {
      if (result.status === 'failed') console.log(`- ${result.email}: ${result.message}`)
    }
    process.exitCode = 1
  }
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
