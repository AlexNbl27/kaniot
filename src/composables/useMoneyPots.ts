import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'
import { nanoid } from 'nanoid'
import type { MoneyPot, Participant, CreatePotData, JoinPotData, PotSummary } from '@/types'

export const useMoneyPots = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const createPot = async (data: CreatePotData): Promise<MoneyPot> => {
    loading.value = true
    error.value = null

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Must be authenticated to create a pot')

      const shareCode = nanoid(8)

      const { data: pot, error: createError } = await supabase
        .from('money_pots')
        .insert({
          title: data.title,
          target_amount: data.target_amount,
          expiration_date: data.expiration_date,
          created_by: user.id,
          share_code: shareCode,
        })
        .select()
        .single()

      if (createError) throw createError
      return pot
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create pot'
      throw err
    } finally {
      loading.value = false
    }
  }

  const getPotByShareCode = async (shareCode: string): Promise<PotSummary> => {
    loading.value = true
    error.value = null

    try {
      const { data: pot, error: potError } = await supabase
        .from('money_pots_with_creator_name')
        .select('*')
        .eq('share_code', shareCode)
        .single()

      if (potError) throw potError

      const { data: participants, error: participantsError } = await supabase
        .from('participants')
        .select('*')
        .eq('pot_id', pot.id)
        .order('joined_at', { ascending: true })

      if (participantsError) throw participantsError

      const totalPledged = participants.reduce((sum, p) => sum + p.max_pledge, 0)
      const isExpired = pot.expiration_date ? new Date(pot.expiration_date) < new Date() : false

      return {
        pot,
        participants,
        total_pledged: totalPledged,
        participant_count: participants.length,
        is_expired: isExpired,
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch pot'
      throw err
    } finally {
      loading.value = false
    }
  }

  const joinPot = async (potId: string, data: JoinPotData): Promise<Participant> => {
    loading.value = true
    error.value = null

    try {
      const { data: participant, error: joinError } = await supabase
        .from('participants')
        .insert({
          pot_id: potId,
          name: data.name,
          max_pledge: data.max_pledge,
          calculated_contribution: 0, // Will be updated by trigger
        })
        .select()
        .single()

      if (joinError) throw joinError
      return participant
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to join pot'
      throw err
    } finally {
      loading.value = false
    }
  }

  const getUserPots = async (): Promise<MoneyPot[]> => {
    loading.value = true
    error.value = null

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Must be authenticated')

      const { data: pots, error: potsError } = await supabase
        .from('money_pots')
        .select('*')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false })

      if (potsError) throw potsError
      return pots
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch pots'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteParticipant = async (participantId: string) => {
    try {
      const { error } = await supabase
        .from('participants')
        .delete()
        .eq('id', participantId)

      if (error) throw error
    } catch (err) {
      // On propage l'erreur pour la gérer dans le composant
      throw err
    }
  }

  const calculateDistribution = (participants: Participant[], targetAmount: number): Participant[] => {
    if (participants.length === 0) return []

    const totalMaxPledge = participants.reduce((sum, p) => sum + p.max_pledge, 0)

    if (totalMaxPledge <= targetAmount) {
      // Everyone can pledge their maximum
      return participants.map(p => ({
        ...p,
        calculated_contribution: p.max_pledge
      }))
    } else {
      // Need to scale down proportionally
      return participants.map(p => ({
        ...p,
        calculated_contribution: Math.round((p.max_pledge / totalMaxPledge) * targetAmount)
      }))
    }
  }

  return {
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    createPot,
    getPotByShareCode,
    joinPot,
    getUserPots,
    deleteParticipant,
    calculateDistribution,
  }
}