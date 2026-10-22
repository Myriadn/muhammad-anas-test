import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet"
import { createEntity, deleteEntity, fetchEntities, updateEntity, type Entity, type EntityInput } from "./api"
import L from 'leaflet'
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'
import './App.css'
import { useState } from "react"
import EntityForm from "./EntityForm"

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconAnchor: [12, 41]
})
L.Marker.prototype.options.icon = DefaultIcon

function App() {
  const queryClient = useQueryClient()
  const [selected, setSelected] = useState<Entity | null>(null)

  // state untuk form
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingEntity, setEditingEntity] = useState<Entity | null>(null)
  const [apiError, setApiError] = useState('')

  // Fetch Data
  const { data: entities, isLoading, error } = useQuery({
    queryKey: ['entities'],
    queryFn: fetchEntities,
  })

  // Mutations
  const mutationCreate = useMutation({
    mutationFn: createEntity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entities'] })
      closeForm()
    },
    onError: (err: any) => setApiError(err.message)
  })

  const mutationUpdate = useMutation({
    mutationFn: (data: EntityInput) => updateEntity(editingEntity!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entities'] })
      closeForm()
    },
    onError: (err: any) => setApiError(err.message)
  })

  const mutationDelete = useMutation({
    mutationFn: deleteEntity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entities'] })
      setSelected(null)
    }
  })

  // Handlers
  const closeForm = () => {
    setIsFormOpen(false)
    setEditingEntity(null)
    setApiError('')
  }

  const handleFormSubmit = (data: EntityInput) => {
    setApiError('')
    if (editingEntity) {
      mutationUpdate.mutate(data)
    } else {
      mutationCreate.mutate(data)
    }
  }

  const handleDelete = (id: number) => {
    if (window.confirm('Yakin mau hapus entity ini?')) {
      mutationDelete.mutate(id)
    }
  }

  if (isLoading) return <div style={{ padding: '20px' }}>Loading map...</div>
  if (error) return <div style={{ padding: '20px', color: 'red' }}>Error: {error.message}</div>

  return (
    <div className="app-container">
      
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Entity List</h2>
          <button className="add-btn" onClick={() => setIsFormOpen(true)}>
            Add New Entity
          </button>
        </div>
        <div className="entity-list">
          {entities?.map((entity) => (
            <div 
              key={entity.id} 
              className={`entity-item ${selected?.id === entity.id ? 'active' : ''}`}
              onClick={() => setSelected(entity)}
            >
              <h3>{entity.name}</h3>
              <span className="badge">{entity.type}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="map-container">
      <MapContainer 
        center={[-2.548926, 118.0148634]}
        zoom={5} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapController center={selected ? [selected.latitude, selected.longitude] : null} />

        {entities?.map((entity) => (
          <Marker 
            key={entity.id} 
            position={[entity.latitude, entity.longitude]}
            eventHandlers={{
              click: () => setSelected(entity)
            }}
          />
        ))}
      </MapContainer>

      {/* Panel Details (EDIT / DELETE) */}
      {selected && (
          <div className="detail-panel">
            <button className="close-btn" onClick={() => setSelected(null)}>×</button>
            <h2>{selected.name}</h2>
            <p><strong>Type:</strong> {selected.type}</p>
            <p><strong>Status:</strong> {selected.status}</p>
            <p><strong>Desc:</strong> {selected.description || '-'}</p>
            <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '16px' }}>
              Lat: {selected.latitude}, Lng: {selected.longitude}
            </p>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                className="btn-secondary" 
                style={{ flex: 1 }}
                onClick={() => { setEditingEntity(selected); setIsFormOpen(true); }}
              >
                Edit
              </button>
              <button 
                className="btn-danger" 
                style={{ flex: 1 }}
                onClick={() => handleDelete(selected.id)}
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Form */}
      {isFormOpen && (
        <EntityForm 
          initialData={editingEntity}
          onSubmit={handleFormSubmit}
          onCancel={closeForm}
          isLoading={mutationCreate.isPending || mutationUpdate.isPending}
          errorMsg={apiError}
        />
      )}
    </div>

    
  )
}

function MapController({ center }: { center: [number, number] | null }) {
  const map = useMap()
  if (center) {
    map.flyTo(center, 12, { duration: 1.5 })
  }
  return null
}

export default App
