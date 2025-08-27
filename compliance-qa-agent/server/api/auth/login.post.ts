import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email } = body
  
  const config = useRuntimeConfig()
  
  try {
    // Mock Azure AD integration - replace with actual Azure AD SDK
    const mockUser = {
      id: 'user_' + Math.random().toString(36).substr(2, 9),
      email,
      name: email.split('@')[0],
      role: email.includes('admin') ? 'admin' : 
            email.includes('compliance') ? 'compliance_officer' :
            email.includes('audit') ? 'auditor' : 'employee',
      department: 'IT Security',
      lastLogin: new Date()
    }
    
    const token = jwt.sign(
      { userId: mockUser.id, email: mockUser.email, role: mockUser.role },
      config.authSecret,
      { expiresIn: '8h' }
    )
    
    setCookie(event, 'auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 8 // 8 hours
    })
    
    // Log authentication attempt
    await logAuditEvent(event, {
      userId: mockUser.id,
      action: 'LOGIN',
      resource: 'authentication',
      timestamp: new Date()
    })
    
    return {
      user: mockUser,
      token
    }
  } catch (error) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authentication failed'
    })
  }
})

async function logAuditEvent(event, logData) {
  try {
    // Simple audit logging for development
    const userAgent = getHeader(event, 'user-agent') || 'unknown'
    const xForwardedFor = getHeader(event, 'x-forwarded-for')
    const ipAddress = xForwardedFor ? xForwardedFor.split(',')[0].trim() : 'localhost'
    
    console.log('Audit Log:', {
      ...logData,
      ipAddress,
      userAgent
    })
  } catch (error) {
    console.error('Failed to log audit event:', error)
  }
}