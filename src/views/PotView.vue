<template>
  <div class="min-h-screen py-8">
    <div class="container mx-auto px-4">
      <div v-if="loading" class="flex justify-center items-center min-h-64">
        <div class="animate-spin text-4xl">⟳</div>
      </div>

      <div v-else-if="error" class="max-w-md mx-auto">
        <BaseCard>
          <div class="text-center py-8">
            <div class="text-4xl mb-4">❌</div>
            <h2 class="text-xl font-semibold text-red-600 mb-2">Error</h2>
            <p class="text-gray-600 dark:text-gray-400">{{ error }}</p>
            <BaseButton variant="outline" class="mt-4" @click="$router.push('/')">
              Go Home
            </BaseButton>
          </div>
        </BaseCard>
      </div>

      <div v-else-if="passwordPromptVisible" class="max-w-md mx-auto">
        <BaseCard>
          <template #header>
            <h3 class="text-lg font-semibold">Cagnotte protégée</h3>
          </template>
          <form @submit.prevent="handlePasswordSubmit" class="space-y-4">
            <p class="text-gray-600 dark:text-gray-400 text-sm">
              Cette cagnotte est protégée par un mot de passe. Veuillez le saisir pour continuer.
            </p>
            <BaseInput id="password" v-model="enteredPassword" type="password" label="Mot de passe" required
              :error="passwordError" />
            <BaseButton type="submit" :loading="loading" class="w-full">
              Accéder
            </BaseButton>
          </form>
        </BaseCard>
      </div>

      <div v-else-if="potSummary" class="max-w-4xl mx-auto space-y-6">
        <BaseCard>
          <div class="text-center">
            <h1 class="text-3xl font-bold mb-2">{{ potSummary.pot.title }}</h1>
            <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Kaniot créée par {{ potSummary.pot.creator_name }}
            </div>
            <div
              class="flex flex-col sm:flex-row items-center justify-center sm:gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span>Objectif: {{ potSummary.pot.target_amount.toFixed(2).replace('.', ',') }}€</span>
              <span class="hidden sm:inline">•</span>
              <span>{{ potSummary.participant_count }} participant{{ potSummary.participant_count !== 1 ? 's' : ''
                }}</span>
              <span v-if="potSummary.pot.expiration_date" class="hidden sm:inline">•</span>
              <span v-if="potSummary.pot.expiration_date"
                :class="potSummary.is_expired ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'">
                {{ potSummary.is_expired ? `Expirée depuis le ${formatDate(potSummary.pot.expiration_date)}` : `Active
                jusqu'au ${formatDate(potSummary.pot.expiration_date)}`
                }}
              </span>
            </div>
          </div>
        </BaseCard>

        <BaseCard v-if="isOwner && !potSummary.is_expired">
          <template #header>
            <h3 class="text-lg font-semibold">⚙️ Administration</h3>
          </template>

          <form @submit.prevent="handleUpdatePot" class="space-y-6">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Modifiez les informations de votre cagnotte ici.
            </p>
            <div class="grid sm:grid-cols-2 gap-4">
              <BaseInput id="admin-title" v-model="adminForm.title" label="Nom de la Kaniot" required />
              <BaseInput id="admin-target" v-model="adminForm.target_amount" type="number" label="Montant cible (€)"
                :min="1" required />
            </div>

            <div class="flex items-center justify-between py-2 border-t border-b border-gray-200 dark:border-gray-700">
              <span class="flex flex-grow flex-col pr-4">
                <label id="participants-visibility-label" class="font-medium text-sm text-gray-700 dark:text-gray-200">
                  Ne pas afficher la liste des contributions
                </label>
                <span class="text-sm text-gray-500 dark:text-gray-400">
                  Si activé, les participants ne verront pas la valeur des montants promis et des contributions dûes par
                  les
                  autres participants de la Kaniot.
                </span>
              </span>
              <button type="button" @click="adminForm.hide_participants = !adminForm.hide_participants"
                class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                role="switch" :aria-checked="adminForm.hide_participants"
                aria-labelledby="participants-visibility-label"
                :class="adminForm.hide_participants ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'">
                <span aria-hidden="true"
                  class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                  :class="adminForm.hide_participants ? 'translate-x-5' : 'translate-x-0'"></span>
              </button>
            </div>

            <div class="flex flex-col sm:flex-row gap-4">
              <BaseButton type="submit" :loading="adminLoading">
                Enregistrer les modifications
              </BaseButton>
              <BaseButton variant="outline" type="button" @click="handleEndPot" :loading="adminLoading"
                class="border-red-500 text-red-500 dark:text-red-400 dark:border-red-400 hover:bg-red-50">
                Mettre un terme à la cagnotte
              </BaseButton>
            </div>
          </form>
        </BaseCard>

        <BaseCard>
          <template #header>
            <h3 class="text-lg font-semibold">💰 Avancement</h3>
          </template>

          <div class="space-y-2">
            <div class="text-left">
              <span class="text-lg font-bold text-primary-600">
                {{ totalContributions.toFixed(2).replace('.', ',') }}€ / {{
                  potSummary.pot.target_amount.toFixed(2).replace('.', ',') }}€
              </span>
            </div>

            <div class="w-full bg-gray-200 rounded-full h-3">
              <div class="bg-primary-600 h-3 rounded-full transition-all duration-500"
                :style="{ width: `${Math.min(progressPercentage, 100)}%` }"></div>
            </div>

            <div class="text-center text-sm text-gray-600 dark:text-gray-400">
              {{ progressPercentage.toFixed(1) }}% de l'objectif atteint
              <span v-if="progressPercentage >= 100" class="text-green-600 font-semibold"> - Objectif atteint !
                🎉</span>
            </div>
          </div>
        </BaseCard>
        <BaseCard v-if="!potSummary.is_expired">
          <template #header>
            <h3 class="text-lg font-semibold">🪙 Participer à cette Kaniot</h3>
          </template>

          <form @submit.prevent="handleJoin" class="space-y-4">
            <div class="grid sm:grid-cols-2 gap-4">
              <BaseInput id="name" v-model="joinForm.name" label="Prénom" placeholder="Michel"
                hint="Comment souhaitez-vous être appelé ?" required :error="joinErrors.name" />
              <BaseInput id="max_pledge" v-model="joinForm.max_pledge" type="number" label="Contribution maximum (€)"
                placeholder="50" :min="0.01" :step="0.01" required :error="joinErrors.max_pledge"
                hint="Quel montant maximum êtes-vous prêt à contribuer ?" />
            </div>

            <BaseButton type="submit" :loading="joinLoading" class="w-full sm:w-auto">
              Soumettre ma participation
            </BaseButton>
          </form>
        </BaseCard>

        <BaseCard v-if="distributedParticipants.length > 0">
          <template #header>
            <h3 class="text-lg font-semibold">⚖️ Participants & Répartition</h3>
          </template>

          <div class="space-y-3">
            <div v-for="participant in distributedParticipants" :key="participant.id"
              class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">

              <div class="flex items-center gap-3">
                <button v-if="canDeleteParticipant(participant)" @click="handleDeleteParticipant(participant.id)"
                  title="Remove participant" class="text-gray-400 hover:text-red-600 transition-colors flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z"
                      clip-rule="evenodd" />
                  </svg>
                </button>
                <div>
                  <p class="font-medium">{{ participant.name }}</p>

                  <p v-if="!potSummary.pot.hide_participants || shouldDisplayContribution(participant)"
                    class="text-sm text-gray-600 dark:text-gray-400">
                    Max pledge: {{ participant.max_pledge.toFixed(2).replace('.', ',') }}€
                  </p>
                </div>
              </div>

              <div class="text-right">
                <template v-if="!potSummary.pot.hide_participants || shouldDisplayContribution(participant)">
                  <p class="font-semibold text-primary-600">{{
                    participant.calculated_contribution.toFixed(2).replace('.', ',') }}€</p>
                  <p class="text-xs text-gray-500">contribution</p>
                </template>
                <template v-else>
                  <p class="text-sm italic text-gray-500">Cachée</p>
                </template>
              </div>

            </div>
          </div>
        </BaseCard>

        <BaseCard>
          <template #header>
            <h3 class="text-lg font-semibold">🔗 Partager cette Kaniot</h3>
          </template>

          <div class="space-y-4">
            <p class="text-gray-600 dark:text-gray-400">
              Partagez ce lien avec vos amis et famille pour les inviter à participer à cette Kaniot :
            </p>
            <div class="flex items-center gap-2">
              <input :value="shareUrl" readonly
                class="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 rounded-md text-sm" />
              <BaseButton variant="outline" size="sm" @click="copyToClipboard">
                {{ copied ? 'Copié!' : 'Copier' }}
              </BaseButton>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { triggerConfetti } from '@/lib/confetti'
