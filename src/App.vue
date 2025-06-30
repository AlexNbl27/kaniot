<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-20">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center h-16">
          <router-link to="/" class="flex items-center gap-2 text-primary-600 hover:opacity-80 transition-opacity" @click="isMobileMenuOpen = false">
            <span class="text-3xl">💰</span>
            <span class="hidden md:inline text-xl font-bold">Kaniot</span>
          </router-link>

          <nav class="hidden md:flex items-center gap-2">
            <template v-if="isAuthenticated">
              <router-link to="/dashboard" v-slot="{ isActive, href, navigate }">
                <a :href="href" @click="navigate" class="px-3 py-2 rounded-md text-sm font-medium transition-colors border-b-2" :class="isActive ? 'text-primary-600 font-semibold border-primary-600' : 'text-gray-600 hover:text-primary-700 border-transparent'">
                  Dashboard
                </a>
              </router-link>
              <router-link to="/create" v-slot="{ isActive, href, navigate }">
                <a :href="href" @click="navigate" class="px-3 py-2 rounded-md text-sm font-medium transition-colors border-b-2" :class="isActive ? 'text-primary-600 font-semibold border-primary-600' : 'text-gray-600 hover:text-primary-700 border-transparent'">
                  Create Pot
                </a>
              </router-link>

              <button @click="handleSignOut" class="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors text-red-600 hover:bg-red-50 hover:text-red-700 border-b-2 border-transparent">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Sign Out</span>
              </button>
            </template>
            <template v-else>
              <router-link to="/auth" v-slot="{ isActive, href, navigate }">
                <a :href="href" @click="navigate" class="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors border-b-2" :class="isActive ? 'text-primary-600 font-semibold border-primary-600' : 'text-gray-600 hover:text-primary-700 border-transparent'">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Sign In</span>
                </a>
              </router-link>
            </template>
          </nav>

          <div class="md:hidden">
            <template v-if="isAuthenticated">
              <button @click="toggleMobileMenu" class="p-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500" aria-label="Open main menu" :aria-expanded="isMobileMenuOpen">
                <svg class="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
              </button>
            </template>
            <template v-else>
              <router-link to="/auth">
                <BaseButton size="sm" variant="outline">Sign In</BaseButton>
              </router-link>
            </template>
          </div>
        </div>
      </div>

      <div v-show="isMobileMenuOpen" class="md:hidden fixed inset-0 z-30" aria-modal="true">
        <transition enter-active-class="transition-opacity ease-in-out duration-300" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition-opacity ease-in-out duration-300" leave-from-class="opacity-100" leave-to-class="opacity-0">
          <div v-show="isMobileMenuOpen" class="fixed inset-0 bg-black bg-opacity-50" @click="toggleMobileMenu"></div>
        </transition>
        <div class="fixed top-0 right-0 bottom-0 w-64 bg-white shadow-xl p-4 transition-transform duration-300 ease-in-out" :class="isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'">
          <div class="flex justify-between items-center mb-6">
            <span class="font-bold text-lg text-primary-600">Menu</span>
            <button @click="toggleMobileMenu" class="p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-800" aria-label="Close menu">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <nav class="flex flex-col gap-2">
            <router-link to="/dashboard" class="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md" @click="toggleMobileMenu">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              <span>Dashboard</span>
            </router-link>
            <router-link to="/create" class="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md" @click="toggleMobileMenu">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>Create Pot</span>
            </router-link>
            <button @click="handleSignOutMobile" class="flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-md text-left transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              <span>Sign Out</span>
            </button>
          </nav>
        </div>
      </div>
    </header>

    <main class="flex-grow">
      <router-view />
    </main>

    <footer class="bg-gray-900 text-white py-12">
      <div class="container mx-auto px-4 text-center">
        <p class="text-gray-400">
          © {{ new Date().getFullYear() }} Kaniot. Fair distribution for collective funding.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/ui/BaseButton.vue'

const { isAuthenticated, signOut } = useAuth()
const router = useRouter()

const isMobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const handleSignOut = async () => {
  try {
    await signOut()
    router.push('/')
  } catch (err) {
    console.error('Sign out failed:', err)
  }
}

const handleSignOutMobile = async () => {
  await handleSignOut();
  isMobileMenuOpen.value = false;
}
</script>