<template>
  <div class="space-y-6">
    <div class="compliance-card">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
      
      <!-- Stats Overview -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-blue-50 rounded-lg p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a9.863 9.863 0 01-4.255-.949L5 20l1.395-3.72C7.512 15.042 9.201 13 12 13c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8c0 2.928 1.586 5.49 3.946 6.856"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Questions</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.totalQuestions?.toLocaleString() }}</p>
            </div>
          </div>
        </div>

        <div class="bg-green-50 rounded-lg p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Active Users</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.totalUsers }}</p>
            </div>
          </div>
        </div>

        <div class="bg-purple-50 rounded-lg p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Documents</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.totalDocuments }}</p>
            </div>
          </div>
        </div>

        <div class="bg-yellow-50 rounded-lg p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-yellow-600 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Avg Confidence</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.avgConfidence }}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Questions by Category -->
      <div class="compliance-card">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Questions by Category</h2>
        <div class="space-y-4">
          <div 
            v-for="category in stats.questionsByCategory" 
            :key="category.category"
            class="flex items-center"
          >
            <div class="flex-1">
              <div class="flex items-center justify-between mb-1">
                <span class="text-sm font-medium text-gray-700">{{ category.category }}</span>
                <span class="text-sm text-gray-600">{{ category.count }} ({{ category.percentage }}%)</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="bg-blue-600 h-2 rounded-full" 
                  :style="`width: ${category.percentage}%`"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Daily Usage -->
      <div class="compliance-card">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Daily Usage (Last 7 Days)</h2>
        <div class="space-y-3">
          <div 
            v-for="day in stats.dailyUsage" 
            :key="day.date"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <span class="text-sm font-medium text-gray-700">
              {{ formatDate(day.date) }}
            </span>
            <div class="flex items-center space-x-4 text-sm text-gray-600">
              <span>{{ day.questions }} questions</span>
              <span>{{ day.users }} users</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tables Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Top Questions -->
      <div class="compliance-card">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Most Frequent Questions</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr class="border-b border-gray-200">
                <th class="text-left py-2 text-xs font-medium text-gray-500 uppercase">Question</th>
                <th class="text-right py-2 text-xs font-medium text-gray-500 uppercase">Count</th>
                <th class="text-right py-2 text-xs font-medium text-gray-500 uppercase">Confidence</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="question in stats.topQuestions" :key="question.question">
                <td class="py-3 text-sm text-gray-900 max-w-xs truncate">
                  {{ question.question }}
                </td>
                <td class="py-3 text-sm text-gray-600 text-right">
                  {{ question.count }}
                </td>
                <td class="py-3 text-sm text-gray-600 text-right">
                  {{ question.avgConfidence }}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- User Distribution -->
      <div class="compliance-card">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Users by Role</h2>
        <div class="space-y-4">
          <div 
            v-for="role in stats.usersByRole" 
            :key="role.role"
            class="flex items-center"
          >
            <div class="flex-1">
              <div class="flex items-center justify-between mb-1">
                <span class="text-sm font-medium text-gray-700 capitalize">
                  {{ role.role.replace('_', ' ') }}
                </span>
                <span class="text-sm text-gray-600">{{ role.count }} ({{ role.percentage }}%)</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="h-2 rounded-full" 
                  :class="getRoleColor(role.role)"
                  :style="`width: ${role.percentage}%`"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Document Stats -->
    <div class="compliance-card">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Document Access Statistics</h2>
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead>
            <tr class="border-b border-gray-200">
              <th class="text-left py-3 text-xs font-medium text-gray-500 uppercase">Document</th>
              <th class="text-right py-3 text-xs font-medium text-gray-500 uppercase">Views</th>
              <th class="text-right py-3 text-xs font-medium text-gray-500 uppercase">Rating</th>
              <th class="text-right py-3 text-xs font-medium text-gray-500 uppercase">Last Updated</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="doc in stats.documentStats" :key="doc.document">
              <td class="py-4 text-sm text-gray-900">
                {{ doc.document }}
              </td>
              <td class="py-4 text-sm text-gray-600 text-right">
                {{ doc.views }}
              </td>
              <td class="py-4 text-sm text-gray-600 text-right">
                {{ doc.avgRating }}/5.0
              </td>
              <td class="py-4 text-sm text-gray-600 text-right">
                {{ formatDate(doc.lastUpdated) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const authStore = useAuthStore()

// Check admin permissions
if (!authStore.isAdmin && !authStore.isComplianceOfficer) {
  throw createError({
    statusCode: 403,
    statusMessage: 'Access Denied: Admin or Compliance Officer access required'
  })
}

const stats = ref<any>({})
const loading = ref(false)

const fetchStats = async () => {
  loading.value = true
  
  try {
    const { data } = await $fetch('/api/admin/stats')
    stats.value = data
  } catch (error) {
    console.error('Failed to fetch admin stats:', error)
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  })
}

const getRoleColor = (role) => {
  switch (role) {
    case 'admin': return 'bg-red-600'
    case 'compliance_officer': return 'bg-purple-600'
    case 'auditor': return 'bg-yellow-600'
    case 'employee': return 'bg-blue-600'
    default: return 'bg-gray-600'
  }
}

// Load stats on mount
onMounted(() => {
  fetchStats()
})
</script>