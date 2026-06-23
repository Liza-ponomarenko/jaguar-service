<script setup lang="ts">
definePageMeta({
  middleware: ['admin']
})

type Status = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'
type Role = 'USER' | 'ADMIN'

type Booking = {
  id: number
  service: string
  status: Status
  bookingDate?: string
  createdAt: string
  user: {
    email: string
    fullName: string | null
  }
  car?: {
    brand: string
    model: string
    year: number
  } | null
}

type User = {
  id: number
  email: string
  fullName: string
  phone: string
  region: string
  city: string
  role: Role
  createdAt: string
}

const activeTab = ref<'bookings' | 'users'>('bookings')

const bookings = ref<Booking[]>([])
const users = ref<User[]>([])

const search = ref('')
const statusFilter = ref<Status | ''>('')
const dateFilter = ref('')

const loadBookings = async () => {
  bookings.value = await $fetch<Booking[]>('/api/admin/bookings')
}

const loadUsers = async () => {
  users.value = await $fetch<User[]>('/api/admin/users')
}

const loadAll = async () => {
  await Promise.all([
    loadBookings(),
    loadUsers()
  ])
}

onMounted(loadAll)

const filteredBookings = computed(() => {
  return bookings.value.filter((b) => {
    const email = b.user.email.toLowerCase()
    const matchEmail = email.includes(search.value.toLowerCase())
    const matchStatus = statusFilter.value ? b.status === statusFilter.value : true

    const dateSource = b.bookingDate || b.createdAt
    const matchDate = dateFilter.value
      ? new Date(dateSource).toDateString() === new Date(dateFilter.value).toDateString()
      : true

    return matchEmail && matchStatus && matchDate
  })
})

const stats = computed(() => {
  return {
    bookings: bookings.value.length,
    users: users.value.length,
    pending: bookings.value.filter(b => b.status === 'PENDING').length,
    completed: bookings.value.filter(b => b.status === 'COMPLETED').length
  }
})

const updateStatus = async (id: number, status: Status) => {
  await $fetch(`/api/admin/bookings/${id}`, {
    method: 'PUT',
    body: { status }
  })

  await loadBookings()
}

const updateRole = async (id: number, role: Role) => {
  await $fetch(`/api/admin/users/${id}`, {
    method: 'PUT',
    body: { role }
  })

  await loadUsers()
}
</script>

