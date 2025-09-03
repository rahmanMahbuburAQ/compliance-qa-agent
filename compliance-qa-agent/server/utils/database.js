// MySQL Database Utilities
// This file provides database connection and query functions

let mysql2, pool;
let databaseAvailable = false;

async function getConnection() {
  if (!mysql2) {
    try {
      mysql2 = await import('mysql2/promise');
      databaseAvailable = true;
      console.log('MySQL2 module loaded successfully');
    } catch (error) {
      console.warn('MySQL2 not available. Using mock data fallback. To enable database: npm install mysql2');
      databaseAvailable = false;
      return null;
    }
  }

  if (!pool) {
    let databaseUrl;
    try {
      const config = useRuntimeConfig();
      databaseUrl = config.databaseUrl;
    } catch (error) {
      // Fallback to process.env when useRuntimeConfig is not available
      databaseUrl = process.env.DATABASE_URL;
    }
    
    if (!databaseUrl) {
      console.error('DATABASE_URL not configured in environment');
      databaseAvailable = false;
      return null;
    }

    try {
      // Parse DATABASE_URL: mysql://user:password@host:port/database
      const url = new URL(databaseUrl);
      
      console.log('Connecting to MySQL:', {
        host: url.hostname,
        port: url.port || 3306,
        user: url.username,
        database: url.pathname.slice(1)
      });
      
      pool = mysql2.createPool({
        host: url.hostname,
        port: url.port || 3306,
        user: url.username,
        password: url.password,
        database: url.pathname.slice(1), // Remove leading slash
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      });

      // Test connection
      const testConnection = await pool.getConnection();
      console.log('MySQL connection successful');
      testConnection.release();
      
    } catch (error) {
      console.error('Failed to create MySQL pool:', error);
      databaseAvailable = false;
      return null;
    }
  }

  return pool;
}

// Document CRUD operations
export async function getAllDocuments() {
  console.log('getAllDocuments called');
  
  const connection = await getConnection();
  
  if (!connection) {
    console.log('No database connection, using mock data');
    return getMockDocuments();
  }
  
  try {
    console.log('Executing database query for documents...');
    const [documents] = await connection.execute(`
      SELECT d.*, 
             JSON_ARRAYAGG(
               CASE 
                 WHEN s.id IS NOT NULL THEN
                   JSON_OBJECT(
                     'id', s.id,
                     'title', s.title,
                     'content', s.content,
                     'sectionNumber', s.section_number
                   )
                 ELSE NULL
               END
             ) as sections
      FROM compliance_documents d
      LEFT JOIN document_sections s ON d.id = s.document_id
      GROUP BY d.id, d.title, d.version, d.category, d.url, d.last_updated, d.created_at
      ORDER BY d.last_updated DESC
    `);

    console.log(`Found ${documents.length} documents in database`);

    return documents.map(doc => ({
      id: doc.id,
      title: doc.title,
      version: doc.version,
      category: doc.category,
      url: doc.url,
      lastUpdated: doc.last_updated,
      sections: doc.sections && doc.sections !== '[null]' && typeof doc.sections === 'string' ? JSON.parse(doc.sections).filter(s => s !== null) : []
    }));
  } catch (error) {
    console.error('Database query failed, using mock data:', error.message);
    console.error('Full error:', error);
    return getMockDocuments();
  }
}

