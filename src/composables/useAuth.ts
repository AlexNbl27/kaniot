import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'

const user = ref<User | null>(null)

export const useAuth = () => {
  const isAuthenticated = computed(() => !!user.value)

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) throw error
    user.value = data.user
    return data
  }

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    
    if (error) throw error
    return data
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    user.value = null
  }

  const checkUser = async () => {
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    user.value = currentUser
  }

  // Initialize auth state
  checkUser()

  // Listen for auth changes
  supabase.auth.onAuthStateChange((_, session) => {
    user.value = session?.user ?? null
  })

  return {
    user: computed(() => user.value),
    isAuthenticated,
    signIn,
    signUp,
    signOut,
    checkUser,
  }
}