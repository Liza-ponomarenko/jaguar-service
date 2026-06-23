<script setup lang="ts">
import { VueDatePicker } from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

definePageMeta({
  middleware: ['auth']
})

type Car = {
  id: number
  brand: string
  model: string
  year: number
}

const { user } = useAuth()
const route = useRoute()

const service = ref((route.query.service as string) || '')
const comment = ref('')

const bookingDate = ref<Date | null>(null)
const bookingTime = ref('')

const success = ref(false)
const loading = ref(false)

const selectedCar = ref<number | null>(null)

const cars = ref<Car[]>([])
const availableTimes = ref<string[]>([])
const busyDays = ref<string[]>([])

const formatDate = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

onMounted(async () => {
  if (!user.value) return

  cars.value = await $fetch<Car[]>('/api/cars/get', {
    params: {
      userId: user.value.id
    }
  })

  busyDays.value = await $fetch<string[]>('/api/booking/busy-days')
})

watch(bookingDate, async (date) => {
  bookingTime.value = ''
  availableTimes.value = []

  if (!date) return

  const formattedDate = formatDate(date)

  availableTimes.value = await $fetch<string[]>('/api/booking/available-times', {
    params: {
      date: formattedDate
    }
  })
})

const disabledDates = (date: Date) => {
  const day = date.getDay()
  const formatted = formatDate(date)

  return day === 0 || busyDays.value.includes(formatted)
}

const submit = async () => {
  if (!user.value) {
    alert('Необходимо авторизоваться')
    return
  }

  if (!service.value) return alert('Выберите услугу')
  if (!selectedCar.value) return alert('Выберите автомобиль')
  if (!bookingDate.value) return alert('Выберите дату')
  if (!bookingTime.value) return alert('Выберите время')

  loading.value = true

  try {
    const formattedDate = formatDate(bookingDate.value)
    const fullDate = `${formattedDate}T${bookingTime.value}:00`

    await $fetch('/api/booking', {
      method: 'POST',
      body: {
        userId: user.value.id,
        email: user.value.email,
        service: service.value,
        comment: comment.value,
        carId: selectedCar.value,
        bookingDate: fullDate
      }
    })

    success.value = true

    service.value = ''
    comment.value = ''
    bookingDate.value = null
    bookingTime.value = ''
    selectedCar.value = null
    availableTimes.value = []

    busyDays.value = await $fetch<string[]>('/api/booking/busy-days')
  } catch (e: any) {
    alert(e?.statusMessage || 'Ошибка при записи')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto p-8 text-white">
    <div class="bg-[#3F3F3F] rounded-2xl p-8 shadow-lg">
      <h2 class="text-3xl font-bold mb-6">
        Онлайн-запись в автосервис
      </h2>

      <p v-if="user" class="mb-6 text-gray-300">
        Клиент:
        <span class="font-bold">{{ user.email }}</span>
      </p>

      <div
        v-if="success"
        class="mb-6 p-4 rounded-xl border border-green-500 bg-green-500/20 text-green-400"
      >
        ✅ Заявка успешно отправлена
      </div>

      <form @submit.prevent="submit" class="space-y-5">
        <div>
          <label class="block mb-2">Услуга</label>

          <select
            v-model="service"
            class="w-full p-3 rounded-xl bg-black border border-gray-700"
          >
            <option disabled value="">Выберите услугу</option>
            <option>Диагностика</option>
            <option>ТО Jaguar</option>
            <option>Ремонт двигателя</option>
            <option>Замена масла</option>
            <option>Ремонт подвески</option>
            <option>Тюнинг и апгрейд</option>
            <option>Заправка автокондиционера</option>
            <option>Установка сигнализации</option>
          </select>
        </div>

        <div>
          <label class="block mb-2">Автомобиль</label>

          <select
            v-model="selectedCar"
            class="w-full p-3 rounded-xl bg-black border border-gray-700"
          >
            <option :value="null" disabled>Выберите автомобиль</option>

            <option
              v-for="car in cars"
              :key="car.id"
              :value="car.id"
            >
              {{ car.brand }} {{ car.model }} ({{ car.year }})
            </option>
          </select>
        </div>

        <div>
          <label class="block mb-2">Дата записи</label>

          <VueDatePicker
            v-model="bookingDate"
            Locale="ru"
            dark
            auto-apply
            :enable-time-picker="false"
            :min-date="new Date()"
            :disabled-dates="disabledDates"
            placeholder="Выберите свободную дату"
          />

          <p class="text-xs text-gray-400 mt-2">
            Воскресенье и полностью занятые дни недоступны для выбора.
          </p>
        </div>

        <div>
          <label class="block mb-2">Свободное время</label>

          <div
            v-if="bookingDate && availableTimes.length"
            class="grid grid-cols-3 md:grid-cols-4 gap-3"
          >
            <button
              v-for="time in availableTimes"
              :key="time"
              type="button"
              @click="bookingTime = time"
              class="py-2 rounded-xl border border-gray-700 transition"
              :class="bookingTime === time ? 'bg-white text-black' : 'bg-black text-white'"
            >
              {{ time }}
            </button>
          </div>

          <p
            v-else-if="bookingDate"
            class="text-red-400"
          >
            На выбранную дату свободного времени нет
          </p>

          <p
            v-else
            class="text-gray-400"
          >
            Сначала выберите дату
          </p>
        </div>

        <div>
          <label class="block mb-2">Комментарий</label>

          <textarea
            v-model="comment"
            placeholder="Комментарий (необязательно)"
            class="w-full p-3 rounded-xl bg-black border border-gray-700 min-h-[120px]"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full py-3 rounded-xl bg-white text-black font-bold hover:opacity-80"
        >
          {{ loading ? 'Отправка...' : 'Записаться' }}
        </button>
      </form>
    </div>
  </div>
</template>