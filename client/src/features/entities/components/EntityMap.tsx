import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'

import L from 'leaflet'
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'
import type { Entity } from '../types'

let DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconAnchor: [12, 41] })
L.Marker.prototype.options.icon = DefaultIcon

function MapController({ center }: { center: [number, number] | null }) {
  const map = useMap()
  if (center) map.flyTo(center, 12, { duration: 1.5 })
  return null
}

interface Props {
  entities: Entity[]
  selectedEntity: Entity | null
  onMarkerClick: (e: Entity) => void
}

export function EntityMap({ entities, selectedEntity, onMarkerClick }: Props) {
  return (
    <div className="map-container">
      <MapContainer center={[-2.548926, 118.0148634]} zoom={5} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapController center={selectedEntity ? [selectedEntity.latitude, selectedEntity.longitude] : null} />
        {entities.map((entity) => (
          <Marker 
            key={entity.id} 
            position={[entity.latitude, entity.longitude]}
            eventHandlers={{ click: () => onMarkerClick(entity) }}
          />
        ))}
      </MapContainer>
    </div>
  )
}