import { useRoute } from 'vue-router'
import { useMoneyPots } from '@/composables/useMoneyPots'
import { supabase } from '@/lib/supabase'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import { useAuth } from '@/composables/useAuth'
import type { PotSummary, Participant } from '@/types'
import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js'

const route = useRoute()
const { getPotByShareCode, joinPot, deleteParticipant, calculateDistribution, checkProtection, updatePot } = useMoneyPots()
const { user } = useAuth()

const loading = ref(true)
const error = ref<string | null>(null)

const shareCode = computed(() => route.params.shareCode as string)
const potSummary = ref<PotSummary | null>(null)
const passwordPromptVisible = ref(false)
const enteredPassword = ref('')
const passwordError = ref('')
const joinLoading = ref(false)
const copied = ref(false)
const potChannel = ref<RealtimeChannel | null>(null)

const animatedTotalContributions = ref(0)

const joinForm = reactive({
  name: '',
  max_pledge: '',
})

const joinErrors = reactive({
  name: '',
  max_pledge: '',
})

const adminLoading = ref(false)
const adminForm = reactive({
  title: '',
  target_amount: 0,
  hide_participants: false,
})

watch(potSummary, (summary) => {
  if (summary) {
    adminForm.title = summary.pot.title
    adminForm.target_amount = summary.pot.target_amount
    adminForm.hide_participants = summary.pot.hide_participants
  }
}, { immediate: true })

