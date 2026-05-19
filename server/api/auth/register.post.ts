import prisma from '../../utils/prisma'
import bcrypt from 'bcrypt'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const required = ['email', 'password', 'fullName', 'phone', 'region', 'city']
  for (const field of required) {
    if (!body[field]) {
      throw createError({ 
        statusCode: 400, 
        statusMessage: `Поле ${field} обязательно для заполнения` 
      })
    }
  }

  if (body.password.length < 6) {
    throw createError({ 
      statusCode: 400, 
      statusMessage: 'Пароль должен быть не менее 6 символов' 
    })
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: body.email }
  })

  if (existingUser) {
    throw createError({ 
      statusCode: 400, 
      statusMessage: 'Пользователь с таким email уже существует' 
    })
  }

  const hash = await bcrypt.hash(body.password, 10)

  const userCount = await prisma.user.count()
  const role = userCount === 0 ? 'ADMIN' : 'USER'

  const user = await prisma.user.create({
    data: {
      email: body.email,
      password: hash,
      fullName: body.fullName,
      phone: body.phone,
      region: body.region,
      city: body.city,
      role
    }
  })

  await setUserSession(event, {
    user: {
      id: user.id,
      email: user.email,
      role: user.role
    }
  })

  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    phone: user.phone,
    region: user.region,
    city: user.city,
    role: user.role
  }
})