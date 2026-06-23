import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const { date } = getQuery(event)

  if (!date) return []

  const start = new Date(`${date}T00:00:00`)
  const end = new Date(`${date}T23:59:59`)

  const day = start.getDay()

  // воскресенье
  if (day === 0) return []

  const endHour = day === 6 ? 18 : 20

  const slots: string[] = []

  for (let h = 9; h < endHour; h++) {
    slots.push(`${String(h).padStart(2, '0')}:00`)
  }

  const bookings = await prisma.booking.findMany({
    where: {
      bookingDate: {
        gte: start,
        lte: end
      }
    }
  })

  const occupied = bookings.map(b => {
    const d = new Date(b.bookingDate)

    return `${String(d.getHours()).padStart(2, '0')}:00`
  })

  return slots.filter(time => !occupied.includes(time))
})