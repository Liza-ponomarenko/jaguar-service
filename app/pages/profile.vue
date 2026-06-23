<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
})

const { user } = useAuth()

type Car = {
  id: number
  brand: string
  model: string
  year: number
}

type Booking = {
  id: number
  service: string
  status: string
  bookingDate: string
  comment?: string | null
  car?: Car | null
}

const models = ['XE', 'XF', 'XJ', 'F-PACE', 'E-PACE', 'I-PACE', 'F-TYPE']

const carModel = ref('')
const carYear = ref<number | null>(null)

const cars = ref<Car[]>([])
const bookings = ref<Booking[]>([])
const loading = ref(false)

const sortType = ref<'dateDesc' | 'dateAsc' | 'timeAsc' | 'timeDesc'>('dateDesc')

const loadData = async () => {
  if (!user.value) return

  loading.value = true

  try {
    cars.value = await $fetch<Car[]>('/api/cars/get', {
      params: { userId: user.value.id }
    })

    bookings.value = await $fetch<Booking[]>('/api/bookings/my', {
      params: { userId: user.value.id }
    })
  } finally {
    loading.value = false
  }
}

onMounted(loadData)

const addCar = async () => {
  if (!user.value) return

  if (!carModel.value || !carYear.value) {
    return alert('Заполните модель и год автомобиля')
  }

  await $fetch('/api/cars/add', {
    method: 'POST',
    body: {
      model: carModel.value,
      year: carYear.value,
      userId: user.value.id
    }
  })

  carModel.value = ''
  carYear.value = null

  await loadData()
}

const sortedBookings = computed(() => {
  return [...bookings.value].sort((a, b) => {
    const dateA = new Date(a.bookingDate).getTime()
    const dateB = new Date(b.bookingDate).getTime()

    if (sortType.value === 'dateAsc') return dateA - dateB
    if (sortType.value === 'dateDesc') return dateB - dateA

    const dA = new Date(a.bookingDate)
    const dB = new Date(b.bookingDate)

    const timeA = dA.getHours() * 60 + dA.getMinutes()
    const timeB = dB.getHours() * 60 + dB.getMinutes()

    if (sortType.value === 'timeAsc') return timeA - timeB
    if (sortType.value === 'timeDesc') return timeB - timeA

    return 0
  })
})

const futureBookings = computed(() =>
  sortedBookings.value.filter(
    booking => new Date(booking.bookingDate).getTime() >= Date.now()
  )
)

const pastBookings = computed(() =>
  sortedBookings.value.filter(
    booking => new Date(booking.bookingDate).getTime() < Date.now()
  )
)

const formatDateTime = (date: string) => {
  return new Date(date).toLocaleString('ru-RU')
}

const statusText = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'Ожидает подтверждения'

    case 'CONFIRMED':
      return 'Подтверждена'

    case 'COMPLETED':
      return 'Выполнена'

    case 'CANCELLED':
      return 'Отменена'

    default:
      return status
  }
}

const statusClass = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'text-yellow-400'

    case 'CONFIRMED':
      return 'text-blue-400'

    case 'COMPLETED':
      return 'text-green-400'

    case 'CANCELLED':
      return 'text-red-400'

    default:
      return 'text-gray-400'
  }
}
</script>

<template>
  <div class="max-w-6xl mx-auto p-8 text-white">
    <h1 class="text-4xl font-bold mb-8 text-black">
      Личный кабинет
    </h1>
    <div
  v-if="user?.role === 'ADMIN'"
  class="bg-red-500 text-white p-4 rounded-xl mb-6"
>
  Вы вошли как Администратор
