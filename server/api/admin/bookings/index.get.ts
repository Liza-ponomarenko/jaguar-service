import prisma from '../../../utils/prisma'

export default defineEventHandler(async () => {
  return prisma.booking.findMany({
    include: {
      user: {
        select: {
          email: true,
          fullName: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
})