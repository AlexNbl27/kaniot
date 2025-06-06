<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4">
      <div class="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p class="text-gray-600">Manage your money pots and track contributions</p>
        </div>
        <BaseButton @click="$router.push('/create')">
          Create New Pot
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
        <div class="text-6xl mb-4">💰</div>
        <h2 class="text-2xl font-semibold text-gray-700 mb-2">No Money Pots Yet</h2>
        <p class="text-gray-600 mb-6">Create your first money pot to start collecting contributions</p>
        <BaseButton @click="$router.push('/create')">
          Create Your First Pot
        </BaseButton>
      </div>

      <div v-else class="space-y-6">
        <!-- Filters -->
        <BaseCard :padding="false">
          <div class="px-6 py-4">
            <div class="flex flex-col sm:flex-row gap-4">
              <select 
                v-model="sortBy" 
                class="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="created_at">Sort by Date Created</option>
                <option value="target_amount">Sort by Target Amount</option>
                <option value="title">Sort by Title</option>
              </select>
              
              <select 
                v-model="sortOrder" 
                class="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>
          </div>
        </BaseCard>

        <!-- Pots Grid -->
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <BaseCard 
            v-for="pot in sortedPots" 
            :key="pot.id"
            hover
            class="cursor-pointer"
            @click="$router.push(`/pot/${pot.share_code}`)"
          >
            <div class="space-y-4">
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ pot.title }}</h3>
                <p class="text-sm text-gray-600">
                  Created {{ formatDate(pot.created_at) }}
                </p>
              </div>
              
              <div class="space-y-2">
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Target Amount</span>
                  <span class="font-semibold">€{{ pot.target_amount.toFixed(2) }}</span>
                </div>
                
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Status</span>
                  <span :class="getStatusColor(pot)" class="text-sm font-medium">
                    {{ getStatus(pot) }}
                  </span>
                </div>
              </div>
              
              <div class="pt-4 border-t border-gray-200">
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-600">Share Code</span>
                  <code class="bg-gray-100 px-2 py-1 rounded text-xs">{{ pot.share_code }}</code>
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

const { getUserPots, loading, error } = useMoneyPots()

const pots = ref<MoneyPot[]>([])
const sortBy = ref('created_at')
const sortOrder = ref('desc')

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
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const getStatus = (pot: MoneyPot) => {
  if (pot.expiration_date && new Date(pot.expiration_date) < new Date()) {
    return 'Expired'
  }
  return 'Active'
}

const getStatusColor = (pot: MoneyPot) => {
  const status = getStatus(pot)
  return status === 'Expired' ? 'text-red-600' : 'text-green-600'
}

onMounted(() => {
  loadPots()
})
</script>