<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
    <div class="container mx-auto px-4 py-16">
      <div class="text-center mb-16">
        <h1 class="text-5xl font-bold text-gray-900 mb-6">
          Money Pot Manager
        </h1>
        <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Create shared money pots for group expenses, events, and collective funding. 
          Fair distribution, real-time updates, and easy sharing.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <BaseButton 
            variant="primary" 
            size="lg"
            @click="$router.push('/create')"
          >
            Create Money Pot
          </BaseButton>
          <BaseButton 
            variant="outline" 
            size="lg"
            @click="$router.push('/dashboard')"
          >
            View Dashboard
          </BaseButton>
        </div>
      </div>

      <div class="grid md:grid-cols-3 gap-8 mb-16">
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
          <p class="text-gray-600">Share your unique link with participants who can pledge their maximum contribution.</p>
        </BaseCard>

        <BaseCard class="text-center">
          <div class="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-2xl">⚖️</span>
          </div>
          <h3 class="text-xl font-semibold mb-2">Fair Distribution</h3>
          <p class="text-gray-600">Automatic calculation ensures fair contribution distribution based on everyone's pledges.</p>
        </BaseCard>
      </div>

      <div class="text-center">
        <h2 class="text-3xl font-bold text-gray-900 mb-8">How It Works</h2>
        <div class="max-w-4xl mx-auto">
          <div class="grid md:grid-cols-4 gap-6">
            <div class="flex flex-col items-center">
              <div class="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">1</div>
              <h4 class="font-semibold mb-2">Create Pot</h4>
              <p class="text-sm text-gray-600">Set up your money pot with title and target amount</p>
            </div>
            <div class="flex flex-col items-center">
              <div class="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">2</div>
              <h4 class="font-semibold mb-2">Share Link</h4>
              <p class="text-sm text-gray-600">Send the unique link to potential contributors</p>
            </div>
            <div class="flex flex-col items-center">
              <div class="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">3</div>
              <h4 class="font-semibold mb-2">Collect Pledges</h4>
              <p class="text-sm text-gray-600">Participants join and pledge their maximum contribution</p>
            </div>
            <div class="flex flex-col items-center">
              <div class="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">4</div>
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
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
</script>