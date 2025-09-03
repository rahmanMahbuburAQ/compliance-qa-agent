# Compliance Q&A Agent

A comprehensive enterprise compliance management system with AI-powered Q&A capabilities, document management, and administrative tools.

## 🚀 Features Overview

### 🎯 Core Functionality
- **AI-Powered Q&A System** - Ask compliance questions and get intelligent answers
- **Document Management** - Upload, manage, and organize compliance documents
- **PDF Upload & Storage** - Complete file management with database integration
- **Role-Based Access Control** - Admin, Compliance Officer, Auditor, and Employee roles
- **Audit Logging** - Track all user activities and system access
- **Responsive Design** - Works on desktop, tablet, and mobile devices

---

## 📱 Screen-by-Screen Feature Guide

### 🔐 **Login Screen** (`/login`)
**File**: `pages/login.vue`

#### Functions:
- **User Authentication** - Email-based login with role detection
- **Role Assignment** - Automatic role assignment based on email patterns:
  - `admin@*` → Admin Role
  - `compliance@*` → Compliance Officer Role
  - `audit@*` → Auditor Role  
  - Others → Employee Role
- **Session Management** - JWT token generation and storage
- **Redirect Handling** - Post-login redirection to appropriate dashboard

#### API Endpoints:
- `POST /api/auth/login` - Authenticate user and generate JWT token

---

### 🏠 **Dashboard Screen** (`/dashboard`)
**File**: `pages/dashboard.vue`

#### Functions:
- **Welcome Interface** - User greeting and role display
- **Navigation Hub** - Quick access to all major features
- **Recent Activity** - Display of recent compliance activities
- **Role-Based Menu** - Different menu options based on user role

---

### 💬 **Chat/Q&A Screen** (`/chat`)
**File**: `pages/chat.vue`

#### Functions:
- **AI-Powered Q&A** - Ask compliance questions and get intelligent responses
- **Claude Integration** - Uses Anthropic Claude AI for response generation
- **Context-Aware Answers** - Responses based on uploaded compliance documents
- **Chat History** - Maintain conversation history during session
- **Real-time Processing** - Live response generation with loading indicators
- **Confidence Scoring** - AI confidence levels for each response

#### API Endpoints:
- `POST /api/chat/ask` - Submit questions and receive AI responses

---

### 📚 **Documents Screen** (`/documents`)
**File**: `pages/documents.vue`

#### Functions:
- **Document Viewing** - Browse all available compliance documents
- **Search & Filter** - Find documents by title, category, or content
- **Document Access** - Download and view PDF documents
- **Category Organization** - Organize by Security, Privacy, Data Protection, etc.
- **Version Tracking** - View document versions and update dates

#### API Endpoints:
- `GET /api/documents` - Retrieve all accessible documents

---

### 🛡️ **Admin Dashboard** (`/admin`)
**File**: `pages/admin.vue`

#### Functions:

#### **📊 Dashboard Tab**
- **Admin Statistics** - Total questions, users, documents, confidence metrics
- **Usage Analytics** - Questions by category with visual charts
- **Daily Usage Reports** - Last 7 days activity tracking
- **Top Questions** - Most frequently asked compliance questions
- **User Distribution** - Users by role with percentage breakdown
- **Document Statistics** - Document access stats, ratings, last updated

#### **📄 Manage Documents Tab**
- **Document CRUD Operations**:
  - **Create** - Add new documents with metadata and sections
  - **Read** - View all documents in searchable table format
  - **Update** - Edit existing documents and their sections
  - **Delete** - Remove documents with confirmation
- **PDF Upload System**:
  - **File Validation** - PDF-only uploads with 10MB size limit
  - **Metadata Entry** - Document ID, title, version, category
  - **Section Management** - Add/remove document sections with content
  - **File Storage** - Automatic file naming and storage in `public/documents/`
  - **Database Integration** - Full document records with relationships
- **Search & Filter** - Real-time document filtering by category and text search
- **Bulk Operations** - Multiple document management capabilities

#### **🧪 Test Upload Tab**
- **Upload Testing** - Test PDF upload functionality
- **Development Tools** - Testing interface for developers
- **Modal Testing** - Test upload modal behavior

#### API Endpoints:
- `GET /api/admin/stats` - Retrieve admin dashboard statistics
- `GET /api/admin/documents` - Get all documents for management
- `POST /api/admin/documents` - Create new document
- `POST /api/admin/documents/upload` - Upload PDF with metadata
- `PUT /api/admin/documents/{id}` - Update existing document
- `DELETE /api/admin/documents/{id}` - Delete document

