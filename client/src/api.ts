const BASE_URL = 'http://localhost:9002/api'

export type Entity = {
  id: number
  name: string
  type: 'vehicle' | 'iot' | 'facility'
  status: 'active' | 'inactive' | 'maintenance'
  latitude: number
  longitude: number
  description: string
  created_at: string
  updated_at: string
}

export type EntityInput = Omit<Entity, 'id' | 'created_at' | 'updated_at'>

export const createEntity = async (data: EntityInput) => {
  const res = await fetch(`${BASE_URL}/entities`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Failed to create')
  }
  return res.json()
}

export const updateEntity = async (id: number, data: EntityInput) => {
  const res = await fetch(`${BASE_URL}/entities/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Failed to update')
  }
  return res.json()
}

export const deleteEntity = async (id: number) => {
  const res = await fetch(`${BASE_URL}/entities/${id}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error('Failed to delete')
  return true
}

export const fetchEntities = async (): Promise<Entity[]> => {
  const res = await fetch(`${BASE_URL}/entities`)
  if (!res.ok) throw new Error('Failed to fetch entities')
  const json = await res.json()
  return json.data
}