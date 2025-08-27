<template>
  <div class="space-y-6">
    <div class="compliance-card">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Audit Logs</h1>
      
      <!-- Filters -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">User ID</label>
          <input
            v-model="filters.userId"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Filter by user ID"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Action</label>
          <select
            v-model="filters.action"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Actions</option>
            <option value="LOGIN">Login</option>
            <option value="ASK_QUESTION">Ask Question</option>
            <option value="VIEW_DOCUMENT">View Document</option>
            <option value="SEARCH_DOCUMENTS">Search Documents</option>
            <option value="ADMIN_ACCESS">Admin Access</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input
            v-model="filters.startDate"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <input
            v-model="filters.endDate"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div class="flex justify-between items-center mb-4">
        <button
          @click="applyFilters"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          :disabled="loading"
        >
          Apply Filters
        </button>
        
        <button
          @click="exportLogs"
          class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Export CSV
        </button>
      </div>

      <!-- Audit Logs Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Timestamp
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User ID
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Resource
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                IP Address
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="loading">
              <td colspan="5" class="px-6 py-4 text-center text-gray-500">
                Loading audit logs...
              </td>
            </tr>
            <tr v-else-if="logs.length === 0">
              <td colspan="5" class="px-6 py-4 text-center text-gray-500">
                No audit logs found matching your criteria.
              </td>
            </tr>
            <tr v-else v-for="log in logs" :key="log.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatTimestamp(log.timestamp) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <span class="font-mono">{{ log.userId }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="compliance-badge"
                  :class="getActionBadgeClass(log.action)"
                >
                  {{ log.action }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ log.resource }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ log.ipAddress }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalLogs > limit" class="mt-6 flex items-center justify-between">
        <div class="text-sm text-gray-700">
          Showing {{ offset + 1 }} to {{ Math.min(offset + limit, totalLogs) }} of {{ totalLogs }} results
        </div>
        
        <div class="flex space-x-2">
          <button
            @click="previousPage"
            :disabled="offset === 0"
            class="px-3 py-1 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            @click="nextPage"
            :disabled="offset + limit >= totalLogs"
            class="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

//import type { AuditLog } from '~/types'

const authStore = useAuthStore()

// Check permissions
if (!authStore.canAccessAudit) {
  throw createError({
    statusCode: 403,
    statusMessage: 'Access Denied: Auditor access required'
  })
}

const logs = ref([])
const loading = ref(false)
const totalLogs = ref(0)
const limit = ref(50)
const offset = ref(0)

const filters = ref({
  userId: '',
  action: '',
  startDate: '',
  endDate: ''
})

const fetchLogs = async () => {
  loading.value = true
  
  try {
    const params = new URLSearchParams({
      limit: limit.value.toString(),
      offset: offset.value.toString()
    })

    if (filters.value.userId) params.append('userId', filters.value.userId)
    if (filters.value.action) params.append('action', filters.value.action)
    if (filters.value.startDate) params.append('startDate', filters.value.startDate)
    if (filters.value.endDate) params.append('endDate', filters.value.endDate)

    const { data } = await $fetch<{
      logs
      // total: number
      // limit: number
      // offset: number
    }>(`/api/audit/logs?${params.toString()}`)

    logs.value = data.logs
    totalLogs.value = data.total
    
  } catch (error) {
    console.error('Failed to fetch audit logs:', error)
  } finally {
    loading.value = false
  }
}

const applyFilters = () => {
  offset.value = 0 // Reset to first page
  fetchLogs()
}

const previousPage = () => {
  if (offset.value > 0) {
    offset.value = Math.max(0, offset.value - limit.value)
    fetchLogs()
  }
}

const nextPage = () => {
  if (offset.value + limit.value < totalLogs.value) {
    offset.value += limit.value
    fetchLogs()
  }
}

const exportLogs = () => {
  // Simple CSV export - in production, this would be handled server-side
  const csvContent = [
    ['Timestamp', 'User ID', 'Action', 'Resource', 'IP Address'],
    ...logs.value.map(log => [
      formatTimestamp(log.timestamp),
      log.userId,
      log.action,
      log.resource,
      log.ipAddress
    ])
  ].map(row => row.join(',')).join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `audit_logs_${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  window.URL.revokeObjectURL(url)
}

const formatTimestamp = (timestamp) => {
  return new Date(timestamp).toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const getActionBadgeClass = (action) => {
  switch (action) {
    case 'LOGIN':
      return 'compliance-badge-success'
    case 'ADMIN_ACCESS':
      return 'compliance-badge-danger'
    case 'ASK_QUESTION':
    case 'VIEW_DOCUMENT':
    case 'SEARCH_DOCUMENTS':
      return 'compliance-badge-warning'
    default:
      return 'compliance-badge-success'
  }
}

// Load initial data
onMounted(() => {
  fetchLogs()
})
</script>