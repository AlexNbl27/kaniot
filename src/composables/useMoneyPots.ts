import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'
import { nanoid } from 'nanoid'
import type { MoneyPot, Participant, CreatePotData, JoinPotData, PotSummary } from '@/types'
import bcrypt from 'bcryptjs'

export const useMoneyPots = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const createPot = async (data: CreatePotData): Promise<MoneyPot> => {
    loading.value = true
    error.value = null

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Must be authenticated to create a pot')

      const potDataToInsert: any = {
        title: data.title,
        target_amount: data.target_amount,
        expiration_date: data.expiration_date,
        created_by: user.id,
        share_code: nanoid(8).toUpperCase(),
      };

      if (data.password) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        potDataToInsert.password = hashedPassword;
      }

      const { data: pot, error: createError } = await supabase
        .from('money_pots')
        .insert(potDataToInsert)
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

  const checkProtection = async (shareCode: string) => {
    const { data, error } = await supabase.rpc('is_pot_protected', { p_share_code: shareCode });
    if (error) throw error;
    return data;
  };

  const getPotByShareCode = async (shareCode: string, password?: string): Promise<PotSummary> => {
    loading.value = true
    error.value = null

    try {
      const { data: pot, error: potError } = await supabase
        .from('money_pots_with_creator_name')
        .select('*')
        .eq('share_code', shareCode)
        .single()

      if (potError) throw potError

      if (pot.password) {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        let isOwner = false;
        let isParticipant = false;
        if (currentUser) {
          isOwner = currentUser.id === pot.created_by;
          if (!isOwner) {
            const { data: participation } = await supabase
              .from('participants')
              .select('id')
              .eq('pot_id', pot.id)
              .eq('user_id', currentUser.id)
              .maybeSingle();
            isParticipant = !!participation;
          }
        }
        if (!isOwner && !isParticipant) {
          const isPasswordCorrect = await bcrypt.compare(password || '', pot.password);
          if (!isPasswordCorrect) {
            throw new Error("Mot de passe incorrect.");
          }
        }
      }
      delete pot.password;

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
      const { data: { user } } = await supabase.auth.getUser()
      const { data: participant, error: joinError } = await supabase
        .from('participants')
        .insert({
          pot_id: potId,
          name: data.name,
          max_pledge: data.max_pledge,
          user_id: user ? user.id : null,
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
      console.info('Deleting participant with ID:', participantId)
      const { error } = await supabase
        .from('participants')
        .delete()
        .eq('id', participantId)

      if (error) throw error
    } catch (err) {
      console.error('Error deleting participant:', err)
      throw err
    }
  }

  const deleteMoneyPot = async (potId: string) => {
    const { error: dbError } = await supabase
      .from('money_pots')
      .delete()
      .eq('id', potId)

    if (dbError) {
      console.error('Error deleting pot:', dbError)
      throw new Error('La suppression de la cagnotte a échoué.')
    }
  }

  const calculateDistribution = (participants: Participant[], targetAmount: number): Participant[] => {
    // Base case: no participants or no target
    if (participants.length === 0 || targetAmount <= 0) {
      return participants.map(p => ({ ...p, calculated_contribution: 0 }));
    }

    // If total pledges don't reach target, everyone gives their max
    const totalMaxPledge = participants.reduce((sum, p) => sum + p.max_pledge, 0);
    if (totalMaxPledge <= targetAmount) {
      return participants.map(p => ({ ...p, calculated_contribution: p.max_pledge }));
    }

    // Iterative fair share algorithm
    const sorted = [...participants].sort((a, b) => a.max_pledge - b.max_pledge);
    const contributions: { [id: string]: number } = {};
    let remaining = targetAmount;

    for (let i = 0; i < sorted.length; i++) {
      const left = sorted.length - i;
      const p = sorted[i];
      const share = remaining / left;

      if (p.max_pledge <= share) {
        contributions[p.id] = p.max_pledge;
        remaining -= p.max_pledge;
      } else {
        const finalShare = remaining / left;
        for (let j = i; j < sorted.length; j++) {
          contributions[sorted[j].id] = finalShare;
        }
        break;
      }
    }

    // Attach calculated contributions, rounded to cents
    return participants.map(p => ({
      ...p,
      calculated_contribution: Math.round((contributions[p.id] || 0) * 100) / 100
    }));
  };

  return {
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    createPot,
    getPotByShareCode,
    joinPot,
    getUserPots,
    deleteParticipant,
    deleteMoneyPot,
    calculateDistribution,
    checkProtection,
  }
}