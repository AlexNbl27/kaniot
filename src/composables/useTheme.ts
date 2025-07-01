// src/composables/useTheme.ts

import { ref, watch, onMounted, computed } from 'vue'

type Theme = 'light' | 'dark'
const theme = ref<Theme>('light')

export const useTheme = () => {
    const initializeTheme = () => {
        const savedTheme = localStorage.getItem('theme') as Theme | null
        if (savedTheme) {
            theme.value = savedTheme
        } else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            theme.value = prefersDark ? 'dark' : 'light'
        }
    }

    const setTheme = (newTheme: Theme) => {
        theme.value = newTheme
        localStorage.setItem('theme', newTheme)
    }

    const toggleTheme = () => {
        setTheme(theme.value === 'light' ? 'dark' : 'light')
    }

    watch(theme, (newTheme) => {
        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }, { immediate: true })

    onMounted(initializeTheme)
    return {
        theme: computed(() => theme.value),
        isDark: computed(() => theme.value === 'dark'),
        toggleTheme,
        setTheme,
    }
}