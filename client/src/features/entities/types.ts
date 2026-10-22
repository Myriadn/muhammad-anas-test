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