const handleUpdatePot = async () => {
  if (!potSummary.value) return;
  adminLoading.value = true;
  try {
    const updatedPot = await updatePot(potSummary.value.pot.id, {
      title: adminForm.title,
      target_amount: Number(adminForm.target_amount),
      hide_participants: adminForm.hide_participants, // <-- AJOUTÉ ICI
    });

    potSummary.value.pot = { ...potSummary.value.pot, ...updatedPot };
    alert('Cagnotte mise à jour avec succès !');
  } catch (err) {
    console.error('Failed to update pot:', err);
    alert('Une erreur est survenue lors de la mise à jour.');
  } finally {
    adminLoading.value = false;
  }
}

const handleEndPot = async () => {
  if (!potSummary.value) return;
  if (!confirm(`Êtes-vous sûr de vouloir mettre un terme à la cagnotte "${potSummary.value.pot.title}" ? Cette action est irréversible.`)) {
    return;
  }

  adminLoading.value = true;
  try {
    const expirationDate = new Date().toISOString();
    const updatedPot = await updatePot(potSummary.value.pot.id, {
      expiration_date: expirationDate,
    });
    potSummary.value.pot = updatedPot;
    potSummary.value.is_expired = true;
    alert('La cagnotte a été terminée.');
  } catch (err) {
    console.error('Failed to end pot:', err);
    alert('Une erreur est survenue.');
  } finally {
    adminLoading.value = false;
  }
}

const shareUrl = computed(() => window.location.href)

