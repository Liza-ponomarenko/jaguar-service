import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  return prisma.car.findMany({
    where: {
      userId: Number(query.userId)
    }
  })
})