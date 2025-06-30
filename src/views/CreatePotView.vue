<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4">
      <div class="max-w-2xl mx-auto">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Create Money Pot</h1>
          <p class="text-gray-600 mt-2">Set up a new collective funding pot with your target amount and sharing preferences.</p>
        </div>

        <BaseCard>
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <BaseInput
              id="title"
              v-model="form.title"
              label="Pot Title"
              placeholder="e.g., Birthday Gift for Sarah"
              required
              :error="errors.title"
            />

            <BaseInput
              id="target_amount"
              v-model="form.target_amount"
              type="number"
              label="Target Amount (€)"
              placeholder="100"
              :min="1"
              :step="0.01"
              required
              :error="errors.target_amount"
              hint="The total amount you want to collect"
            />

            <BaseInput
              id="expiration_date"
              v-model="form.expiration_date"
              type="datetime-local"
              label="Expiration Date (Optional)"
              :error="errors.expiration_date"
              hint="When should this pot stop accepting contributions?"
            />

            <div class="flex gap-4">
              <BaseButton
                type="submit"
                :loading="loading"
                class="flex-1"
              >
                Create Money Pot
              </BaseButton>
              <BaseButton
                variant="outline"
                @click="$router.push('/')"
              >
                Cancel
              </BaseButton>
            </div>
          </form>
        </BaseCard>

        <BaseCard v-if="createdPot" class="mt-6">
          <template #header>
            <h3 class="text-lg font-semibold text-green-800">Money Pot Created! 🎉</h3>
          </template>
          
          <div class="space-y-4">
            <p class="text-gray-600">Your money pot has been created successfully. Share this link with participants:</p>
            
            <div class="bg-gray-50 p-4 rounded-lg">
              <p class="text-sm text-gray-600 mb-2">Shareable Link:</p>
              <div class="flex items-center gap-2">
                <input
                  :value="shareUrl"
                  readonly
                  class="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm"
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

            <div class="flex gap-2">
              <BaseButton
                variant="primary"
                @click="$router.push(`/pot/${createdPot.share_code}`)"
              >
                View Money Pot
              </BaseButton>
              <BaseButton
                variant="outline"
                @click="$router.push('/dashboard')"
              >
                Go to Dashboard
              </BaseButton>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMoneyPots } from '@/composables/useMoneyPots'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import type { MoneyPot } from '@/types'

const router = useRouter()
const { createPot, loading, error } = useMoneyPots()

const form = reactive({
  title: '',
  target_amount: '',
  expiration_date: '',
})

const errors = reactive({
  title: '',
  target_amount: '',
  expiration_date: '',
})

const createdPot = ref<MoneyPot | null>(null)
const copied = ref(false)

const shareUrl = computed(() => {
  if (!createdPot.value) return ''
  return `${window.location.origin}/pot/${createdPot.value.share_code}`
})

const validateForm = () => {
  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })

  let isValid = true

  if (!form.title.trim()) {
    errors.title = 'Title is required'
    isValid = false
  }

  if (!form.target_amount || Number(form.target_amount) <= 0) {
    errors.target_amount = 'Target amount must be greater than 0'
    isValid = false
  }

  if (form.expiration_date && new Date(form.expiration_date) <= new Date()) {
    errors.expiration_date = 'Expiration date must be in the future'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return

  try {
    const pot = await createPot({
      title: form.title.trim(),
      target_amount: Number(form.target_amount),
      expiration_date: form.expiration_date || undefined,
    })
    
    createdPot.value = pot
  } catch (err) {
    console.error('Failed to create pot:', err)
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
</script>