watch(user, (currentUser) => {
  if (currentUser && !joinForm.name && currentUser.user_metadata?.display_name) {
    joinForm.name = currentUser.user_metadata.display_name
  }
}, { immediate: true })

const distributedParticipants = computed(() => {
  if (!potSummary.value) return []
  return calculateDistribution(potSummary.value.participants, potSummary.value.pot.target_amount)
})

const totalContributions = computed(() => {
  if (!potSummary.value) return 0
  const sum = distributedParticipants.value.reduce((sum, p) => sum + p.calculated_contribution, 0)
  return Math.min(sum, potSummary.value.pot.target_amount)
})

watch(totalContributions, (newValue, oldValue) => {
  if (!potSummary.value) return;
  const targetAmount = potSummary.value.pot.target_amount;
  if (oldValue < targetAmount && newValue >= targetAmount) {
    triggerConfetti();
  }
});

watch(totalContributions, (newValue, oldValue) => {
  const duration = 500
  const startValue = oldValue || 0
  let startTime: number | null = null

  const animate = (currentTime: number) => {
    if (!startTime) startTime = currentTime
    const elapsedTime = currentTime - startTime
    const progress = Math.min(elapsedTime / duration, 1)

    animatedTotalContributions.value = startValue + (newValue - startValue) * progress

    if (progress < 1) {
      requestAnimationFrame(animate)
    } else {
      animatedTotalContributions.value = newValue
    }
  }
  requestAnimationFrame(animate)
})

const progressPercentage = computed(() => {
  if (!potSummary.value || potSummary.value.pot.target_amount === 0) return 0
  return (totalContributions.value / potSummary.value.pot.target_amount) * 100
})

const isOwner = computed(() => {
  if (!user.value || !potSummary.value) return false
  return user.value.id === potSummary.value.pot.created_by
})

const handleRealtimeUpdate = (payload: RealtimePostgresChangesPayload<Participant>) => {
  if (!potSummary.value) return
  console.info('Realtime update received:', payload)
  switch (payload.eventType) {
    case 'INSERT':
      potSummary.value.participants.push(payload.new as Participant)
      break;
    case 'UPDATE':
      const indexToUpdate = potSummary.value.participants.findIndex(p => p.id === payload.new.id)
      if (indexToUpdate !== -1) {
        potSummary.value.participants[indexToUpdate] = payload.new as Participant
      }
      break;
    case 'DELETE':
      potSummary.value.participants = potSummary.value.participants.filter(p => p.id !== (payload.old as Participant).id)
      break;
  }
  potSummary.value.participant_count = potSummary.value.participants.length
}

const loadPot = async (password?: string) => {
  loading.value = true
  passwordError.value = ''
  try {
    const summary = await getPotByShareCode(shareCode.value, password)
    potSummary.value = summary
    passwordPromptVisible.value = false
    animatedTotalContributions.value = totalContributions.value
    await nextTick();
    if (potSummary.value && totalContributions.value >= potSummary.value.pot.target_amount) {
      triggerConfetti();
    }

    if (summary?.pot && !potChannel.value) {
      potChannel.value = supabase
        .channel(`pot-updates-${summary.pot.id}`)
        .on<Participant>(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'participants',
            filter: `pot_id=eq.${summary.pot.id}`,
          },
          handleRealtimeUpdate
        )
        .subscribe()
    }
  } catch (err: any) {
    error.value = err.message
    if (err.message.includes('incorrect')) {
      passwordError.value = err.message
    }
  } finally {
    loading.value = false
  }
}

const validateJoinForm = () => {
  Object.keys(joinErrors).forEach(key => { joinErrors[key as keyof typeof joinErrors] = '' })
  let isValid = true
  if (!joinForm.name.trim()) {
    joinErrors.name = 'Name is required'
    isValid = false
  }
  if (!joinForm.max_pledge || Number(joinForm.max_pledge) <= 0) {
    joinErrors.max_pledge = 'Pledge amount must be greater than 0'
    isValid = false
  }
  return isValid
}

