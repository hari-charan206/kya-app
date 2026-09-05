// Temporary hardcoded role mapping for demo purposes — real deployment
// would read this from a roles table, not a hardcoded list.
const SENIOR_ADMINS = ['hcharan1224@gmail.com']

export function getRole(email: string | undefined | null): 'senior_admin' | 'analyst' {
  if (email && SENIOR_ADMINS.includes(email)) return 'senior_admin'
  return 'analyst'
}