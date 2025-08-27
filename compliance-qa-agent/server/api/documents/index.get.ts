
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { category, search } = query

  try {
    // Mock document database - replace with actual database queries
    const allDocuments: ComplianceDocument[] = [
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
          },
          {
            id: '3.2',
            title: 'Access Controls',
            content: 'Access to confidential and restricted data requires explicit authorization and must be logged for audit purposes.',
            sectionNumber: '3.2'
          }
        ]
      },
      {
        id: 'privacy_policy_v3',
        title: 'Privacy Policy',
        version: '3.0',
        category: 'Privacy',
        url: '/documents/privacy-policy-v3.pdf',
        lastUpdated: new Date('2024-03-10'),
        sections: [
          {
            id: '2.1',
            title: 'Personal Data Collection',
            content: 'Collection of personal data must have a lawful basis and be clearly communicated to data subjects.',
            sectionNumber: '2.1'
          },
          {
            id: '2.2',
            title: 'Data Retention',
            content: 'Personal data should not be kept longer than necessary for the purposes for which it was collected.',
            sectionNumber: '2.2'
          }
        ]
      },
      {
        id: 'incident_response_v1',
        title: 'Incident Response Procedures',
        version: '1.2',
        category: 'Security',
        url: '/documents/incident-response-v1.pdf',
        lastUpdated: new Date('2024-01-20'),
        sections: [
          {
            id: '4.1',
            title: 'Incident Classification',
            content: 'Security incidents are classified as Low, Medium, High, or Critical based on potential impact.',
            sectionNumber: '4.1'
          },
          {
            id: '4.2',
            title: 'Reporting Timeline',
            content: 'Critical incidents must be reported within 1 hour, High within 4 hours, Medium within 24 hours.',
            sectionNumber: '4.2'
          }
        ]
      }
    ]

    let filteredDocuments = allDocuments

    // Filter by category
    if (category && category !== 'all') {
      filteredDocuments = filteredDocuments.filter(doc => 
        doc.category.toLowerCase() === (category as string).toLowerCase()
      )
    }

    // Filter by search term
    if (search) {
      const searchTerm = (search as string).toLowerCase()
      filteredDocuments = filteredDocuments.filter(doc =>
        doc.title.toLowerCase().includes(searchTerm) ||
        doc.sections.some(section =>
          section.title.toLowerCase().includes(searchTerm) ||
          section.content.toLowerCase().includes(searchTerm)
        )
      )
    }

    // Sort by last updated (newest first)
    filteredDocuments.sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime())

    return {
      documents: filteredDocuments,
      total: filteredDocuments.length
    }

  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch compliance documents'
    })
  }
})