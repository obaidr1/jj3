import { H3Event, defineEventHandler, readBody, createError } from 'h3'
import * as jose from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key'
)

export default defineEventHandler(async (event: H3Event) => {
  try {
    const body = await readBody(event)
    const { email, password, name, role } = body

    const token = await new jose.SignJWT({ 
      id: '1', 
      email,
      role 
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1h')
      .sign(JWT_SECRET)

    return {
      user: {
        id: '1',
        email,
        name,
        role,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      token
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: 'Registration failed'
    })
  }
}) 