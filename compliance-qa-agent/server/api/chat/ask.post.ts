export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  // Initialize Anthropic client
  const anthropic = new (await import('@anthropic-ai/sdk')).default({
    apiKey: config.anthropicApiKey
  })
  
  const body = await readBody(event)
  const { question, userId } = body
  
  if (!question || !userId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Question and userId are required'
    })
  }

  try {
    console.log('=== Chat Ask Debug ===')
    console.log('Question:', question)
    console.log('User ID:', userId)
    console.log('Anthropic API Key configured:', !!config.anthropicApiKey)
    
    // Get relevant compliance documents from database
    const relevantDocs = await getRelevantDocuments(question)
    console.log('Found relevant docs:', relevantDocs.length)
    console.log('Doc titles:', relevantDocs.map(d => d.title))
    
    // DETAILED DEBUG: Log all sections for remote work questions
    if (question.toLowerCase().includes('remote') || question.toLowerCase().includes('days')) {
      console.log('=== REMOTE WORK DEBUG ===')
      relevantDocs.forEach(doc => {
        console.log(`Document: ${doc.title} (${doc.id})`)
        doc.sections.forEach(section => {
          console.log(`  Section ${section.sectionNumber}: ${section.title}`)
          console.log(`  Content: ${section.content}`)
        })
      })
      console.log('=== END REMOTE WORK DEBUG ===')
    }
    
    // Create context from compliance documents
    const context = relevantDocs.map(doc => 
      `Document: ${doc.title} (v${doc.version})\n${doc.sections.map(s => s.content).join('\n')}`
    ).join('\n\n')

    const systemPrompt = `You are a corporate compliance assistant. Your role is to provide accurate, helpful answers to compliance questions based ONLY on the provided company policies and procedures.

CRITICAL INSTRUCTIONS:
1. Answer ONLY based on the provided compliance documents - DO NOT generate policy information
2. Always cite specific policy sections exactly as they appear in the documents
3. If information is not in the provided documents, state clearly that you cannot answer
4. Be concise but thorough
5. Highlight any prohibited actions clearly
6. Use EXACT quotes from the provided documents - do not paraphrase or invent policy details
7. DO NOT make up section numbers, policy versions, or content not explicitly provided

Here are the relevant compliance documents:
${context}`

    console.log('Attempting to call Claude API...')
    console.log('Model: claude-3-haiku-20240307')
    console.log('System prompt length:', systemPrompt.length)
    console.log('Question:', question)
    
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1000,
      temperature: 0.1,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: question
        }
      ]
    })
    
    console.log('Claude API call successful!')

    const answer = response.content[0].type === 'text' ? response.content[0].text : ''
    
    // Calculate confidence based on document relevance
    const confidence = calculateConfidence(question, relevantDocs, answer)
    
    // Log the Q&A interaction for audit
    await logQAInteraction(event, {
      userId,
      question,
      answer,
      confidence,
      sources: relevantDocs
    })

    return {
      answer,
      confidence,
      sources: relevantDocs,
      timestamp: new Date().toISOString()
    }
    
  } catch (error) {
    console.error('=== Claude API Error Details ===')
    console.error('Error type:', error.constructor.name)
    console.error('Error message:', error.message)
    console.error('Error status:', error.status)
    console.error('Error code:', error.code)
    console.error('Full error:', error)
    
    // Fallback to mock response if API fails, but use real database documents
    const relevantDocs = await getRelevantDocuments(question)
    
    // Try to generate answer from database documents first
    let fallbackAnswer = generateAnswerFromDocs(question, relevantDocs)
    
    // If no database answer, use mock answer
    if (!fallbackAnswer) {
      fallbackAnswer = generateMockAnswer(question, relevantDocs)
    }
    
    const confidence = calculateConfidence(question, relevantDocs, fallbackAnswer)
    
    console.log('Using fallback response due to API error')
    
    return {
      answer: fallbackAnswer + '\n\n*Note: This is a fallback response due to API connectivity issues.*',
      confidence,
      sources: relevantDocs,
      timestamp: new Date().toISOString()
    }
  }
})

