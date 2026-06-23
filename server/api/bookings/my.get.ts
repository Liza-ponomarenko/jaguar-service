import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const userId = Number(query.userId)

  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Не передан userId'
    })
  }

  return prisma.booking.findMany({
    where: {
      userId
    },
    include: {
      car: true
    },
    orderBy: {
      bookingDate: 'desc'
    }
  })
})