<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4">
    <div class="max-w-md w-full">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold">{{ isSignUp ? 'Créer un compte' : 'Connexion' }}</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">
          {{ isSignUp ? 'Créez un compte pour gérer vos cagnottes' : 'Connectez-vous à votre compte' }}
        </p>
      </div>

      <BaseCard>
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <BaseInput v-if="isSignUp" id="username" v-model="form.username" type="text" label="Nom d'utilisateur"
            placeholder="Choisissez un nom d'utilisateur" required :error="errors.username" />

          <BaseInput id="email" v-model="form.email" type="email" label="Email" placeholder="Entrez votre email" required
            :error="errors.email" />

          <BaseInput id="password" v-model="form.password" type="password" label="Mot de passe"
            placeholder="Entrez votre mot de passe" required :error="errors.password"
            :hint="isSignUp ? 'Le mot de passe doit contenir au moins 6 caractères' : ''" />

          <div v-if="authError" class="p-3 bg-red-50 border border-red-200 rounded-md">
            <p class="text-sm text-red-600">{{ authError }}</p>
          </div>

          <BaseButton type="submit" :loading="loading" class="w-full">
            {{ isSignUp ? 'Créer le compte' : 'Se connecter' }}
          </BaseButton>
        </form>

        <div class="mt-6 text-center">
          <button type="button" @click="isSignUp = !isSignUp"
            class="text-primary-600 hover:text-primary-700 text-sm font-medium">
            {{ isSignUp ? 'Vous avez déjà un compte ? Connectez-vous' : "Pas encore de compte ? Créez-en un" }}
          </button>
        </div>
      </BaseCard>

      <div class="mt-6 text-center">
        <BaseButton variant="ghost" @click="$router.push('/')">
          ← Retour à l'accueil
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
  username: '',
})

const errors = reactive({
  email: '',
  password: '',
  username: '',
})

const validateForm = () => {
  // Réinitialiser les erreurs
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })

  let isValid = true

  if (isSignUp.value) {
    if (!form.username) {
      errors.username = "Le nom d'utilisateur est requis"
      isValid = false
    }
  }

  if (!form.email.trim()) {
    errors.email = "L'email est requis"
    isValid = false
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    errors.email = 'Veuillez entrer un email valide'
    isValid = false
  }

  if (!form.password) {
    errors.password = 'Le mot de passe est requis'
    isValid = false
  } else if (isSignUp.value && form.password.length < 6) {
    errors.password = 'Le mot de passe doit contenir au moins 6 caractères'
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
      await signUp(form.email, form.password, form.username)
      router.push('/dashboard')
    } else {
      await signIn(form.email, form.password)
      router.push('/dashboard')
    }
  } catch (err: any) {
    authError.value = err.message || "Échec de l'authentification"
  } finally {
    loading.value = false
  }
}
</script>