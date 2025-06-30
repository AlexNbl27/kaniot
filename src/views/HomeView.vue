<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
    <div class="container mx-auto px-4 py-16">
      <div class="text-center mb-16">
        <h1 class="text-5xl font-bold text-gray-900 mb-6">
          Kaniot
        </h1>
        <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Create shared money pots for group expenses, events, and collective funding.
          Fair distribution, real-time updates, and easy sharing.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <BaseButton variant="primary" size="lg" @click="$router.push('/create')">
            Create Money Pot
          </BaseButton>
          <BaseButton variant="outline" size="lg" @click="$router.push('/dashboard')">
            View Dashboard
          </BaseButton>
        </div>

        <div class="mt-12">
          <p class="text-lg text-gray-700 mb-4">
            Have an invite code? Join a money pot directly:
          </p>
          <div class="max-w-sm mx-auto flex flex-col items-center">
            <div class="relative w-full h-16 flex items-center justify-center">
              <input v-model="joinCode" type="text" maxlength="8" ref="inputRef" :disabled="isLoading"
                @blur="isFocused = false" @focus="isFocused = true"
                class="absolute inset-0 w-full h-full bg-transparent border-none outline-none z-10 text-transparent caret-transparent focus:ring-0 focus-visible:outline-none"
                aria-label="Money pot share code" />
              <div @click="inputRef?.focus()"
                class="absolute inset-0 w-full h-full flex items-center justify-center gap-2 cursor-text select-none"
                aria-hidden="true">
                <div v-for="i in 8" :key="i"
                  class="w-10 h-12 border-2 rounded-md flex items-center justify-center text-xl font-bold transition-all duration-200"
                  :class="{
                    // Focus color logic
                    'border-red-500': !!error,
                    'border-black': isFocused && !error,
                    'border-gray-300': !isFocused && !error,

                    // Error color logic
                    'text-red-600': !!error,
                    'text-gray-900': !error
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

      <div class="grid md:grid-cols-3 gap-8 mb-12">
        <BaseCard class="text-center">
          <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-2xl">🎯</span>
          </div>
          <h3 class="text-xl font-semibold mb-2">Set Your Target</h3>
          <p class="text-gray-600">Define the total amount needed and optional deadline for your money pot.</p>
        </BaseCard>

        <BaseCard class="text-center">
          <div class="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-2xl">👥</span>
          </div>
          <h3 class="text-xl font-semibold mb-2">Share & Collect</h3>
          <p class="text-gray-600">Share your unique link with participants who can pledge their maximum contribution.
          </p>
        </BaseCard>

        <BaseCard class="text-center">
          <div class="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-2xl">⚖️</span>
          </div>
          <h3 class="text-xl font-semibold mb-2">Fair Distribution</h3>
          <p class="text-gray-600">Automatic calculation ensures fair contribution distribution based on everyone's
            pledges.</p>
        </BaseCard>
      </div>

      <div class="text-center">
        <h2 class="text-3xl font-bold text-gray-900 mb-8">How It Works</h2>
        <div class="max-w-4xl mx-auto">
          <div class="grid md:grid-cols-4 gap-6">
            <div class="flex flex-col items-center">
              <div
                class="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">
                1</div>
              <h4 class="font-semibold mb-2">Create Pot</h4>
              <p class="text-sm text-gray-600">Set up your money pot with title and target amount</p>
            </div>
            <div class="flex flex-col items-center">
              <div
                class="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">
                2</div>
              <h4 class="font-semibold mb-2">Share Link</h4>
              <p class="text-sm text-gray-600">Send the unique link to potential contributors</p>
            </div>
            <div class="flex flex-col items-center">
              <div
                class="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">
                3</div>
              <h4 class="font-semibold mb-2">Collect Pledges</h4>
              <p class="text-sm text-gray-600">Participants join and pledge their maximum contribution</p>
            </div>
            <div class="flex flex-col items-center">
              <div
                class="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">
                4</div>
              <h4 class="font-semibold mb-2">Fair Split</h4>
              <p class="text-sm text-gray-600">System calculates fair distribution automatically</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseCard from '@/components/ui/BaseCard.vue'

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
      error.value = "This pot doesn't seem to exist. Please check the code.";
    }

  } catch (err) {
    console.error("Error checking pot existence:", err);
    error.value = "An error occurred. Please try again.";
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