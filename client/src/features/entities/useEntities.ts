import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createEntity, deleteEntity, fetchEntities, updateEntity } from '../../api/entityApi'
import type { EntityInput } from './types'



export function useEntities() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['entities'],
    queryFn: fetchEntities,
  })

  const createMutation = useMutation({
    mutationFn: createEntity,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['entities'] }),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: EntityInput }) => updateEntity(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['entities'] }),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteEntity,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['entities'] }),
  })

  return { query, createMutation, updateMutation, deleteMutation }
}