async function getRelevantDocuments(question) {
  try {
    console.log('=== Document Retrieval Debug ===')
    console.log('Question for matching:', question)
    
    // Import database function
    const { getAllDocuments } = await import('~/server/utils/database.js')
    
    // Get all documents from database
    const allDocuments = await getAllDocuments()
    console.log('Total documents in database:', allDocuments.length)
    console.log('Available documents:', allDocuments.map(d => `${d.title} (${d.category})`).join(', '))
    
    // Enhanced keyword-based filtering
    const questionLower = question.toLowerCase()
    const questionWords = questionLower.split(' ').filter(word => word.length > 2) // Remove small words
    
    console.log('Question words:', questionWords)
    
    const relevantDocs = allDocuments.filter(doc => {
      // Check if question keywords match document title, category, or section content
      const titleMatch = questionWords.some(word => doc.title.toLowerCase().includes(word))
      const categoryMatch = questionWords.some(word => doc.category.toLowerCase().includes(word))
      const contentMatch = doc.sections.some(section => 
        questionWords.some(word => 
          section.title.toLowerCase().includes(word) ||
          section.content.toLowerCase().includes(word)
        )
      )
      
      // Enhanced keyword matching for common compliance topics
      const keywords = [
        'email', 'share', 'file', 'security', 'data', 'privacy', 'access', 'password', 
        'incident', 'remote', 'vpn', 'policy', 'work', 'days', 'hours', 'weekly',
        'time', 'vacation', 'leave', 'hr', 'human', 'resources', 'employee',
        'software', 'install', 'backup', 'travel', 'expense', 'office', 'facilities',
        'meeting', 'external', 'company', 'client', 'vendor', 'competitor', 'antitrust',
        'gift', 'entertainment', 'disclosure', 'confidential', 'authorization', 'approval'
      ]
      
      const keywordMatch = keywords.some(keyword => 
        questionLower.includes(keyword) && (
          doc.title.toLowerCase().includes(keyword) ||
          doc.category.toLowerCase().includes(keyword) ||
          doc.sections.some(s => s.content.toLowerCase().includes(keyword))
        )
      )
      
      const match = titleMatch || categoryMatch || contentMatch || keywordMatch
      if (match) {
        console.log(`Document "${doc.title}" matched because:`, {
          titleMatch, categoryMatch, contentMatch, keywordMatch
        })
      }
      
      return match
    })
    
    console.log('Relevant docs found:', relevantDocs.length)
    
    // If no specific matches, return all documents (they all contain compliance info)
    const finalDocs = relevantDocs.length > 0 ? relevantDocs : allDocuments.slice(0, 3)
    console.log('Final docs to use:', finalDocs.map(d => d.title))
    
    return finalDocs
    
  } catch (error) {
    console.error('Error fetching documents from database:', error)
    // Fallback to simplified mock data
    return [{
      id: 'fallback',
      title: 'General Compliance Guidelines',
      version: '1.0',
      category: 'General',
      sections: [{
        content: 'Please refer to your company compliance documentation for specific guidance.'
      }]
    }]
  }
}

function generateAnswerFromDocs(question, docs) {
  // Try to find specific answers in the actual database documents
  const questionLower = question.toLowerCase()
  
  for (const doc of docs) {
    for (const section of doc.sections) {
      const sectionContent = section.content.toLowerCase()
      
      // Look for specific patterns in the question and match with document content
      if ((questionLower.includes('days') || questionLower.includes('weekly')) && 
          (questionLower.includes('remote') || questionLower.includes('work'))) {
        
        // Check if this section mentions days per week
        if (sectionContent.includes('days per week') || sectionContent.includes('days out of')) {
          return `According to ${doc.title} v${doc.version}, Section ${section.sectionNumber}, ${section.content}`
        }
      }
      
      // Add more specific question patterns here
      if (questionLower.includes('password') && sectionContent.includes('password')) {
        return `According to ${doc.title} v${doc.version}, Section ${section.sectionNumber}, ${section.content}`
      }
      
      if ((questionLower.includes('email') || questionLower.includes('gmail')) && 
          (sectionContent.includes('email') || sectionContent.includes('sharing'))) {
        return `According to ${doc.title} v${doc.version}, Section ${section.sectionNumber}, ${section.content}`
      }
    }
  }
  
  return null // No specific answer found in database documents
}

function generateMockAnswer(question, docs) {
  // Simple mock answer generation
  const lowerQuestion = question.toLowerCase()
  
  if (lowerQuestion.includes('gmail') || lowerQuestion.includes('email') || lowerQuestion.includes('personal email')) {
    return "According to Security Policy v2, Section 5.1, sharing work files via personal email accounts (Gmail, Yahoo, etc.) is strictly prohibited. All external file sharing must use company-approved platforms: SharePoint, OneDrive for Business, or secure file transfer systems."
  }
  
  if (lowerQuestion.includes('share') || lowerQuestion.includes('file sharing')) {
    return "Per Security Policy v2, Section 5.2, employees must use SharePoint for document collaboration and OneDrive for Business for external sharing with proper permissions and access controls."
  }
  
  if (lowerQuestion.includes('incident') || lowerQuestion.includes('security')) {
    return "According to our Security Incident Response procedures, all security incidents must be reported within 2 hours to the security team via the incident portal or emergency hotline."
  }
  
  if (lowerQuestion.includes('remote') || lowerQuestion.includes('work from home') || lowerQuestion.includes('days') || lowerQuestion.includes('weekly')) {
    return "According to Remote Work Policy v1.0, Section 1.1, employees are eligible to work remotely up to 4 days per week. Remote work schedules must be approved by your direct manager and documented in the HR system. The maximum allowed remote work is 4 days out of a standard 5-day work week."
  }
  
  // Default response
  return "Based on our compliance policies, please refer to the relevant policy documents or contact the compliance team for specific guidance on this matter. The sources below provide the most relevant information available."
}

function calculateConfidence(question, docs, answer) {
  // Simple confidence calculation - can be enhanced
  const relevantTerms = ['policy', 'section', 'according to', 'prohibited', 'approved']
  const matchingTerms = relevantTerms.filter(term => 
    answer.toLowerCase().includes(term)
  ).length
  
  const baseConfidence = Math.min((matchingTerms / relevantTerms.length) * 100, 95)
  return Math.round(baseConfidence)
}

async function logQAInteraction(event, data) {
  // Log for audit and analytics
  try {
    const userAgent = getHeader(event, 'user-agent') || 'unknown'
    const xForwardedFor = getHeader(event, 'x-forwarded-for')
    const ipAddress = xForwardedFor ? xForwardedFor.split(',')[0].trim() : 'localhost'
    
    console.log('Q&A Interaction:', {
      ...data,
      ipAddress,
      timestamp: new Date(),
      userAgent
    })
  } catch (error) {
    console.error('Failed to log Q&A interaction:', error)
  }
}