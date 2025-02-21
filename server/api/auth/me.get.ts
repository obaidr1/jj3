import { defineEventHandler, createError, getHeaders } from 'h3'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export default defineEventHandler(async (event) => {
  try {
    const headers = getHeaders(event)
    const authHeader = headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError({
        statusCode: 401,
        message: 'No token provided'
      })
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string
      email: string
      role: string
    }

    // TODO: Replace with actual database query
    // This is a mock implementation
    return {
      user: {
        id: decoded.id,
        email: decoded.email,
        name: 'Test User',
        role: decoded.role,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    }
  } catch (error) {
    throw createError({
      statusCode: 401,
      message: 'Invalid or expired token'
    })
  }
}) 