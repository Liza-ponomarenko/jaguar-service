import prisma from '../../../utils/prisma'

export default defineEventHandler(async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
      fullName: true,
      phone: true,
      region: true,
      city: true,
      role: true,
      createdAt: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
})