---

### 📋 **Audit Screen** (`/audit`)
**File**: `pages/audit.vue`

#### Functions:
- **Activity Logging** - View all system activities and user actions
- **User Tracking** - Monitor user login/logout activities
- **Document Access Logs** - Track document views and downloads
- **Security Monitoring** - Monitor admin actions and data changes
- **Export Capabilities** - Export audit logs for compliance reporting

#### API Endpoints:
- `GET /api/audit/logs` - Retrieve system audit logs

---

### 📄 **Standalone Document Management** (`/admin/documents`)
**File**: `pages/admin/documents.vue`

#### Functions:
- **Full Document Management Interface** - Complete CRUD operations
- **Advanced Upload System** - Comprehensive PDF upload with metadata
- **Section Management** - Add/edit/remove document sections
- **Search & Filtering** - Advanced document discovery
- **Bulk Operations** - Manage multiple documents efficiently

---

## 🔧 Technical Architecture

### **Frontend Stack**
- **Framework**: Nuxt 4.0.3 with Vue 3.5.20
- **Styling**: Tailwind CSS with custom components
- **State Management**: Pinia for reactive state
- **Authentication**: JWT tokens with HTTP-only cookies
- **File Handling**: Native HTML5 File API with validation

### **Backend Stack**
- **Runtime**: Node.js with Nitro server
- **API**: RESTful endpoints with Nuxt server routes
- **Database**: MySQL with fallback to mock data
- **File Storage**: Local file system in `public/documents/`
- **AI Integration**: Anthropic Claude API
- **Authentication**: JWT with role-based middleware

### **Database Schema**
```sql
-- Main documents table
compliance_documents (
  id VARCHAR PRIMARY KEY,
  title VARCHAR NOT NULL,
  version VARCHAR NOT NULL,
  category VARCHAR NOT NULL,
  url VARCHAR,
  last_updated TIMESTAMP,
  created_at TIMESTAMP
)

-- Document sections table  
document_sections (
  id VARCHAR PRIMARY KEY,
  document_id VARCHAR REFERENCES compliance_documents(id),
  title VARCHAR NOT NULL,
  content TEXT NOT NULL,
  section_number VARCHAR NOT NULL
)
```

### **File Storage Structure**
```
public/documents/
├── {documentId}_v{version}_{timestamp}.pdf
├── security-policy-v2.pdf
├── data-handling-v1.pdf
└── privacy-policy-v3.pdf
```

---

## 🛠️ Setup Instructions

### **Prerequisites**
- Node.js 18+ 
- npm or yarn
- MySQL database (optional - has mock data fallback)

### **Installation**

1. **Clone Repository**
```bash
git clone https://github.com/rahmanMahbuburAQ/compliance-qa-agent.git
cd compliance-qa-agent
```

2. **Install Dependencies**
```bash
npm install
```

3. **Environment Configuration**
Create `.env` file:
```env
# AI Configuration
ANTHROPIC_API_KEY=your_claude_api_key

# Authentication
AUTH_SECRET=your_jwt_secret_key

# Database (Optional)
DATABASE_URL=mysql://user:password@host:port/database

# Azure AD (Future Integration)
AZURE_CLIENT_ID=your_azure_client_id
AZURE_CLIENT_SECRET=your_azure_client_secret
AZURE_TENANT_ID=your_azure_tenant_id
```

4. **Database Setup** (Optional)
```bash
# Create MySQL database and tables
# Or use mock data fallback (no setup required)
```

5. **Run Development Server**
```bash
npm run dev
```

### **Production Deployment**
```bash
npm run build
npm run preview
```

---

## 👤 User Roles & Permissions

### **🔴 Admin**
- Full system access
- User management
- Document CRUD operations
- System configuration
- Audit log access

### **🟡 Compliance Officer**
- Document management
- Audit capabilities
- Q&A system access
- Compliance reporting

### **🟢 Auditor**
- Audit log access
- Document viewing
- Q&A system access
- Report generation

### **🔵 Employee**
- Q&A system access
- Document viewing
- Basic dashboard access

---

## 🔐 Authentication Flow

1. **Login** - Email-based authentication
2. **Role Detection** - Automatic role assignment by email pattern
3. **JWT Generation** - Secure token with user data and permissions
4. **Session Storage** - HTTP-only cookies for security
5. **Route Protection** - Middleware-based access control
6. **Auto-refresh** - Token refresh handling

---

## 📊 API Documentation

