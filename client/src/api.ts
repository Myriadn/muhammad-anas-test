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

export const fetchEntities = async (): Promise<Entity[]> => {
  const res = await fetch(`${BASE_URL}/entities`)
  if (!res.ok) throw new Error('Failed to fetch entities')
  const json = await res.json()
  return json.data
}