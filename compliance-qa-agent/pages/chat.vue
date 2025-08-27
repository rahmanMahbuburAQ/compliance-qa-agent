<template>
  <div class="max-w-4xl mx-auto">
    <div class="compliance-card">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Compliance Q&A</h1>
        <button 
          @click="chatStore.clearHistory()"
          class="text-sm text-gray-500 hover:text-gray-700"
        >
          Clear History
        </button>
      </div>

      <!-- Chat Messages -->
      <div 
        ref="chatContainer"
        class="h-96 overflow-y-auto mb-6 p-4 bg-gray-50 rounded-lg space-y-4"
      >
        <div v-if="chatStore.messages.length === 0" class="text-center text-gray-500 mt-16">
          <p>Ask me any compliance question!</p>
          <p class="text-sm mt-2">For example: "Can I share company files via Gmail?"</p>
        </div>

        <div 
          v-for="message in chatStore.messages" 
          :key="message.id"
          class="flex"
          :class="message.type === 'question' ? 'justify-end' : 'justify-start'"
        >
          <div 
            class="max-w-xs lg:max-w-md px-4 py-2 rounded-lg"
            :class="message.type === 'question' 
              ? 'bg-blue-600 text-white' 
              : 'bg-white border border-gray-200'"
          >
            <div class="text-sm">{{ message.content }}</div>
            
            <!-- Answer confidence and sources -->
            <div v-if="message.type === 'answer' && message.confidence" class="mt-3 pt-2 border-t border-gray-200">
              <div class="flex items-center justify-between text-xs text-gray-500">
                <span>Confidence: {{ message.confidence }}%</span>
                <span v-if="message.sources && message.sources.length > 0">
                  {{ message.sources.length }} source(s)
                </span>
              </div>
              
              <!-- Document sources -->
              <div v-if="message.sources && message.sources.length > 0" class="mt-2">
                <div class="text-xs font-medium text-gray-700 mb-1">Sources:</div>
                <div class="space-y-1">
                  <div 
                    v-for="source in message.sources" 
                    :key="source.id"
                    class="text-xs"
                  >
                    <button 
                      @click="viewDocument(source)"
                      class="text-blue-600 hover:text-blue-800 underline"
                    >
                      {{ source.title }} v{{ source.version }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="text-xs text-gray-400 mt-1">
              {{ formatTime(message.timestamp) }}
            </div>
          </div>
        </div>

        <!-- Loading indicator -->
        <div v-if="chatStore.isLoading" class="flex justify-start">
          <div class="bg-white border border-gray-200 max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
            <div class="flex items-center space-x-2">
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span class="text-sm text-gray-600">Analyzing compliance policies...</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Question Input -->
      <form @submit.prevent="submitQuestion" class="flex space-x-2">
        <input
          v-model="newQuestion"
          type="text"
          placeholder="Ask your compliance question..."
          class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          :disabled="chatStore.isLoading"
        />
        <button
          type="submit"
          :disabled="!newQuestion.trim() || chatStore.isLoading"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Ask
        </button>
      </form>

      <!-- Quick Questions -->
      <div class="mt-6">
        <h3 class="text-sm font-medium text-gray-700 mb-2">Common Questions:</h3>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="question in commonQuestions"
            :key="question"
            @click="askCommonQuestion(question)"
            class="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200"
            :disabled="chatStore.isLoading"
          >
            {{ question }}
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

const chatStore = useChatStore()
const documentsStore = useDocumentsStore()

const newQuestion = ref('')
const chatContainer = ref()

const commonQuestions = [
  'Can I use personal email for work files?',
  'How do I report a security incident?',
  'What are approved file sharing methods?',
  'How long do we keep customer data?',
  'Can I work with confidential data from home?'
]

const submitQuestion = async () => {
  if (!newQuestion.value.trim()) return
  
  await chatStore.askQuestion(newQuestion.value)
  newQuestion.value = ''
  
  // Scroll to bottom
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
}

const askCommonQuestion = (question) => {
  newQuestion.value = question
  submitQuestion()
}

const viewDocument = (document) => {
  // Open document in new tab or modal
  window.open(document.url, '_blank')
}

const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Auto-scroll to bottom when new messages arrive
watch(() => chatStore.messages.length, () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
})
</script>