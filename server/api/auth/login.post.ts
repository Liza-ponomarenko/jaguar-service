import prisma from '../../utils/prisma'
import bcrypt from 'bcrypt'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const user = await prisma.user.findUnique({
    where: { email: body.email }
  })

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Пользователь не найден' })
  }

  const isValid = await bcrypt.compare(body.password, user.password)

  if (!isValid) {
    throw createError({ statusCode: 401, statusMessage: 'Неверный пароль' })
  }

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