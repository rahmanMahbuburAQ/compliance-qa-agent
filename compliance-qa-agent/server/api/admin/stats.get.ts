export default defineEventHandler(async (event) => {
  try {
    // Mock analytics data - replace with actual database queries
    const stats = {
      totalQuestions: 1247,
      totalUsers: 156,
      totalDocuments: 24,
      avgConfidence: 87.3,
      
      // Questions by category (last 30 days)
      questionsByCategory: [
        { category: 'Security', count: 45, percentage: 36.2 },
        { category: 'Data Protection', count: 32, percentage: 25.8 },
        { category: 'Privacy', count: 28, percentage: 22.6 },
        { category: 'Compliance', count: 19, percentage: 15.4 }
      ],
      
      // Usage over time (last 7 days)
      dailyUsage: [
        { date: '2024-08-20', questions: 23, users: 18 },
        { date: '2024-08-21', questions: 31, users: 24 },
        { date: '2024-08-22', questions: 28, users: 22 },
        { date: '2024-08-23', questions: 35, users: 28 },
        { date: '2024-08-24', questions: 22, users: 19 },
        { date: '2024-08-25', questions: 29, users: 23 },
        { date: '2024-08-26', questions: 18, users: 15 }
      ],
      
      // Top questions (most frequent)
      topQuestions: [
        {
          question: 'Can I share work files via personal email?',
          count: 89,
          avgConfidence: 95.2
        },
        {
          question: 'How do I report a security incident?',
          count: 67,
          avgConfidence: 91.8
        },
        {
          question: 'What are approved file sharing methods?',
          count: 54,
          avgConfidence: 93.1
        },
        {
          question: 'How long do we keep customer data?',
          count: 42,
          avgConfidence: 88.5
        }
      ],
      
      // User activity by role
      usersByRole: [
        { role: 'employee', count: 128, percentage: 82.1 },
        { role: 'auditor', count: 12, percentage: 7.7 },
        { role: 'compliance_officer', count: 8, percentage: 5.1 },
        { role: 'admin', count: 8, percentage: 5.1 }
      ],
      
      // Document access stats
      documentStats: [
        { 
          document: 'Security Policy v2.1', 
          views: 245, 
          avgRating: 4.7,
          lastUpdated: '2024-01-15'
        },
        { 
          document: 'Data Handling Guidelines v1.3', 
          views: 198, 
          avgRating: 4.5,
          lastUpdated: '2024-02-01'
        },
        { 
          document: 'Privacy Policy v3.0', 
          views: 156, 
          avgRating: 4.3,
          lastUpdated: '2024-03-10'
        }
      ]
    }

    return stats
    
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch admin statistics'
    })
  }
})