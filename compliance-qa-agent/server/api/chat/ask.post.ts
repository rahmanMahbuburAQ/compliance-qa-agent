export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { question, userId } = body
  
  if (!question || !userId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Question and userId are required'
    })
  }

  try {
    // Get relevant compliance documents (mock data for now)
    const relevantDocs = await getRelevantDocuments(question)
    
    // Mock response for testing - replace with actual Anthropic API later
    const mockAnswer = generateMockAnswer(question, relevantDocs)
    
    // Calculate confidence based on document relevance
    const confidence = calculateConfidence(question, relevantDocs, mockAnswer)
    
    // Log the Q&A interaction for audit
    await logQAInteraction(event, {
      userId,
      question,
      answer: mockAnswer,
      confidence,
      sources: relevantDocs
    })

    return {
      answer: mockAnswer,
      confidence,
      sources: relevantDocs,
      timestamp: new Date().toISOString()
    }
    
  } catch (error) {
    console.error('Chat API Error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to process compliance question'
    })
  }
})

async function getRelevantDocuments(question) {
  // Mock compliance documents - replace with actual document retrieval
  const mockDocuments = [
    {
      id: 'sec_policy_v2',
      title: 'Security Policy',
      version: '2.1',
      category: 'Security',
      url: '/documents/security-policy-v2.pdf',
      lastUpdated: new Date('2024-01-15'),
      sections: [
        {
          id: '5.1',
          title: 'External File Sharing',
          content: 'Sharing work files via personal email accounts (Gmail, Yahoo, etc.) is strictly prohibited. All external file sharing must use company-approved platforms: SharePoint, OneDrive for Business, or secure file transfer systems.',
          sectionNumber: '5.1'
        },
        {
          id: '5.2',
          title: 'Approved Sharing Methods',
          content: 'Employees must use SharePoint for document collaboration and OneDrive for Business for external sharing with proper permissions and access controls.',
          sectionNumber: '5.2'
        }
      ]
    },
    {
      id: 'data_handling_v1',
      title: 'Data Handling Guidelines',
      version: '1.3',
      category: 'Data Protection',
      url: '/documents/data-handling-v1.pdf',
      lastUpdated: new Date('2024-02-01'),
      sections: [
        {
          id: '3.1',
          title: 'Classification Levels',
          content: 'All company data is classified as: Public, Internal, Confidential, or Restricted. Personal email cannot be used for Internal level and above.',
          sectionNumber: '3.1'
        }
      ]
    }
  ]
  
  // Simple keyword matching - replace with vector search or better matching
  return mockDocuments.filter(doc => 
    question.toLowerCase().includes('email') || 
    question.toLowerCase().includes('share') ||
    question.toLowerCase().includes('file')
  )
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
  
  if (lowerQuestion.includes('remote') || lowerQuestion.includes('work from home')) {
    return "Based on Acceptable Use Policy v3.0, Section 3.2, when working remotely, employees must ensure confidential data is accessed only through VPN connections and approved devices."
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