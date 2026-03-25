import prisma from '../../utils/prisma'
import bcrypt from 'bcrypt'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const hash = await bcrypt.hash(body.password, 10)

  return prisma.user.create({
    data: {
      email: body.email,
      password: hash,
      fullName: body.fullName,
      phone: body.phone,
      region: body.region,
      city: body.city
    }
  })
})
