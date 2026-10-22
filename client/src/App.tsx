import { useState } from 'react'

import { EntityMap } from './features/entities/components/EntityMap'
import { EntitySidebar } from './features/entities/components/EntitySidebar'
import { EntityDetailPanel } from './features/entities/components/EntityDetailPanel'


import './App.css'
import { useEntities } from './features/entities/useEntities'
import type { Entity, EntityInput } from './features/entities/types'
import EntityForm from './features/entities/components/EntityForm'

function App() {
  const { query, createMutation, updateMutation, deleteMutation } = useEntities()
  
  const [selected, setSelected] = useState<Entity | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingEntity, setEditingEntity] = useState<Entity | null>(null)
  const [apiError, setApiError] = useState('')

  const closeForm = () => {
    setIsFormOpen(false)
    setEditingEntity(null)
    setApiError('')
  }

  const handleFormSubmit = (data: EntityInput) => {
    setApiError('')
    if (editingEntity) {
      updateMutation.mutate({ id: editingEntity.id, data }, {
        onSuccess: closeForm,
        onError: (err: any) => setApiError(err.message)
      })
    } else {
      createMutation.mutate(data, {
        onSuccess: closeForm,
        onError: (err: any) => setApiError(err.message)
      })
    }
  }

  const handleDelete = (id: number) => {
    if (window.confirm('Yakin mau hapus entity ini?')) {
      deleteMutation.mutate(id, {
        onSuccess: () => setSelected(null)
      })
    }
  }

  if (query.isLoading) return <div style={{ padding: '20px' }}>Loading map...</div>
  if (query.error) return <div style={{ padding: '20px', color: 'red' }}>Error: {query.error.message}</div>

  return (
    <div className="app-container">
      <EntitySidebar 
        entities={query.data || []} 
        selectedId={selected?.id} 
        onSelect={setSelected} 
        onAddClick={() => setIsFormOpen(true)} 
      />

      <EntityMap 
        entities={query.data || []} 
        selectedEntity={selected} 
        onMarkerClick={setSelected} 
      />

      {selected && (
        <EntityDetailPanel 
          entity={selected} 
          onClose={() => setSelected(null)} 
          onEdit={(e) => { setEditingEntity(e); setIsFormOpen(true); }} 
          onDelete={handleDelete} 
        />
      )}

      {isFormOpen && (
        <EntityForm 
          initialData={editingEntity}
          onSubmit={handleFormSubmit}
          onCancel={closeForm}
          isLoading={createMutation.isPending || updateMutation.isPending}
          errorMsg={apiError}
        />
      )}
    </div>
  )
}

export default App