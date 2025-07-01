import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'
import type { User, UserAttributes } from '@supabase/supabase-js'

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

  const signUp = async (email: string, password: string, username: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: username,
        }
      }
    })

    if (error) throw error
    user.value = data.user
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

  const updateUser = async (attributes: UserAttributes) => {
    const { data, error } = await supabase.auth.updateUser(attributes);
    if (error) throw error;
    user.value = data.user;
    return data.user;
  }

  const deleteUserAccount = async () => {
    console.info('Deleting user account... This action is irreversible.')
    const { error } = await supabase.rpc('delete_user_account');
    if (error) throw error;
    user.value = null;
  }


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
    updateUser,
    deleteUserAccount,
  }
}