### **Authentication Endpoints**
- `POST /api/auth/login` - User login with email
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/logout` - User logout

### **Document Management Endpoints**
- `GET /api/documents` - Public document access
- `GET /api/admin/documents` - Admin document list
- `POST /api/admin/documents` - Create document
- `POST /api/admin/documents/upload` - Upload PDF with metadata
- `PUT /api/admin/documents/{id}` - Update document
- `DELETE /api/admin/documents/{id}` - Delete document

### **AI Chat Endpoints**
- `POST /api/chat/ask` - Submit question to AI system

### **Analytics Endpoints**
- `GET /api/admin/stats` - Admin dashboard statistics
- `GET /api/audit/logs` - System audit logs

---

## 🧪 Testing

### **User Testing Accounts**
- **Admin**: `admin@test.com`
- **Compliance**: `compliance@test.com`
- **Auditor**: `audit@test.com`
- **Employee**: `user@test.com`

### **Test Scenarios**
1. **Document Upload**: Upload PDF → Verify database storage → Test download
2. **Role Access**: Test role-based screen access
3. **Q&A System**: Ask questions → Verify AI responses
4. **CRUD Operations**: Create/Read/Update/Delete documents
5. **Search & Filter**: Test document discovery features

---

## 📈 Performance & Scalability

### **Optimization Features**
- **Lazy Loading** - Pages load on demand
- **File Size Limits** - 10MB PDF upload limit
- **Database Indexing** - Optimized queries
- **Caching Strategy** - Static file caching
- **Responsive Design** - Mobile-optimized interface

### **Scalability Considerations**
- **Database Connection Pooling** - MySQL connection management
- **File Storage** - Expandable to cloud storage (AWS S3, etc.)
- **Load Balancing** - Nuxt SSR/SPA capabilities
- **CDN Ready** - Static asset distribution

---

## 🔒 Security Features

### **Data Protection**
- **JWT Authentication** - Secure token-based auth
- **Role-Based Access** - Granular permission system
- **Input Validation** - Server-side data validation
- **File Validation** - PDF-only uploads with size limits
- **SQL Injection Prevention** - Parameterized queries
- **XSS Protection** - Content sanitization

### **Audit & Compliance**
- **Activity Logging** - All user actions tracked
- **Access Control** - Role-based feature access
- **Data Retention** - Configurable retention policies
- **Secure File Storage** - Protected document access

---

## 🚀 Deployment Options

### **Development**
```bash
npm run dev  # http://localhost:3000
```

### **Production Build**
```bash
npm run build
npm run preview
```

### **Docker Deployment**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

### **Cloud Deployment**
- **Vercel** - Automatic Nuxt deployment
- **Netlify** - JAMstack deployment
- **AWS/Azure** - Enterprise cloud hosting
- **Docker Containers** - Containerized deployment

---

## 🤝 Contributing

### **Development Workflow**
1. Fork repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request
5. Code review process

### **Coding Standards**
- **Vue 3 Composition API** - Modern Vue development
- **TypeScript Support** - Type-safe development
- **ESLint Configuration** - Code quality enforcement
- **Git Commit Standards** - Conventional commit messages

---

## 📚 Additional Resources

### **Documentation Links**
- [Nuxt 3 Documentation](https://nuxt.com/)
- [Vue 3 Documentation](https://vuejs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Anthropic Claude API](https://docs.anthropic.com/)

### **Support & Contact**
- **GitHub Issues** - Bug reports and feature requests
- **Wiki** - Additional documentation
- **Discussions** - Community support

---

## 📄 License

This project is licensed under the MIT License. See LICENSE file for details.

---

## 🎯 Roadmap

### **Planned Features**
- [ ] **Salesforce Integration** - CRM data synchronization
- [ ] **Advanced Analytics** - Detailed usage metrics
- [ ] **Multi-language Support** - Internationalization
- [ ] **Advanced Search** - Full-text document search
- [ ] **Workflow Management** - Approval processes
- [ ] **Email Notifications** - System alerts and updates
- [ ] **Mobile App** - Native mobile applications
- [ ] **API Documentation** - Interactive API docs

### **Technical Improvements**
- [ ] **Unit Testing** - Comprehensive test coverage
- [ ] **Performance Monitoring** - Application performance tracking
- [ ] **Error Tracking** - Centralized error logging
- [ ] **Database Migrations** - Schema version management
- [ ] **Backup System** - Automated data backups

---

**Built with ❤️ using Nuxt, Vue, and Anthropic Claude**

*Last Updated: $(date '+%B %d, %Y')*