</div>


    <div class="bg-[#3F3F3F] rounded-2xl p-6 mb-8">
      <h2 class="text-2xl font-bold mb-4">Информация</h2>

      <div class="space-y-2 text-gray-300">
        <p><span class="font-bold">ФИО:</span> {{ user?.fullName }}</p>
        <p><span class="font-bold">Email:</span> {{ user?.email }}</p>
        <p><span class="font-bold">Телефон:</span> {{ user?.phone }}</p>
        <p><span class="font-bold">Регион:</span> {{ user?.region }}</p>
        <p><span class="font-bold">Город:</span> {{ user?.city }}</p>
      </div>
    </div>

    <div class="bg-[#3F3F3F] rounded-2xl p-6 mb-8">
      <h2 class="text-2xl font-bold mb-4">Мои автомобили</h2>

      <div class="flex flex-col md:flex-row gap-4 mb-6">
        <select
          v-model="carModel"
          class="bg-black border border-gray-700 p-3 rounded-xl flex-1"
        >
          <option value="">Модель Jaguar</option>
          <option v-for="model in models" :key="model" :value="model">
            {{ model }}
          </option>
        </select>

        <input
          v-model.number="carYear"
          type="number"
          min="1990"
          :max="new Date().getFullYear()"
          placeholder="Год"
          class="bg-black border border-gray-700 p-3 rounded-xl md:w-40"
        />

        <button
          @click="addCar"
          class="bg-white text-black px-6 py-3 rounded-xl font-bold"
        >
          Добавить
        </button>
      </div>

      <div v-if="cars.length" class="grid md:grid-cols-2 gap-4">
        <div
          v-for="car in cars"
          :key="car.id"
          class="bg-black rounded-xl p-4 border border-gray-700"
        >
          <div class="text-xl font-bold">Jaguar {{ car.model }}</div>
          <div class="text-gray-400">{{ car.year }} год</div>
        </div>
      </div>

      <div v-else class="text-gray-400">
        У вас пока нет добавленных автомобилей
      </div>
    </div>

    <div class="bg-[#3F3F3F] rounded-2xl p-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 class="text-2xl font-bold">История записей</h2>
          <p class="text-sm text-gray-400 mt-1">
            Всего записей: {{ bookings.length }}
          </p>
        </div>

        <div class="flex gap-3">
          <select
            v-model="sortType"
            class="bg-black border border-gray-700 p-3 rounded-xl text-white"
          >
            <option value="dateDesc">Сначала новые даты</option>
            <option value="dateAsc">Сначала старые даты</option>
            <option value="timeAsc">По времени: с утра</option>
            <option value="timeDesc">По времени: с вечера</option>
          </select>

          <button
            @click="loadData"
            class="bg-black px-4 py-2 rounded-xl text-sm hover:bg-gray-900"
          >
            Обновить
          </button>
        </div>
      </div>

      <div v-if="loading" class="text-gray-400">
        Загрузка...
      </div>

      <template v-else>
        <div class="mb-8">
          <h3 class="text-xl font-bold mb-4 text-green-400">
            Будущие записи
          </h3>

          <div v-if="futureBookings.length" class="space-y-4">
            <div
              v-for="booking in futureBookings"
              :key="booking.id"
              class="bg-black rounded-xl p-4 border border-green-500/40"
            >
              <div class="flex justify-between mb-2">
                <div class="font-bold">{{ booking.service }}</div>
                <div class="text-gray-400">
                  {{ formatDateTime(booking.bookingDate) }}
                </div>
              </div>

              <div class="text-gray-300">
                Jaguar {{ booking.car?.model || 'не указан' }}
              </div>

              <div class="mt-2 text-sm text-green-400">
                Тип записи: будущая
              </div>

              <div class="mt-1 text-sm font-medium" :class="statusClass(booking.status)">
                Статус: {{ statusText(booking.status) }}
              </div>

              <div v-if="booking.comment" class="mt-2 text-sm text-gray-400">
                Комментарий: {{ booking.comment }}
              </div>
            </div>
          </div>

          <div v-else class="text-gray-400">
            Будущих записей пока нет
          </div>
        </div>

        <div>
          <h3 class="text-xl font-bold mb-4 text-gray-400">
            Прошедшие записи
          </h3>

          <div v-if="pastBookings.length" class="space-y-4">
            <div
              v-for="booking in pastBookings"
              :key="booking.id"
              class="bg-black rounded-xl p-4 border border-gray-700 opacity-80"
            >
              <div class="flex justify-between mb-2">
                <div class="font-bold">{{ booking.service }}</div>
                <div class="text-gray-400">
                  {{ formatDateTime(booking.bookingDate) }}
                </div>
              </div>

              <div class="text-gray-300">
                Jaguar {{ booking.car?.model || 'не указан' }}
              </div>

              <div class="mt-2 text-sm text-gray-400">
                Тип записи: прошедшая
              </div>

              <div class="mt-1 text-sm font-medium" :class="statusClass(booking.status)">
                Статус: {{ statusText(booking.status) }}
              </div>

              <div v-if="booking.comment" class="mt-2 text-sm text-gray-400">
                Комментарий: {{ booking.comment }}
              </div>
            </div>
          </div>

          <div v-else class="text-gray-400">
            Прошедших записей пока нет
          </div>
        </div>
      </template>
    </div>
  </div>
</template>