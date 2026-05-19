<script setup lang="ts">
definePageMeta({
  middleware: ['admin']
})
type Status = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'

interface Booking {
  id: number
  service: string
  status: Status
  createdAt: string
  user: {
    email: string
    fullName: string | null
  }
}

const { data: bookings, refresh } = await useFetch<Booking[]>('/api/admin/bookings')

// фильтры
const search = ref('')
const statusFilter = ref<Status | ''>('')
const dateFilter = ref('')

// фильтрация
const filteredBookings = computed(() => {
  if (!bookings.value) return []

  return bookings.value.filter(b => {
    const matchEmail = b.user.email.toLowerCase().includes(search.value.toLowerCase())
    const matchStatus = statusFilter.value ? b.status === statusFilter.value : true
    const matchDate = dateFilter.value
      ? new Date(b.createdAt).toDateString() === new Date(dateFilter.value).toDateString()
      : true

    return matchEmail && matchStatus && matchDate
  })
})

// смена статуса
const updateStatus = async (id: number, status: Status) => {
  await $fetch(`/api/admin/bookings/${id}`, {
    method: 'PUT',
    body: { status }
  })

  refresh()
}
</script>

<template>
  <div class="p-8 text-white">

    <h1 class="text-3xl mb-6">CRM Панель</h1>

    <!-- ФИЛЬТРЫ -->
    <div class="flex flex-wrap gap-3 mb-6">

      <input
        v-model="search"
        placeholder="Поиск по email"
        class="p-2 text-black rounded"
      />

      <select v-model="statusFilter" class="p-2 text-black rounded">
        <option value="">Все статусы</option>
        <option value="PENDING">Ожидание</option>
        <option value="CONFIRMED">Подтверждено</option>
        <option value="COMPLETED">Выполнено</option>
        <option value="CANCELLED">Отменено</option>
      </select>

      <input type="date" v-model="dateFilter" class="p-2 text-black rounded" />

    </div>

    <!-- ТАБЛИЦА -->
    <div class="bg-[#3F3F3F] rounded-xl overflow-hidden">

      <table class="w-full">
        <thead class="bg-black">
          <tr>
            <th class="p-3 text-left">ID</th>
            <th class="p-3 text-left">Клиент</th>
            <th class="p-3 text-left">Услуга</th>
            <th class="p-3 text-left">Дата</th>
            <th class="p-3 text-left">Статус</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="b in filteredBookings" :key="b.id" class="border-t border-gray-700">

            <td class="p-3">{{ b.id }}</td>

            <td class="p-3">
              <div>{{ b.user.fullName || '—' }}</div>
              <div class="text-sm text-gray-400">{{ b.user.email }}</div>
            </td>

            <td class="p-3">{{ b.service }}</td>

            <td class="p-3">
              {{ new Date(b.createdAt).toLocaleString() }}
            </td>

            <!-- CRM КНОПКИ -->
            <td class="p-3 flex gap-2 flex-wrap">

              <button
                @click="updateStatus(b.id, 'PENDING')"
                class="px-2 py-1 bg-yellow-500 text-black rounded"
              >
                Ожидание
              </button>

              <button
                @click="updateStatus(b.id, 'CONFIRMED')"
                class="px-2 py-1 bg-blue-500 rounded"
              >
                Подтвердить
              </button>

              <button
                @click="updateStatus(b.id, 'COMPLETED')"
                class="px-2 py-1 bg-green-500 rounded"
              >
                Выполнено
              </button>

              <button
                @click="updateStatus(b.id, 'CANCELLED')"
                class="px-2 py-1 bg-red-500 rounded"
              >
                Отмена
              </button>

            </td>

          </tr>
        </tbody>
      </table>

    </div>

  </div>
</template>