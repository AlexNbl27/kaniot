<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
    <div class="max-w-md w-full">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">{{ isSignUp ? 'Sign Up' : 'Sign In' }}</h1>
        <p class="text-gray-600 mt-2">
          {{ isSignUp ? 'Create an account to manage money pots' : 'Sign in to your account' }}
        </p>
      </div>

      <BaseCard>
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <BaseInput
            id="email"
            v-model="form.email"
            type="email"
            label="Email"
            placeholder="Enter your email"
            required
            :error="errors.email"
          />

          <BaseInput
            id="password"
            v-model="form.password"
            type="password"
            label="Password"
            placeholder="Enter your password"
            required
            :error="errors.password"
            :hint="isSignUp ? 'Password must be at least 6 characters' : ''"
          />

          <div v-if="authError" class="p-3 bg-red-50 border border-red-200 rounded-md">
            <p class="text-sm text-red-600">{{ authError }}</p>
          </div>

          <BaseButton
            type="submit"
            :loading="loading"
            class="w-full"
          >
            {{ isSignUp ? 'Create Account' : 'Sign In' }}
          </BaseButton>
        </form>

        <div class="mt-6 text-center">
          <button
            type="button"
            @click="isSignUp = !isSignUp"
            class="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            {{ isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up" }}
          </button>
        </div>
      </BaseCard>

      <div class="mt-6 text-center">
        <BaseButton variant="ghost" @click="$router.push('/')">
          ← Back to Home
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseCard from '@/components/ui/BaseCard.vue'

const router = useRouter()
const { signIn, signUp } = useAuth()

const isSignUp = ref(false)
const loading = ref(false)
const authError = ref('')

const form = reactive({
  email: '',
  password: '',
})

const errors = reactive({
  email: '',
  password: '',
})

const validateForm = () => {
  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })

  let isValid = true

  if (!form.email.trim()) {
    errors.email = 'Email is required'
    isValid = false
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    errors.email = 'Please enter a valid email'
    isValid = false
  }

  if (!form.password) {
    errors.password = 'Password is required'
    isValid = false
  } else if (isSignUp.value && form.password.length < 6) {
    errors.password = 'Password must be at least 6 characters'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return

  loading.value = true
  authError.value = ''

  try {
    if (isSignUp.value) {
      await signUp(form.email, form.password)
      authError.value = 'Check your email for a confirmation link!'
    } else {
      await signIn(form.email, form.password)
      router.push('/dashboard')
    }
  } catch (err: any) {
    authError.value = err.message || 'Authentication failed'
  } finally {
    loading.value = false
  }
}
</script>