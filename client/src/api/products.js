import { API_URL, request } from './http'

export function listProducts(category) {
  const query = category ? `?category=${encodeURIComponent(category)}` : ''
  return request(`/products${query}`)
}

export function createProduct(product) {
  return request('/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  })
}

export function updateProduct(id, product) {
  return request(`/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  })
}

export function deleteProduct(id) {
  return request(`/products/${id}`, { method: 'DELETE' })
}

export async function uploadImage(file) {
  const formData = new FormData()
  formData.append('image', file)

  const res = await fetch(`${API_URL}/upload`, { method: 'POST', body: formData })
  const body = await res.json().catch(() => null)

  if (!res.ok) {
    throw new Error(body?.error || `Erro ${res.status}`)
  }

  return body.data.url
}
