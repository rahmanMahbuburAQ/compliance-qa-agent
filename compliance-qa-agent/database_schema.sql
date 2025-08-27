-- MySQL Database Schema for Compliance Q&A Agent
-- Run this script in your MySQL database: compliance_qa_local

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role ENUM('employee', 'auditor', 'compliance_officer', 'admin') NOT NULL DEFAULT 'employee',
    department VARCHAR(255),
    last_login DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Compliance documents table
CREATE TABLE IF NOT EXISTS compliance_documents (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    version VARCHAR(50) NOT NULL,
    category VARCHAR(100) NOT NULL,
    url VARCHAR(1000),
    last_updated DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Document sections table
CREATE TABLE IF NOT EXISTS document_sections (
    id VARCHAR(36) PRIMARY KEY,
    document_id VARCHAR(36) NOT NULL,
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    section_number VARCHAR(50) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (document_id) REFERENCES compliance_documents(id) ON DELETE CASCADE
);

-- Questions table
CREATE TABLE IF NOT EXISTS questions (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    content TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    category VARCHAR(100),
    urgency ENUM('low', 'medium', 'high') NOT NULL DEFAULT 'medium',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Answers table
CREATE TABLE IF NOT EXISTS answers (
    id VARCHAR(36) PRIMARY KEY,
    question_id VARCHAR(36) NOT NULL,
    content TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    confidence INT DEFAULT 0,
    reviewed_by VARCHAR(36),
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Answer sources (many-to-many relationship between answers and documents)
CREATE TABLE IF NOT EXISTS answer_sources (
    id VARCHAR(36) PRIMARY KEY,
    answer_id VARCHAR(36) NOT NULL,
    document_id VARCHAR(36) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (answer_id) REFERENCES answers(id) ON DELETE CASCADE,
    FOREIGN KEY (document_id) REFERENCES compliance_documents(id) ON DELETE CASCADE,
    UNIQUE KEY unique_answer_document (answer_id, document_id)
);

-- Chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    type ENUM('question', 'answer') NOT NULL,
    content TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    confidence INT,
    question_id VARCHAR(36),
    answer_id VARCHAR(36),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
    FOREIGN KEY (answer_id) REFERENCES answers(id) ON DELETE CASCADE
);

-- Audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    action VARCHAR(255) NOT NULL,
    resource VARCHAR(255) NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert some sample data for development
INSERT IGNORE INTO users (id, email, name, role, department) VALUES
('admin-001', 'admin@company.com', 'Admin User', 'admin', 'IT'),
('comp-001', 'compliance@company.com', 'Compliance Officer', 'compliance_officer', 'Legal'),
('audit-001', 'audit@company.com', 'Auditor User', 'auditor', 'Audit'),
('emp-001', 'employee@company.com', 'Employee User', 'employee', 'HR');

-- Insert sample compliance documents
INSERT IGNORE INTO compliance_documents (id, title, version, category, url, last_updated) VALUES
('doc-001', 'Data Sharing Policy', '2.1', 'Data Protection', '/documents/data-sharing-policy.pdf', '2024-01-15 00:00:00'),
('doc-002', 'Security Incident Response', '1.5', 'Security', '/documents/security-incident-response.pdf', '2024-02-20 00:00:00'),
('doc-003', 'Acceptable Use Policy', '3.0', 'IT Policies', '/documents/acceptable-use-policy.pdf', '2024-03-10 00:00:00');

-- Insert sample document sections
INSERT IGNORE INTO document_sections (id, document_id, title, content, section_number) VALUES
('sec-001', 'doc-001', 'Email Sharing Guidelines', 'Personal email accounts should not be used for sharing company confidential data. Use approved corporate communication channels only.', '2.1'),
('sec-002', 'doc-002', 'Incident Reporting', 'All security incidents must be reported within 2 hours to the security team via the incident portal or emergency hotline.', '1.1'),
('sec-003', 'doc-003', 'Remote Work Guidelines', 'When working remotely, employees must ensure confidential data is accessed only through VPN connections and approved devices.', '3.2');

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_questions_user_id ON questions(user_id);
CREATE INDEX idx_questions_timestamp ON questions(timestamp);
CREATE INDEX idx_answers_question_id ON answers(question_id);
CREATE INDEX idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX idx_chat_messages_timestamp ON chat_messages(timestamp);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp);
CREATE INDEX idx_document_sections_document_id ON document_sections(document_id);