<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Upload Test Page</h1>
    <div class="flex space-x-3">
      <button
        @click="showUploadModal = true"
        class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
      >
        Upload PDF
      </button>
      <button
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
      >
        Add Document
      </button>
    </div>

    <div v-if="showUploadModal" class="mt-4 p-4 border border-gray-200 rounded">
      <h3 class="font-bold">Upload Modal is Working!</h3>
      <button @click="showUploadModal = false" class="mt-2 px-3 py-1 bg-gray-200 rounded">
        Close
      </button>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

const showUploadModal = ref(false)
</script>