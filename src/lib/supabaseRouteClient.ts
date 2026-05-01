import type { NextApiRequest, NextApiResponse } from 'next'
import { createServerClient, serializeCookieHeader } from '@supabase/ssr'

export function createRouteClient(req: NextApiRequest, res: NextApiResponse) {
  // Methods for config cookies
  const getAll = () =>
    Object.entries(req.cookies).map(([name, value]) => ({
      name,
      value: value!,
    }))
  const setAll = (
    cookiesToSet: { name: string; value: string; options: any }[],
  ) => {
    const existing = res.getHeader('Set-Cookie')
    const newCookies = cookiesToSet.map(({ name, value, options }) =>
      serializeCookieHeader(name, value, options),
    )
    const allCookies = existing
      ? [
          ...(Array.isArray(existing) ? existing : [String(existing)]),
          ...newCookies,
        ]
      : newCookies
    res.setHeader('Set-Cookie', allCookies)
  }
  // Create client
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll,
        setAll,
      },
    },
  )
}
