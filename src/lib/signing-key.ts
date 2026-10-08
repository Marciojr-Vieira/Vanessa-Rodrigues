export function signingKey() {
  const secret = process.env.JWT_SECRET
  if (!secret || secret.length < 32 || secret.startsWith('CHANGE_ME')) throw new Error('Configure JWT_SECRET com pelo menos 32 caracteres aleatórios.')
  return new TextEncoder().encode(secret)
}
