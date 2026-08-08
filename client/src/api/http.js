export const API_URL = import.meta.env.VITE_API_URL || '/api'

export async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, options)
  const body = await res.json().catch(() => null)

  if (!res.ok) {
    throw new Error(body?.error || `Erro ${res.status}`)
  }

  return body?.data
}
