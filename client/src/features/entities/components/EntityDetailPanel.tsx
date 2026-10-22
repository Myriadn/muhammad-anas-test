import type { Entity } from "../types"

interface Props {
  entity: Entity
  onClose: () => void
  onEdit: (e: Entity) => void
  onDelete: (id: number) => void
}

export function EntityDetailPanel({ entity, onClose, onEdit, onDelete }: Props) {
  return (
    <div className="detail-panel">
      <button className="close-btn" onClick={onClose}>×</button>
      <h2>{entity.name}</h2>
      <p><strong>Type:</strong> {entity.type}</p>
      <p><strong>Status:</strong> {entity.status}</p>
      <p><strong>Desc:</strong> {entity.description || '-'}</p>
      <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '16px' }}>
        Lat: {entity.latitude}, Lng: {entity.longitude}
      </p>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button className="btn-secondary" style={{ flex: 1 }} onClick={() => onEdit(entity)}>Edit</button>
        <button className="btn-danger" style={{ flex: 1 }} onClick={() => onDelete(entity.id)}>Delete</button>
      </div>
    </div>
  )
}