<template>
  <div class="max-w-7xl mx-auto p-8 text-white">
    <h1 class="text-4xl font-bold mb-8 text-black">
      Панель администратора
    </h1>

    <div class="grid md:grid-cols-4 gap-4 mb-8">
      <div class="bg-[#3F3F3F] p-5 rounded-2xl">
        <p class="text-gray-400">Всего записей</p>
        <p class="text-3xl font-bold">{{ stats.bookings }}</p>
      </div>

      <div class="bg-[#3F3F3F] p-5 rounded-2xl">
        <p class="text-gray-400">Ожидают</p>
        <p class="text-3xl font-bold text-yellow-400">{{ stats.pending }}</p>
      </div>

      <div class="bg-[#3F3F3F] p-5 rounded-2xl">
        <p class="text-gray-400">Выполнено</p>
        <p class="text-3xl font-bold text-green-400">{{ stats.completed }}</p>
      </div>

      <div class="bg-[#3F3F3F] p-5 rounded-2xl">
        <p class="text-gray-400">Пользователи</p>
        <p class="text-3xl font-bold">{{ stats.users }}</p>
      </div>
    </div>

    <div class="flex gap-3 mb-6">
      <button
        @click="activeTab = 'bookings'"
        class="px-5 py-3 rounded-xl"
        :class="activeTab === 'bookings' ? 'bg-black text-white' : 'bg-[#3F3F3F]'"
      >
        Заявки
      </button>

      <button
        @click="activeTab = 'users'"
        class="px-5 py-3 rounded-xl"
        :class="activeTab === 'users' ? 'bg-black text-white' : 'bg-[#3F3F3F]'"
      >
        Пользователи
      </button>
    </div>

    <div v-if="activeTab === 'bookings'" class="bg-[#3F3F3F] rounded-2xl p-6">
      <h2 class="text-2xl font-bold mb-6">Управление заявками</h2>

      <div class="flex flex-wrap gap-3 mb-6">
        <input
          v-model="search"
          placeholder="Поиск по email"
          class="p-3 text-black rounded-xl"
        />

        <select v-model="statusFilter" class="p-3 text-black rounded-xl">
          <option value="">Все статусы</option>
          <option value="PENDING">Ожидание</option>
          <option value="CONFIRMED">Подтверждено</option>
          <option value="COMPLETED">Выполнено</option>
          <option value="CANCELLED">Отменено</option>
        </select>

        <input
          v-model="dateFilter"
          type="date"
          class="p-3 text-black rounded-xl"
        />
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-black">
            <tr>
              <th class="p-3 text-left">ID</th>
              <th class="p-3 text-left">Клиент</th>
              <th class="p-3 text-left">Услуга</th>
              <th class="p-3 text-left">Авто</th>
              <th class="p-3 text-left">Дата</th>
              <th class="p-3 text-left">Статус</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="b in filteredBookings"
              :key="b.id"
              class="border-t border-gray-700"
            >
              <td class="p-3">{{ b.id }}</td>

              <td class="p-3">
                <div>{{ b.user.fullName || '—' }}</div>
                <div class="text-gray-400">{{ b.user.email }}</div>
              </td>

              <td class="p-3">{{ b.service }}</td>

              <td class="p-3">
                <span v-if="b.car">
                  {{ b.car.brand }} {{ b.car.model }} ({{ b.car.year }})
                </span>
                <span v-else>—</span>
              </td>

              <td class="p-3">
                {{ new Date(b.bookingDate || b.createdAt).toLocaleString('ru-RU') }}
              </td>

              <td class="p-3">
                <div class="flex gap-2 flex-wrap">
                  <button
                    @click="updateStatus(b.id, 'PENDING')"
                    class="px-2 py-1 rounded"
                    :class="b.status === 'PENDING' ? 'bg-yellow-300 text-black ring-2 ring-white' : 'bg-yellow-500 text-black'"
                  >
                    Ожидание
                  </button>

                  <button
                    @click="updateStatus(b.id, 'CONFIRMED')"
                    class="px-2 py-1 rounded"
                    :class="b.status === 'CONFIRMED' ? 'bg-blue-300 text-black ring-2 ring-white' : 'bg-blue-500'"
                  >
                    Подтвердить
                  </button>

                  <button
                    @click="updateStatus(b.id, 'COMPLETED')"
                    class="px-2 py-1 rounded"
                    :class="b.status === 'COMPLETED' ? 'bg-green-300 text-black ring-2 ring-white' : 'bg-green-500'"
                  >
                    Выполнено
                  </button>

                  <button
                    @click="updateStatus(b.id, 'CANCELLED')"
                    class="px-2 py-1 rounded"
                    :class="b.status === 'CANCELLED' ? 'bg-red-300 text-black ring-2 ring-white' : 'bg-red-500'"
                  >
                    Отмена
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="activeTab === 'users'" class="bg-[#3F3F3F] rounded-2xl p-6">
      <h2 class="text-2xl font-bold mb-6">Пользователи</h2>

      <div class="space-y-3">
        <div
          v-for="u in users"
          :key="u.id"
          class="bg-black p-4 rounded-xl flex flex-col md:flex-row md:items-center md:justify-between gap-3"
        >
          <div>
            <div class="font-bold">{{ u.fullName }}</div>
            <div class="text-gray-400">{{ u.email }}</div>
            <div class="text-gray-500 text-sm">
              {{ u.phone }} · {{ u.region }}, {{ u.city }}
            </div>
          </div>

          <select
            :value="u.role"
            @change="updateRole(u.id, ($event.target as HTMLSelectElement).value as Role)"
            class="text-black p-2 rounded"
          >
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>