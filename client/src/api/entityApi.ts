import { type Entity, type EntityInput } from '../features/entities/types'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:9002/api'

export const fetchEntities = async (): Promise<Entity[]> => {
  const res = await fetch(`${BASE_URL}/entities`)
  if (!res.ok) throw new Error('Failed to fetch entities')
  const json = await res.json()
  return json.data
}

export const createEntity = async (data: EntityInput) => {
  const res = await fetch(`${BASE_URL}/entities`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
  })
  if (!res.ok) { const err = await res.json(); throw new Error(err.error || 'Failed to create') }
  return res.json()
}

export const updateEntity = async (id: number, data: EntityInput) => {
  const res = await fetch(`${BASE_URL}/entities/${id}`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
  })
  if (!res.ok) { const err = await res.json(); throw new Error(err.error || 'Failed to update') }
  return res.json()
}

export const deleteEntity = async (id: number) => {
  const res = await fetch(`${BASE_URL}/entities/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete')
  return true
}