import { defineStore } from 'pinia'

export const useChatStore = defineStore('chat', () => {
  const messages = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  const addMessage = (message) => {
    const newMessage = {
      ...message,
      id: 'msg_' + Math.random().toString(36).substr(2, 9)
    }
    messages.value.push(newMessage)
    return newMessage
  }

  const askQuestion = async (question) => {
    if (!question.trim()) return

    error.value = null
    isLoading.value = true

    // Add user question
    addMessage({
      type: 'question',
      content: question,
      timestamp: new Date()
    })

    try {
      const response = await fetch('/api/chat/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          question,
          userId: useAuthStore().user?.id
        })
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()

      // Add AI response
      addMessage({
        type: 'answer',
        content: data.answer,
        timestamp: new Date(data.timestamp),
        sources: data.sources,
        confidence: data.confidence
      })

    } catch (err) {
      error.value = err.data?.message || 'Failed to get compliance answer'
      
      // Add error message
      addMessage({
        type: 'answer',
        content: 'I apologize, but I encountered an error while processing your question. Please try again or contact the compliance team for assistance.',
        timestamp: new Date(),
        confidence: 0
      })
    } finally {
      isLoading.value = false
    }
  }

  const clearHistory = () => {
    messages.value = []
  }

  const getConversationHistory = () => {
    return messages.value.map(msg => ({
      role: msg.type === 'question' ? 'user' : 'assistant',
      content: msg.content,
      timestamp: msg.timestamp
    }))
  }

  return {
    messages: readonly(messages),
    isLoading: readonly(isLoading),
    error: readonly(error),
    addMessage,
    askQuestion,
    clearHistory,
    getConversationHistory
  }
})