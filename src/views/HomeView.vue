<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-800 dark:to-gray-900">
    <div class="container mx-auto px-4 py-8 sm:py-16">
      <div class="text-center mb-12">
        <img :src="logoSrc" alt="Kaniot"
           class="mx-auto mb-12 h-auto w-full max-w-xs object-contain md-block hidden sm:block" />
        <p class="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
          Créez des Kaniots partagées pour les dépenses de groupe, événements et collectes collectives.
          Répartition équitable, mises à jour en temps réel et partage facile.
          Kaniot est une solution <strong>100% gratuite</strong> et open source pour gérer vos cagnottes en toute
          simplicité.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <BaseButton variant="primary" size="lg" to="/create">
            Créer une Kaniot
          </BaseButton>
          <BaseButton variant="outline" size="lg" to="/dashboard">
            Tableau de bord
          </BaseButton>
        </div>

        <div class="mt-12">
          <p class="text-lg text-gray-600 dark:text-gray-400 mb-4">
            Vous avez un code d'invitation ? Rejoignez une cagnotte directement :
          </p>
          <div class="max-w-sm mx-auto flex flex-col items-center">
            <div class="relative w-full h-16 flex items-center justify-center">
              <input v-model="joinCode" type="text" maxlength="8" ref="inputRef" :disabled="isLoading"
                @blur="isFocused = false" @focus="isFocused = true"
                class="absolute inset-0 w-full h-full bg-transparent border-none outline-none z-10 text-transparent caret-transparent focus:ring-0 focus-visible:outline-none"
                aria-label="Code de partage de cagnotte" />
              <div @click="inputRef?.focus()"
                class="absolute inset-0 w-full h-full flex items-center justify-center gap-2 cursor-text select-none"
                aria-hidden="true">
                <div v-for="i in 8" :key="i"
                  class="w-10 h-12 border-2 rounded-md flex items-center justify-center text-xl font-bold transition-all duration-200"
                  :class="{
                    'border-red-500 dark:border-red-400': !!error,
                    'border-black dark:border-white': isFocused && !error,
                    'border-gray-300 dark:border-gray-600': !isFocused && !error,
                    'text-red-600 dark:text-red-400': !!error,
                    'text-gray-900 dark:text-white': !error
                  }">
                  {{ joinCode[i - 1] || '' }}
                </div>
              </div>
            </div>
            <div class="flex items-center justify-center h-5 w-full mt-2">
              <template v-if="isLoading">
                <div class="flex gap-1 justify-center w-full">
                  <span v-for="i in 3" :key="i" class="block w-2 h-2 rounded-full bg-primary-600 animate-bounce"
                    :style="{ animationDelay: `${(i - 1) * 0.15}s` }"></span>
                </div>
              </template>
              <template v-else-if="error">
                <p class="text-sm text-red-600 mt-2 w-full text-center">{{ error }}</p>
              </template>
            </div>
          </div>
        </div>
      </div>

      <div class="grid md:grid-cols-3 gap-8 mb-16">
        <BaseCard class="text-center">
          <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-2xl">🎯</span>
          </div>
          <h3 class="text-xl font-semibold mb-2">Définissez votre objectif</h3>
          <p class="text-gray-600 dark:text-gray-400">Indiquez le montant total souhaité et, si besoin, une date limite
            pour
            votre
            cagnotte.</p>
        </BaseCard>

        <BaseCard class="text-center">
          <div class="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-2xl">👥</span>
          </div>
          <h3 class="text-xl font-semibold mb-2">Partagez & Collectez</h3>
          <p class="text-gray-600 dark:text-gray-400">Partagez votre lien unique avec les participants qui pourront
            indiquer
            leur
            contribution
            maximale.</p>
        </BaseCard>

        <BaseCard class="text-center">
          <div class="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-2xl">⚖️</span>
          </div>
          <h3 class="text-xl font-semibold mb-2">Répartition équitable</h3>
          <p class="text-gray-600 dark:text-gray-400">Le calcul automatique garantit une répartition juste selon les
            engagements de chacun.
          </p>
        </BaseCard>
      </div>

      <div class="text-center">
        <h2 class="text-3xl font-bold mb-8">Comment ça marche ?</h2>
        <div class="max-w-4xl mx-auto">
          <div class="grid md:grid-cols-4 gap-6">
            <div class="flex flex-col items-center">
              <div
                class="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">
                1</div>
              <h4 class="font-semibold mb-2">Créez la Kaniot</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">Configurez votre Kaniot avec un titre et un montant
                cible
              </p>
            </div>
            <div class="flex flex-col items-center">
              <div
                class="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">
                2</div>
              <h4 class="font-semibold mb-2">Partagez le lien</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">Envoyez le lien unique aux participants</p>
            </div>
            <div class="flex flex-col items-center">
              <div
                class="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">
                3</div>
              <h4 class="font-semibold mb-2">Collectez les promesses</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">Les participants rejoignent et indiquent leur
                contribution
                maximale</p>
            </div>
            <div class="flex flex-col items-center">
              <div
                class="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">
                4</div>
              <h4 class="font-semibold mb-2">Répartition équitable</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">Le système calcule automatiquement la répartition
                équitable
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import { useTheme } from '@/composables/useTheme'

const { isDark } = useTheme()

const logoSrc = computed(() => {
  return isDark.value ? '/logo-white.png' : '/logo.png'
})

const router = useRouter()
const joinCode = ref('')
const isLoading = ref(false)
const error = ref<string | null>(null)
const isFocused = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)

const checkAndRedirect = async (code: string) => {
  if (isLoading.value) return;

  isLoading.value = true;
  error.value = null;
  try {
    const { data, error: dbError } = await supabase
      .from('money_pots')
      .select('id')
      .eq('share_code', code.toUpperCase())
      .maybeSingle();

    if (dbError) throw dbError;
    if (data) {
      router.push(`/pot/${code}`);
    } else {
      error.value = "Cette cagnotte n'existe pas. Merci de vérifier le code.";
    }

  } catch (err) {
    error.value = "Une erreur est survenue. Veuillez réessayer.";
  } finally {
    isLoading.value = false;
  }
}

watch(joinCode, (newCode) => {
  const code = newCode.trim().toUpperCase()

  if (newCode !== code) {
    joinCode.value = code;
    return;
  }

  if (code.length < 8) {
    error.value = null;
  }

  if (code.length === 8) {
    checkAndRedirect(code);
  }
})
</script>