const handleJoin = async () => {
  if (!validateJoinForm() || !potSummary.value) return;

  joinLoading.value = true;
  try {
    const newParticipant = await joinPot(potSummary.value.pot.id, {
      name: joinForm.name.trim(),
      max_pledge: Number(joinForm.max_pledge),
    });

    if (!user.value && newParticipant) {
      rememberAnonymousParticipation(potSummary.value.pot.id, newParticipant.id);
    }

    joinForm.max_pledge = '';
  } catch (err) {
    console.error('Failed to join pot:', err);
  } finally {
    joinLoading.value = false;
  }
};

const canDeleteParticipant = (participant: Participant) => {
  if (isOwner.value) {
    return true;
  }
  if (user.value && user.value.id === participant.user_id) {
    return true;
  }
  return false;
};

const shouldDisplayContribution = (participant: Participant) => {
  if (isOwner.value) {
    return true;
  }
  if (user.value && user.value.id === participant.user_id) {
    return true;
  }
  if (!user.value && potSummary.value) {
    const anonymousParticipantId = getAnonymousParticipationId(potSummary.value.pot.id);
    if (anonymousParticipantId && participant.id === anonymousParticipantId) {
      return true;
    }
  }
  return false;
};

function getAnonymousParticipationId(potId: string): string | null {
  try {
    const myParticipations = JSON.parse(localStorage.getItem(ANONYMOUS_PARTICIPATIONS_KEY) || '{}');
    return myParticipations[potId] || null;
  } catch (e) {
    console.error("Could not read anonymous participation from localStorage", e);
    return null;
  }
}

const handleDeleteParticipant = async (participantId: string) => {
  if (!confirm('Are you sure you want to remove this participant?')) return
  try {
    await deleteParticipant(participantId)
  } catch (err) {
    console.error('Failed to delete participant:', err)
  }
}

const ANONYMOUS_PARTICIPATIONS_KEY = 'kaniot_anon_participations';

function rememberAnonymousParticipation(potId: string, participantId: string) {
  try {
    const myParticipations = JSON.parse(localStorage.getItem(ANONYMOUS_PARTICIPATIONS_KEY) || '{}');
    myParticipations[potId] = participantId;
    localStorage.setItem(ANONYMOUS_PARTICIPATIONS_KEY, JSON.stringify(myParticipations));
  } catch (e) {
    console.error("Could not save anonymous participation to localStorage", e);
  }
}

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(shareUrl.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch (err) {
    console.error('Failed to copy to clipboard:', err)
  }
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

const handlePasswordSubmit = () => {
  if (!enteredPassword.value) {
    passwordError.value = "Le mot de passe ne peut pas être vide.";
    return;
  }
  sessionStorage.setItem(`pot_password_${shareCode.value}`, enteredPassword.value);
  loadPot(enteredPassword.value);
}

onMounted(async () => {
  if (!shareCode.value) {
    loading.value = false;
    error.value = "Aucun code de cagnotte n'a été fourni.";
    return;
  }

  const rememberedPassword = sessionStorage.getItem(`pot_password_${shareCode.value}`);
  if (rememberedPassword) {
    await loadPot(rememberedPassword);
    return;
  }

  try {
    const promptIsNeeded = await checkProtection(shareCode.value);
    if (promptIsNeeded) {
      passwordPromptVisible.value = true;
      loading.value = false;
    } else {
      await loadPot();
    }
  } catch (err) {
    error.value = "Impossible de vérifier les informations de la cagnotte.";
    loading.value = false;
  }
});

onUnmounted(() => {
  if (potChannel.value) {
    potChannel.value.unsubscribe()

    potChannel.value = null
  }
})

watch(shareCode, (newShareCode) => {
  if (newShareCode) {
    if (potChannel.value) {
      potChannel.value.unsubscribe()
      potChannel.value = null
    }
    loadPot()
  }
})
</script>