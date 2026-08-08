import { request } from './http'

export function listFlyers() {
  return request('/flyers')
}

export function getFlyer(id) {
  return request(`/flyers/${id}`)
}

export function createFlyer(flyer) {
  return request('/flyers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(flyer),
  })
}

export function updateFlyer(id, flyer) {
  return request(`/flyers/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(flyer),
  })
}

export function deleteFlyer(id) {
  return request(`/flyers/${id}`, { method: 'DELETE' })
}
