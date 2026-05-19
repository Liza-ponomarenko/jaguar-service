import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  return prisma.booking.findMany({
    where: {
      userId: Number(query.userId)
    },

    include: {
      car: true
    },

    orderBy: {
      bookingDate: 'desc'
    }
  })
})