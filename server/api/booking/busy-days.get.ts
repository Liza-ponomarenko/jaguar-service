import prisma from '../../utils/prisma'

const formatDate = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export default defineEventHandler(async () => {
  const bookings = await prisma.booking.findMany()

  const grouped: Record<string, number> = {}

  for (const booking of bookings) {
    const key = formatDate(new Date(booking.bookingDate))

    grouped[key] = (grouped[key] || 0) + 1
  }

  const busyDays: string[] = []

  for (const date of Object.keys(grouped)) {
    const dayOfWeek = new Date(`${date}T00:00:00`).getDay()

    const maxSlots = dayOfWeek === 6 ? 9 : 11

    const count = grouped[date] ?? 0

    if (count >= maxSlots) {
      busyDays.push(date)
    }
  }

  return busyDays
})