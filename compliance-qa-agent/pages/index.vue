<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <!-- Hero Section -->
      <div class="text-center mb-16">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          {{ $config.public.appName }}
        </h1>
        <p class="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Your AI-powered compliance assistant. Get instant answers to compliance questions, 
          backed by official company policies and procedures.
        </p>
        
        <div class="flex justify-center space-x-4">
          <NuxtLink 
            v-if="isAuthenticated"
            to="/dashboard"
            class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Go to Dashboard
          </NuxtLink>
          <NuxtLink 
            v-else
            to="/login"
            class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Get Started
          </NuxtLink>
          
          <NuxtLink 
            v-if="isAuthenticated"
            to="/chat"
            class="bg-white text-blue-600 px-6 py-3 rounded-lg border border-blue-600 hover:bg-blue-50 transition-colors font-medium"
          >
            Ask a Question
          </NuxtLink>
        </div>
      </div>

      <!-- Features Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div class="bg-white rounded-xl p-8 shadow-sm">
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a9.863 9.863 0 01-4.255-.949L5 20l1.395-3.72C7.512 15.042 9.201 13 12 13c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8c0 2.928 1.586 5.49 3.946 6.856"></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">Instant Answers</h3>
          <p class="text-gray-600">
            Get immediate responses to compliance questions powered by Claude AI, 
            with citations from official company policies.
          </p>
        </div>

        <div class="bg-white rounded-xl p-8 shadow-sm">
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">Always Accurate</h3>
          <p class="text-gray-600">
            Answers are based exclusively on your company's official policies, 
            ensuring consistency and accuracy across all responses.
          </p>
        </div>

        <div class="bg-white rounded-xl p-8 shadow-sm">
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">Full Audit Trail</h3>
          <p class="text-gray-600">
            Complete logging of all interactions for compliance auditing 
            and continuous improvement of the knowledge base.
          </p>
        </div>
      </div>

      <!-- Use Cases -->
      <div class="bg-white rounded-xl p-8 shadow-sm">
        <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">Common Use Cases</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-800">For Employees</h3>
            <ul class="space-y-2 text-gray-600">
              <li class="flex items-start">
                <span class="text-green-500 mr-2">✓</span>
                Quick answers to data sharing policies
              </li>
              <li class="flex items-start">
                <span class="text-green-500 mr-2">✓</span>
                Security incident reporting procedures
              </li>
              <li class="flex items-start">
                <span class="text-green-500 mr-2">✓</span>
                Privacy and confidentiality guidelines
              </li>
              <li class="flex items-start">
                <span class="text-green-500 mr-2">✓</span>
                Acceptable use policy clarifications
              </li>
            </ul>
          </div>
          
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-800">For Auditors & Compliance</h3>
            <ul class="space-y-2 text-gray-600">
              <li class="flex items-start">
                <span class="text-blue-500 mr-2">✓</span>
                Monitor compliance question trends
              </li>
              <li class="flex items-start">
                <span class="text-blue-500 mr-2">✓</span>
                Track policy engagement metrics
              </li>
              <li class="flex items-start">
                <span class="text-blue-500 mr-2">✓</span>
                Export audit logs and reports
              </li>
              <li class="flex items-start">
                <span class="text-blue-500 mr-2">✓</span>
                Identify knowledge gaps in policies
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false
})

const authStore = useAuthStore()

// Safely check if user is authenticated
const isAuthenticated = computed(() => {
  return authStore?.isAuthenticated || false
})
</script>