export async function createDocument(document) {
  console.log('createDocument called for:', document.title);
  
  const connection = await getConnection();
  
  if (!connection) {
    console.log('No database connection, using mock data');
    if (mockDocuments === null) {
      getMockDocuments();
    }
    mockDocuments.push(document);
    return document;
  }
  
  // Get a connection from the pool for transaction
  const conn = await connection.getConnection();
  
  try {
    await conn.beginTransaction();
    console.log('Starting database transaction for document creation');

    // Insert document
    await conn.execute(`
      INSERT INTO compliance_documents (id, title, version, category, url, last_updated)
      VALUES (?, ?, ?, ?, ?, NOW())
    `, [
      document.id,
      document.title,
      document.version,
      document.category,
      document.url || `/documents/${document.id}.pdf`
    ]);

    console.log('Document inserted, now inserting sections...');

    // Insert sections
    if (document.sections && document.sections.length > 0) {
      for (const section of document.sections) {
        await conn.execute(`
          INSERT INTO document_sections (id, document_id, title, content, section_number)
          VALUES (?, ?, ?, ?, ?)
        `, [
          section.id || `${section.sectionNumber}_${Date.now()}`,
          document.id,
          section.title,
          section.content,
          section.sectionNumber
        ]);
      }
    }

    await conn.commit();
    console.log('Document created successfully in database');
    
    // Return the created document with updated timestamp
    return {
      ...document,
      lastUpdated: new Date(),
      url: document.url || `/documents/${document.id}.pdf`
    };
  } catch (error) {
    await conn.rollback();
    console.error('Failed to create document in database:', error);
    throw error;
  } finally {
    conn.release();
  }
}

export async function updateDocument(documentId, document) {
  console.log('updateDocument called for:', documentId);
  
  const connection = await getConnection();
  
  if (!connection) {
    console.log('No database connection, using mock data');
    if (mockDocuments === null) {
      getMockDocuments();
    }
    const index = mockDocuments.findIndex(doc => doc.id === documentId);
    if (index !== -1) {
      mockDocuments[index] = { ...document, id: documentId };
    }
    return { ...document, id: documentId };
  }
  
  // Get a connection from the pool for transaction
  const conn = await connection.getConnection();
  
  try {
    await conn.beginTransaction();
    console.log('Starting database transaction for document update');

    // Update document
    await conn.execute(`
      UPDATE compliance_documents 
      SET title = ?, version = ?, category = ?, url = ?, last_updated = NOW()
      WHERE id = ?
    `, [
      document.title,
      document.version,
      document.category,
      document.url || `/documents/${documentId}.pdf`,
      documentId
    ]);

    console.log('Document updated, now updating sections...');

    // Delete existing sections
    await conn.execute(`
      DELETE FROM document_sections WHERE document_id = ?
    `, [documentId]);

    // Insert new sections
    if (document.sections && document.sections.length > 0) {
      for (const section of document.sections) {
        await conn.execute(`
          INSERT INTO document_sections (id, document_id, title, content, section_number)
          VALUES (?, ?, ?, ?, ?)
        `, [
          section.id || `${section.sectionNumber}_${Date.now()}`,
          documentId,
          section.title,
          section.content,
          section.sectionNumber
        ]);
      }
    }

    await conn.commit();
    console.log('Document updated successfully in database');
    
    return {
      ...document,
      id: documentId,
      lastUpdated: new Date(),
      url: document.url || `/documents/${documentId}.pdf`
    };
  } catch (error) {
    await conn.rollback();
    console.error('Failed to update document in database:', error);
    throw error;
  } finally {
    conn.release();
  }
}

export async function deleteDocument(documentId) {
  console.log('deleteDocument called for:', documentId);
  
  const connection = await getConnection();
  
  if (!connection) {
    console.log('No database connection, using mock data');
    if (mockDocuments === null) {
      getMockDocuments();
    }
    const index = mockDocuments.findIndex(doc => doc.id === documentId);
    if (index !== -1) {
      mockDocuments.splice(index, 1);
      return true;
    }
    return false;
  }
  
  try {
    console.log('Deleting document from database...');
    
    // Sections will be deleted automatically due to CASCADE
    const [result] = await connection.execute(`
      DELETE FROM compliance_documents WHERE id = ?
    `, [documentId]);

    console.log(`Delete result: ${result.affectedRows} rows affected`);
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Failed to delete document from database:', error);
    throw error;
  }
}

// In-memory storage for mock data persistence
let mockDocuments = null;

// Mock data fallback
function getMockDocuments() {
  if (mockDocuments === null) {
    mockDocuments = [
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
  ];
  }
  return [...mockDocuments];
}