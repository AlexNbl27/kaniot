<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 flex flex-col transition-colors duration-300">
    <header
      class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-20 transition-colors duration-300">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center h-16">
          <router-link to="/" class="flex items-center gap-2 text-primary-600 hover:opacity-80 transition-opacity"
            @click="isMobileMenuOpen = false">
            <img :src="logoSrc" alt="" class="h-6 w-auto" />
          </router-link>

          <nav class="hidden md:flex items-center gap-2">
            <template v-if="isAuthenticated">
              <router-link to="/dashboard" v-slot="{ isActive, href, navigate }">
                <a :href="href" @click="navigate"
                  class="px-3 py-2 rounded-md text-sm font-medium transition-colors border-b-2"
                  :class="isActive ? 'text-primary-600 dark:text-primary-400 font-semibold border-primary-600 dark:border-primary-400' : 'text-gray-600 dark:text-gray-300 hover:text-primary-700 dark:hover:text-primary-400 border-transparent'">
                  Tableau de bord
                </a>
              </router-link>
              <router-link to="/create" v-slot="{ isActive, href, navigate }">
                <a :href="href" @click="navigate"
                  class="px-3 py-2 rounded-md text-sm font-medium transition-colors border-b-2"
                  :class="isActive ? 'text-primary-600 dark:text-primary-400 font-semibold border-primary-600 dark:border-primary-400' : 'text-gray-600 dark:text-gray-300 hover:text-primary-700 dark:hover:text-primary-400 border-transparent'">
                  Créer une Kaniot
                </a>
              </router-link>
              <button @click="handleSignOut"
                class="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/40 hover:text-red-700 dark:hover:text-red-300">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Se déconnecter</span>
              </button>
            </template>
            <template v-else>
              <router-link to="/auth" v-slot="{ isActive, href, navigate }">
                <a :href="href" @click="navigate"
                  class="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors border-b-2"
                  :class="isActive ? 'text-primary-600 dark:text-primary-400 font-semibold border-primary-600 dark:border-primary-400' : 'text-gray-600 dark:text-gray-300 hover:text-primary-700 dark:hover:text-primary-400 border-transparent'">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Se connecter</span>
                </a>
              </router-link>
            </template>
            <button @click="toggleTheme"
              class="ml-2 p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Changer de thème">
              <svg v-if="!isDark" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </button>
          </nav>

          <div class="md:hidden flex items-center gap-2">
            <button @click="toggleTheme"
              class="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Changer de thème">
              <svg v-if="!isDark" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </button>
            <template v-if="isAuthenticated">
              <button @click="toggleMobileMenu"
                class="p-2 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                aria-label="Ouvrir le menu principal" :aria-expanded="isMobileMenuOpen">
                <svg class="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7">
                  </path>
                </svg>
              </button>
            </template>
            <template v-else>
              <router-link to="/auth">
                <BaseButton size="sm" variant="outline">Se connecter</BaseButton>
              </router-link>
            </template>
          </div>
        </div>
      </div>

      <div v-show="isMobileMenuOpen" class="md:hidden fixed inset-0 z-30" aria-modal="true">
        <transition enter-active-class="transition-opacity ease-in-out duration-300" enter-from-class="opacity-0"
          enter-to-class="opacity-100" leave-active-class="transition-opacity ease-in-out duration-300"
          leave-from-class="opacity-100" leave-to-class="opacity-0">
          <div v-show="isMobileMenuOpen" class="fixed inset-0 bg-black bg-opacity-70" @click="toggleMobileMenu"></div>
        </transition>
        <div
          class="fixed top-0 right-0 bottom-0 w-64 bg-white dark:bg-gray-800 shadow-xl p-4 transition-transform duration-300 ease-in-out"
          :class="isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'">
          <div class="flex justify-between items-center mb-6">
            <span class="font-bold text-lg text-primary-600 dark:text-primary-400">Menu</span>
            <button @click="toggleMobileMenu"
              class="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Fermer le menu">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav class="flex flex-col gap-2">
            <router-link to="/dashboard"
              class="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              @click="toggleMobileMenu">
              <span>Tableau de bord</span>
            </router-link>
            <router-link to="/create"
              class="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              @click="toggleMobileMenu">
              <span>Créer une Kaniot</span>
            </router-link>
            <hr class="border-gray-200 dark:border-gray-700 my-2" />
            <button @click="handleSignOutMobile"
              class="flex items-center gap-3 px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/40 rounded-md text-left transition-colors">
              <span>Se déconnecter</span>
            </button>
          </nav>
        </div>
      </div>
    </header>

    <main class="flex-grow">
      <router-view />
    </main>

    <footer class="bg-gray-800 dark:bg-black text-white py-8">
      <div class="container mx-auto px-4 text-center">
        <p class="text-gray-400">
          © {{ new Date().getFullYear() }} Kaniot. Outil de gestion de cagnottes en ligne fait avec ❤️ par
          <a href="https://github.com/alexnbl27" target="_blank" rel="noopener"
            class="underline hover:text-primary-400">@alexnbl27</a>
        </p>
        <router-link to="/terms-of-use" class="text-sm text-gray-500 hover:text-gray-300 transition-colors">
          Terms of Use
        </router-link>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useTheme } from '@/composables/useTheme'

const { isAuthenticated, signOut } = useAuth()
const router = useRouter()
const { isDark, toggleTheme } = useTheme()

const logoSrc = '/KANIOT.svg'
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