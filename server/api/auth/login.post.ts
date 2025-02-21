import { defineEventHandler, readBody, createError } from 'h3'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { email, password } = body

    // TODO: Replace with actual database validation
    // This is a mock implementation
    if (email === 'test@example.com' && password === 'password') {
      const token = jwt.sign(
        { 
          id: '1', 
          email,
          role: 'dancer'
        }, 
        JWT_SECRET,
        { expiresIn: '1h' }
      )

      return {
        user: {
          id: '1',
          email,
          name: 'Test User',
          role: 'dancer',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        token
      }
    }

    throw createError({
      statusCode: 401,
      message: 'Invalid credentials'
    })
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: 'Authentication failed'
    })
  }
}) 