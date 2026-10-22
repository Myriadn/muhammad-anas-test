import { useQuery } from "@tanstack/react-query"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import { fetchEntities, type Entity } from "./api"
import L from 'leaflet'
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'
import './App.css'
import { useState } from "react"

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconAnchor: [12, 41]
})
L.Marker.prototype.options.icon = DefaultIcon

function App() {
  const [selected, setSelected] = useState<Entity | null>(null)

  const { data: entities, isLoading, error } = useQuery({
    queryKey: ['entities'],
    queryFn: fetchEntities,
  })

  if (isLoading) return <div style={{ padding: '20px' }}>Loading map...</div>
  if (error) return <div style={{ padding: '20px', color: 'red' }}>Error: {error.message}</div>

  return (
    <div className="app-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Entity List</h2>
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

      <div className="map-container">
      <MapContainer 
        center={[-2.548926, 118.0148634]}
        zoom={5} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

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

      {selected && (
          <div className="detail-panel">
            <button className="close-btn" onClick={() => setSelected(null)}>×</button>
            <h2>{selected.name}</h2>
            <p><strong>Type:</strong> {selected.type}</p>
            <p><strong>Status:</strong> {selected.status}</p>
            <p><strong>Desc:</strong> {selected.description || '-'}</p>
            <p style={{ fontSize: '12px', color: '#9ca3af' }}>
              Lat: {selected.latitude}, Lng: {selected.longitude}
            </p>
          </div>
        )}
      </div>
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
