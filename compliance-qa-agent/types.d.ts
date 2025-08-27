declare interface User {
  id: string
  email: string
  name: string
  role: 'employee' | 'auditor' | 'compliance_officer' | 'admin'
  department?: string
  lastLogin?: Date
}

declare interface ComplianceDocument {
  id: string
  title: string
  version: string
  category: string
  url: string
  lastUpdated: Date
  sections: DocumentSection[]
}

declare interface DocumentSection {
  id: string
  title: string
  content: string
  sectionNumber: string
}

declare interface ChatMessage {
  id: string
  type: 'question' | 'answer'
  content: string
  timestamp: Date
  sources?: ComplianceDocument[]
  confidence?: number
}