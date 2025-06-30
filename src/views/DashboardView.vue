<template>
  <div class="min-h-screen py-8">
    <div class="container mx-auto px-4">
      <div class="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-3xl font-bold">Tableau de bord</h1>
          <p class="text-gray-600 dark:text-gray-400">
            Gérez vos cagnottes et suivez leur avancement
          </p>
        </div>
        <BaseButton @click="$router.push('/create')">
          Créer une Kaniot
        </BaseButton>
      </div>

      <div v-if="loading" class="flex justify-center items-center min-h-64">
        <div class="animate-spin text-4xl">⟳</div>
      </div>

      <div v-else-if="error" class="text-center py-12">
        <div class="text-4xl mb-4">❌</div>
        <h2 class="text-xl font-semibold text-red-600 mb-2">Error</h2>
        <p class="text-gray-600">{{ error }}</p>
      </div>

      <div v-else-if="pots.length === 0" class="text-center py-12">
        <h2 class="text-2xl font-semibold text-gray-700 mb-2">Aucune Kaniot trouvée</h2>
        <p class="text-gray-600 mb-6">Créez votre première Kaniot pour commencer à collecter des contributions</p>
        <BaseButton @click="$router.push('/create')">
          Créer votre première Kaniot
        </BaseButton>
      </div>

      <div v-else class="space-y-6">
        <BaseCard :padding="false">
          <div class="px-6 py-4">
            <div class="flex flex-col sm:flex-row gap-4">
              <select v-model="sortBy" class="px-3 py-2 border border-gray-300 dark:bg-gray-800 rounded-md text-sm">
                <option value="created_at">Trier par Date de Création</option>
                <option value="target_amount">Trier par Montant</option>
                <option value="title">Trier par Nom de Kaniot</option>
              </select>

              <select v-model="sortOrder" class="px-3 py-2 border border-gray-300 dark:bg-gray-800 rounded-md text-sm">
                <option value="desc">Afficher les plus récentes d'abord</option>
                <option value="asc">Afficher les plus anciennes d'abord</option>
              </select>
            </div>
          </div>
        </BaseCard>

        <!-- Pots Grid -->
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <BaseCard v-for="pot in sortedPots" :key="pot.id" hover class="relative cursor-pointer"
            @click="$router.push(`/pot/${pot.share_code}`)">
            <button @click.stop="handleDeletePot(pot)"
              class="absolute top-3 right-3 p-2 rounded-full hover:bg-red-100 hover:text-red-600 transition-colors duration-200"
              aria-label="Supprimer la cagnotte">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>

            <div class="space-y-4">
              <div>
                <h3 class="text-lg font-semibold mb-1">{{ pot.title }}</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Crée le {{ formatDate(pot.created_at) }}
                </p>
              </div>

              <div class="space-y-2">
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600 dark:text-gray-400">Objectif</span>
                  <span class="font-semibold">€{{ pot.target_amount.toFixed(2) }}</span>
                </div>

                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600 dark:text-gray-400">Statut de la Kaniot</span>
                  <span :class="getStatusColor(pot)" class="text-sm font-medium">
                    {{ getStatus(pot) }}
                  </span>
                </div>
              </div>

              <div class="pt-4 border-t border-gray-200">
                <div @click.stop="copyShareCode(pot.share_code)"
                  class="flex items-center justify-between text-sm cursor-pointer group"
                  title="Copier le code de partage">
                  <span :class="[
                    'transition-colors duration-200',
                    copiedCode === pot.share_code ? 'font-semibold text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400 group-hover:text-primary-600'
                  ]">
                    {{ copiedCode === pot.share_code ? 'Copié !' : 'Code de partage' }}
                  </span>
                  <code
                    class="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs group-hover:bg-primary-100 dark:group-hover:bg-primary-700 transition-colors duration-200">
      {{ pot.share_code }}
    </code>
                </div>
              </div>
            </div>
          </BaseCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useMoneyPots } from '@/composables/useMoneyPots'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import type { MoneyPot } from '@/types'

const { getUserPots, loading, error, deleteMoneyPot } = useMoneyPots()

const pots = ref<MoneyPot[]>([])
const sortBy = ref('created_at')
const sortOrder = ref('desc')

const copiedCode = ref<string | null>(null)

const copyShareCode = async (code: string) => {
  try {
    await navigator.clipboard.writeText(code);
    copiedCode.value = code;
    setTimeout(() => {
      if (copiedCode.value === code) {
        copiedCode.value = null;
      }
    }, 2000);
  } catch (err) {
    console.error('Erreur lors de la copie du code :', err);
    alert("La copie a échoué.");
  }
}

const handleDeletePot = async (potToDelete: MoneyPot) => {
  const confirmed = window.confirm(
    `Êtes-vous sûr de vouloir supprimer la cagnotte "${potToDelete.title}" ? Cette action est irréversible.`
  )

  if (!confirmed) {
    return
  }

  try {
    await deleteMoneyPot(potToDelete.id)
    pots.value = pots.value.filter((pot) => pot.id !== potToDelete.id)
  } catch (err: any) {
    console.error('Failed to delete pot:', err)
  }
}

const sortedPots = computed(() => {
  const sorted = [...pots.value].sort((a, b) => {
    let valueA: any = a[sortBy.value as keyof MoneyPot]
    let valueB: any = b[sortBy.value as keyof MoneyPot]

    if (sortBy.value === 'created_at') {
      valueA = new Date(valueA).getTime()
      valueB = new Date(valueB).getTime()
    }

    if (typeof valueA === 'string') {
      valueA = valueA.toLowerCase()
      valueB = valueB.toLowerCase()
    }

    if (sortOrder.value === 'desc') {
      return valueB > valueA ? 1 : -1
    } else {
      return valueA > valueB ? 1 : -1
    }
  })

  return sorted
})

const loadPots = async () => {
  try {
    const userPots = await getUserPots()
    pots.value = userPots
  } catch (err) {
    console.error('Failed to load pots:', err)
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const getStatus = (pot: MoneyPot) => {
  if (pot.expiration_date && new Date(pot.expiration_date) < new Date()) {
    return 'Terminée'
  }
  return 'En cours'
}

const getStatusColor = (pot: MoneyPot) => {
  const status = getStatus(pot)
  return status === 'Terminée' ? 'text-red-600' : 'text-green-600'
}

onMounted(() => {
  loadPots()
})
</script>