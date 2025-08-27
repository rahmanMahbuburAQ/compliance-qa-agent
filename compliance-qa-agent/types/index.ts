export interface User {
  id: string
  email: string
  name: string
  role: 'employee' | 'auditor' | 'compliance_officer' | 'admin'
  department?: string
  lastLogin?: Date
}

export interface ComplianceDocument {
  id: string
  title: string
  version: string
  category: string
  url: string
  lastUpdated: Date
  sections: DocumentSection[]
}

export interface DocumentSection {
  id: string
  title: string
  content: string
  sectionNumber: string
}

export interface Question {
  id: string
  userId: string
  content: string
  timestamp: Date
  category?: string
  urgency: 'low' | 'medium' | 'high'
}

export interface Answer {
  id: string
  questionId: string
  content: string
  timestamp: Date
  sources: ComplianceDocument[]
  confidence: number
  reviewedBy?: string
}

export interface AuditLog {
  id: string
  userId: string
  action: string
  resource: string
  timestamp: Date
  ipAddress?: string
  userAgent?: string
}

export interface ChatMessage {
  id: string
  type: 'question' | 'answer'
  content: string
  timestamp: Date
  sources?: ComplianceDocument[]
  confidence?: number
}