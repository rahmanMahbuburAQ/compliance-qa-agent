# Compliance Q&A Agent

An enterprise-grade compliance Q&A system built with Nuxt 3, TypeScript, and Claude AI. This application helps employees get instant answers to compliance questions while maintaining full audit trails for corporate governance.

## Features

### 🤖 AI-Powered Q&A
- Powered by Claude AI for accurate, context-aware responses
- Answers based exclusively on company compliance documents
- Confidence scoring for answer reliability
- Document source citations for transparency

### 🔐 Enterprise Security
- SSO authentication (Azure AD/SAML ready)
- Role-based access control (Employee, Auditor, Compliance Officer, Admin)
- JWT-based session management
- Comprehensive audit logging

### 📊 Admin Dashboard
- Usage analytics and insights
- Question trend analysis
- Document engagement metrics
- User activity monitoring

### 📚 Document Management
- Centralized compliance document library
- Version control and categorization
- Search and filtering capabilities
- Access tracking for audit purposes

## Tech Stack

- **Frontend**: Nuxt 3, Vue 3, TypeScript
- **Styling**: Tailwind CSS, Nuxt UI
- **State Management**: Pinia
- **AI**: Anthropic Claude API
- **Authentication**: JWT, SSO-ready
- **Deployment**: Nuxt SSR/Static

## Quick Start

### Prerequisites
- Node.js 18+ 
- NPM or Yarn
- Anthropic API key

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Fill in your environment variables:
   ```env
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   AUTH_SECRET=your_32_character_secret_key
   AZURE_CLIENT_ID=your_azure_client_id
   AZURE_CLIENT_SECRET=your_azure_client_secret
   AZURE_TENANT_ID=your_azure_tenant_id
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Visit the application**:
   Open [http://localhost:3000](http://localhost:3000)

## Demo Accounts

For testing purposes, you can use these demo email addresses:

- `admin@company.com` - Admin access
- `compliance@company.com` - Compliance Officer access  
- `audit@company.com` - Auditor access
- `employee@company.com` - Employee access

## Usage Example

**Employee asks:**
> "Am I allowed to use personal Gmail to share work files?"

**Agent responds:**
> "According to Security Policy v2, Section 5.1, sharing work files via personal email is prohibited. Please use the company-approved SharePoint system."
> 
> → Shows doc link and confidence score

## Architecture

### Key Features
- **Authentication**: JWT-based with SSO integration hooks
- **AI Integration**: Claude API with document context injection
- **Audit System**: Comprehensive logging for compliance tracking
- **Document Store**: Structured compliance document management
- **Role System**: Granular permission controls

## Deployment

### Build for Production
```bash
npm run build
```

### Environment Setup
Ensure all production environment variables are configured:
- `ANTHROPIC_API_KEY`: Your Claude API key
- `AUTH_SECRET`: 32+ character secret for JWT signing
- `NODE_ENV=production`

## Security
- All user inputs are validated and sanitized
- AI responses are based only on approved document sources
- Complete audit trail for all user interactions
- Role-based access controls prevent unauthorized access
