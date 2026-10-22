import type { Entity } from "../types"


interface Props {
  entities: Entity[]
  selectedId?: number
  onSelect: (e: Entity) => void
  onAddClick: () => void
}

export function EntitySidebar({ entities, selectedId, onSelect, onAddClick }: Props) {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Entity List</h2>
        <button className="add-btn" onClick={onAddClick}>+ Add New Entity</button>
      </div>
      <div className="entity-list">
        {entities.map((entity) => (
          <div 
            key={entity.id} 
            className={`entity-item ${selectedId === entity.id ? 'active' : ''}`}
            onClick={() => onSelect(entity)}
          >
            <h3>{entity.name}</h3>
            <span className="badge">{entity.type}</span>
          </div>
        ))}
      </div>
    </div>
  )
}