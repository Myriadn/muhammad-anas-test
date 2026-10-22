import { useQuery } from "@tanstack/react-query"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import { fetchEntities } from "./api"
import L from 'leaflet'
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconAnchor: [12, 41]
})
L.Marker.prototype.options.icon = DefaultIcon

function App() {
  const { data: entities, isLoading, error } = useQuery({
    queryKey: ['entities'],
    queryFn: fetchEntities,
  })

  if (isLoading) return <div style={{ padding: '20px' }}>Loading map...</div>
  if (error) return <div style={{ padding: '20px', color: 'red' }}>Error: {error.message}</div>

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <MapContainer 
        center={[-2.548926, 118.0148634]}
        zoom={5} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {entities?.map((entity) => (
          <Marker key={entity.id} position={[entity.latitude, entity.longitude]}>
            <Popup>
              <strong>{entity.name}</strong><br/>
              Type: {entity.type}<br/>
              Status: {entity.status}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

export default App
