<template>
  <component
    :is="componentTag"
    :to="to"
    :href="href"
    :type="componentTag === 'button' ? type : undefined"
    :disabled="componentTag === 'button' ? disabled || loading : undefined"
    :class="buttonClasses"
    :aria-disabled="disabled || loading"
    :role="componentTag !== 'button' && (disabled || loading) ? 'link' : undefined"
    @click="handleClick"
  >
    <span v-if="loading" class="animate-spin mr-2">⟳</span>
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit'
  disabled?: boolean
  loading?: boolean
  to?: string | object
  href?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  disabled: false,
  loading: false,
  to: undefined,
  href: undefined,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const componentTag = computed(() => {
  if (props.to) {
    return 'router-link'
  }
  if (props.href) {
    return 'a'
  }
  return 'button'
})

const buttonClasses = computed(() => {
  const base = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer'
  
  const variants = {
    primary: 'bg-primary-600 dark:bg-primary-700 text-white hover:bg-primary-700 dark:hover:bg-primary-600 focus:ring-primary-500 disabled:bg-gray-300',
    secondary: 'bg-secondary-600 dark:bg-secondary-700 text-white hover:bg-secondary-700 dark:hover:bg-secondary-600 focus:ring-secondary-500 disabled:bg-gray-300',
    outline: 'border-2 border-primary-600 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900 focus:ring-primary-500 disabled:border-gray-300 disabled:text-gray-400',
    ghost: 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-gray-500 disabled:text-gray-400',
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  if (componentTag.value !== 'button' && (props.disabled || props.loading)) {
    return `${base} ${variants[props.variant]} ${sizes[props.size]} opacity-50 cursor-not-allowed`
  }
  return `${base} ${variants[props.variant]} ${sizes[props.size]}`
})

function handleClick(event: MouseEvent) {
  if (props.disabled || props.loading) {
    event.preventDefault()
    return
  }
  emit('click', event)
}
</script>