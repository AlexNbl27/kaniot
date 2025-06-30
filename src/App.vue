<template>
  <div>
    <!-- Navigation -->
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center h-16">
          <router-link to="/" class="text-xl font-bold text-primary-600">
            💰 Kaniot
          </router-link>
          
          <div class="flex items-center gap-4">
            <template v-if="isAuthenticated">
              <router-link 
                to="/dashboard" 
                class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Dashboard
              </router-link>
              <router-link 
                to="/create" 
                class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Create
              </router-link>
              <BaseButton variant="ghost" size="sm" @click="handleSignOut">
                Sign Out
              </BaseButton>
            </template>
            <template v-else>
              <router-link 
                to="/auth" 
                class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Sign In
              </router-link>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main>
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12">
      <div class="container mx-auto px-4 text-center">
        <p class="text-gray-400">
          © 2025 Kaniot. Fair distribution for collective funding.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/ui/BaseButton.vue'

const { isAuthenticated, signOut } = useAuth()
const router = useRouter()

const handleSignOut = async () => {
  try {
    await signOut()
    router.push('/')
  } catch (err) {
    console.error('Sign out failed:', err)
  }
}
</script>