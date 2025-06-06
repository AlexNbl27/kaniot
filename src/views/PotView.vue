<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4">
      <div v-if="loading" class="flex justify-center items-center min-h-64">
        <div class="animate-spin text-4xl">⟳</div>
      </div>

      <div v-else-if="error" class="max-w-md mx-auto">
        <BaseCard>
          <div class="text-center py-8">
            <div class="text-4xl mb-4">❌</div>
            <h2 class="text-xl font-semibold text-red-600 mb-2">Error</h2>
            <p class="text-gray-600">{{ error }}</p>
            <BaseButton variant="outline" class="mt-4" @click="$router.push('/')">
              Go Home
            </BaseButton>
          </div>
        </BaseCard>
      </div>

      <div v-else-if="potSummary" class="max-w-4xl mx-auto space-y-6">
        <!-- Header -->
        <BaseCard>
          <div class="text-center">
            <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ potSummary.pot.title }}</h1>
            <div class="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-gray-600">
              <span>Target: €{{ potSummary.pot.target_amount.toFixed(2) }}</span>
              <span>•</span>
              <span>{{ potSummary.participant_count }} participant{{ potSummary.participant_count !== 1 ? 's' : '' }}</span>
              <span v-if="potSummary.pot.expiration_date">•</span>
              <span v-if="potSummary.pot.expiration_date" :class="potSummary.is_expired ? 'text-red-600' : 'text-green-600'">
                {{ potSummary.is_expired ? 'Expired' : 'Active' }} until {{ formatDate(potSummary.pot.expiration_date) }}
              </span>
            </div>
          </div>
        </BaseCard>

        <!-- Progress -->
        <BaseCard>
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-semibold">Progress</h3>
              <span class="text-lg font-bold text-primary-600">
                €{{ totalContributions.toFixed(2) }} / €{{ potSummary.pot.target_amount.toFixed(2) }}
              </span>
            </div>
            
            <div class="w-full bg-gray-200 rounded-full h-3">
              <div 
                class="bg-primary-600 h-3 rounded-full transition-all duration-500"
                :style="{ width: `${Math.min(progressPercentage, 100)}%` }"
              ></div>
            </div>
            
            <div class="text-center text-sm text-gray-600">
              {{ progressPercentage.toFixed(1) }}% of target reached
              <span v-if="progressPercentage >= 100" class="text-green-600 font-semibold"> - Target achieved! 🎉</span>
            </div>
          </div>
        </BaseCard>

        <!-- Join Form (if not expired) -->
        <BaseCard v-if="!potSummary.is_expired">
          <template #header>
            <h3 class="text-lg font-semibold">Join this Money Pot</h3>
          </template>
          
          <form @submit.prevent="handleJoin" class="space-y-4">
            <div class="grid sm:grid-cols-2 gap-4">
              <BaseInput
                id="name"
                v-model="joinForm.name"
                label="Your Name"
                placeholder="Enter your name"
                required
                :error="joinErrors.name"
              />
              
              <BaseInput
                id="max_pledge"
                v-model="joinForm.max_pledge"
                type="number"
                label="Maximum Pledge (€)"
                placeholder="50"
                min="0.01"
                step="0.01"
                required
                :error="joinErrors.max_pledge"
                hint="What's the most you can contribute?"
              />
            </div>
            
            <BaseButton 
              type="submit" 
              :loading="joinLoading"
              class="w-full sm:w-auto"
            >
              Join Money Pot
            </BaseButton>
          </form>
        </BaseCard>

        <!-- Participants -->
        <BaseCard v-if="distributedParticipants.length > 0">
          <template #header>
            <h3 class="text-lg font-semibold">Participants & Distribution</h3>
          </template>
          
          <div class="space-y-3">
            <div v-for="participant in distributedParticipants" :key="participant.id" 
                 class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p class="font-medium">{{ participant.name }}</p>
                <p class="text-sm text-gray-600">Max pledge: €{{ participant.max_pledge.toFixed(2) }}</p>
              </div>
              <div class="text-right">
                <p class="font-semibold text-primary-600">€{{ participant.calculated_contribution.toFixed(2) }}</p>
                <p class="text-xs text-gray-500">contribution</p>
              </div>
            </div>
          </div>
        </BaseCard>

        <!-- Share -->
        <BaseCard>
          <template #header>
            <h3 class="text-lg font-semibold">Share this Money Pot</h3>
          </template>
          
          <div class="space-y-4">
            <p class="text-gray-600">Share this link to let others join:</p>
            <div class="flex items-center gap-2">
              <input
                :value="shareUrl"
                readonly
                class="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm"
              />
              <BaseButton 
                variant="outline" 
                size="sm"
                @click="copyToClipboard"
              >
                {{ copied ? 'Copied!' : 'Copy' }}
              </BaseButton>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useMoneyPots } from '@/composables/useMoneyPots'
import { supabase } from '@/lib/supabase'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import type { PotSummary, Participant } from '@/types'

const route = useRoute()
const { getPotByShareCode, joinPot, calculateDistribution, loading, error } = useMoneyPots()

const shareCode = computed(() => route.params.shareCode as string)
const potSummary = ref<PotSummary | null>(null)
const joinLoading = ref(false)
const copied = ref(false)

const joinForm = reactive({
  name: '',
  max_pledge: '',
})

const joinErrors = reactive({
  name: '',
  max_pledge: '',
})

const shareUrl = computed(() => window.location.href)

const distributedParticipants = computed(() => {
  if (!potSummary.value) return []
  return calculateDistribution(potSummary.value.participants, potSummary.value.pot.target_amount)
})

const totalContributions = computed(() => {
  return distributedParticipants.value.reduce((sum, p) => sum + p.calculated_contribution, 0)
})

const progressPercentage = computed(() => {
  if (!potSummary.value) return 0
  return (totalContributions.value / potSummary.value.pot.target_amount) * 100
})

const loadPot = async () => {
  try {
    const summary = await getPotByShareCode(shareCode.value)
    potSummary.value = summary
  } catch (err) {
    console.error('Failed to load pot:', err)
  }
}

const validateJoinForm = () => {
  // Reset errors
  Object.keys(joinErrors).forEach(key => {
    joinErrors[key as keyof typeof joinErrors] = ''
  })

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
  if (!validateJoinForm() || !potSummary.value) return

  joinLoading.value = true
  try {
    await joinPot(potSummary.value.pot.id, {
      name: joinForm.name.trim(),
      max_pledge: Number(joinForm.max_pledge),
    })
    
    // Reset form
    joinForm.name = ''
    joinForm.max_pledge = ''
    
    // Reload pot data
    await loadPot()
  } catch (err) {
    console.error('Failed to join pot:', err)
  } finally {
    joinLoading.value = false
  }
}

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(shareUrl.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy to clipboard:', err)
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

onMounted(() => {
  loadPot()
  
  // Subscribe to real-time updates
  const channel = supabase
    .channel('pot-updates')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'participants',
        filter: `pot_id=eq.${potSummary.value?.pot.id}`,
      },
      () => {
        loadPot()
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
})

watch(shareCode, () => {
  if (shareCode.value) {
    loadPot()
  }
})
</script>