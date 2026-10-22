import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Entity, EntityInput } from '../types'


// SKEMA VALIDASI FRONTEND
const schema = z.object({
  name: z.string().min(3, 'Name minimal 3 karakter').max(100),
  type: z.enum(['vehicle', 'iot', 'facility']),
  status: z.enum(['active', 'inactive', 'maintenance']),
  latitude: z.number().min(-90).max(90, 'Maksimal 90'),
  longitude: z.number().min(-180).max(180, 'Maksimal 180'),
  description: z.string().max(500, 'Max 500 karakter'),
})

type FormData = z.infer<typeof schema>

interface Props {
  initialData?: Entity | null
  onSubmit: (data: EntityInput) => void
  onCancel: () => void
  isLoading: boolean
  errorMsg?: string
}

export default function EntityForm({ initialData, onSubmit, onCancel, isLoading, errorMsg }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData ? {
      name: initialData.name,
      type: initialData.type,
      status: initialData.status,
      latitude: initialData.latitude,
      longitude: initialData.longitude,
      description: initialData.description || '',
    } : {
      name: '',
      type: 'vehicle',
      status: 'active',
      latitude: 0,
      longitude: 0,
      description: '',
    }
  })

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{initialData ? 'Edit Entity' : 'Add New Entity'}</h2>
        
        {errorMsg && <div style={{ color: 'red', marginBottom: '10px' }}>{errorMsg}</div>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label>Name</label>
            <input {...register('name')} placeholder="Entity Name" />
            {errors.name && <span className="error">{errors.name.message}</span>}
          </div>

          <div className="form-group">
            <label>Type</label>
            <select {...register('type')}>
              <option value="vehicle">Vehicle</option>
              <option value="iot">IoT Device</option>
              <option value="facility">Facility</option>
            </select>
          </div>

          <div className="form-group">
            <label>Status</label>
            <select {...register('status')}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Latitude</label>
              <input type="number" step="any" {...register('latitude', { valueAsNumber: true })} />
              {errors.latitude && <span className="error">{errors.latitude.message}</span>}
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Longitude</label>
              <input type="number" step="any" {...register('longitude', { valueAsNumber: true })} />
              {errors.longitude && <span className="error">{errors.longitude.message}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea {...register('description')} rows={3} />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="btn-secondary" disabled={isLoading}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

