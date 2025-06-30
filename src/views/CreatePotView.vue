<template>
  <div class="min-h-screen py-8">
    <div class="container mx-auto px-4">
      <div class="max-w-2xl mx-auto">
        <div class="mb-8">
          <h1 class="text-3xl font-bold">Créer votre Kaniot</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-2">Créez <strong>gratuitement</strong> une nouvelle Kaniot collective avec le
            montant souhaité et vos préférences de partage.</p>
        </div>

        <BaseCard>
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <BaseInput id="title" v-model="form.title" label="Nom de la Kaniot"
              placeholder="ex : Cadeau pour le mariage de Jean" required :error="errors.title" />

            <BaseInput id="target_amount" v-model="form.target_amount" type="number" label="Montant cible (€)"
              placeholder="100" :min="1" :step="0.01" required :error="errors.target_amount"
              hint="Le montant total que vous souhaitez collecter" />

            <BaseInput id="expiration_date" v-model="form.expiration_date" type="datetime-local"
              label="Date d'expiration (Optionnel)" :error="errors.expiration_date"
              hint="Quand cette cagnotte doit-elle arrêter d'accepter des contributions ?" />

            <BaseInput id="password" v-model="form.password" type="password" label="Mot de passe (Optionnel)"
              :error="errors.password" placeholder="Entrez un mot de passe" :minlength="6"
              hint="Si défini, un mot de passe sera requis pour voir et participer à la cagnotte." />

            <div class="flex gap-4">
              <BaseButton type="submit" :loading="loading" class="flex-1">
                Créer la Kaniot
              </BaseButton>
              <BaseButton variant="outline" @click="$router.push('/')">
                Annuler
              </BaseButton>
            </div>
          </form>
        </BaseCard>

        <BaseCard v-if="createdPot" class="mt-6">
          <template #header>
            <h3 class="text-lg font-semibold text-green-800 dark:text-green-400">Kaniot créée avec succès! 🎉</h3>
          </template>

          <div class="space-y-4">
            <p class="text-gray-600 dark:text-gray-400">Votre cagnotte a été créée avec succès. Partagez ce lien avec les
              participants&nbsp;:
            </p>

            <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Lien partageable:</p>
              <div class="flex items-center gap-2">
                <input :value="shareUrl" readonly
                  class="flex-1 max-w-[50vw] px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 rounded-md text-sm" />
                <BaseButton variant="outline" size="sm" @click="copyToClipboard">
                  {{ copied ? 'Copié!' : 'Copier' }}
                </BaseButton>
              </div>
            </div>

            <div class="flex gap-2">
              <BaseButton variant="primary" @click="$router.push(`/pot/${createdPot.share_code}`)">
                Accéder à la Kaniot
              </BaseButton>
              <BaseButton variant="outline" @click="$router.push('/dashboard')">
                Voir dans le tableau de bord
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
import { useMoneyPots } from '@/composables/useMoneyPots'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import type { MoneyPot } from '@/types'

const { createPot, loading } = useMoneyPots()

const form = reactive({
  title: '',
  target_amount: '',
  expiration_date: '',
  password: '',
})

const errors = reactive({
  title: '',
  target_amount: '',
  expiration_date: '',
  password: '',
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
      password: form.password || undefined,
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