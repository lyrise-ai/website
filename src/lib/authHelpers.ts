import { supabaseAdmin } from './supabaseAdmin'

type Role = 'EMPLOYEE' | 'CLIENT'

export async function getRoleForUser(userId: string) {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('role')
    .eq('id', userId)
    .maybeSingle()

  if (error) return { role: null, error: error.message }
  if (!data) return { role: null, error: null }
  return { role: data.role as Role, error: null }
}

export async function canSignUp(
  email: string,
  options: { skipWhitelist?: boolean } = {},
): Promise<{ allowed: boolean; role: Role | null; error: string | null }> {
  if (email.endsWith('@lyrise.ai')) {
    if (!options.skipWhitelist) {
      const { data: whitelistRow, error: whitelistError } = await supabaseAdmin
        .from('employee_whitelist')
        .select('email')
        .eq('email', email)
        .maybeSingle()

      if (whitelistError) {
        return { allowed: false, role: null, error: 'whitelist check failed' }
      }
      if (!whitelistRow) {
        return { allowed: false, role: null, error: 'email not authorized' }
      }
    }
    return { allowed: true, role: 'EMPLOYEE', error: null }
  }

  return { allowed: true, role: 'CLIENT', error: null }
}

export async function createUserRecord(
  email: string,
  userId: string,
  role: Role,
) {
  const { error } = await supabaseAdmin
    .from('users')
    .insert({ id: userId, email, role })

  if (error) return { error: error.message }
  return { error: null }
}
