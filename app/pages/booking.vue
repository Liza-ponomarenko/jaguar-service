<script setup lang="ts">
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

const service = ref<string>((route.query.service as string) || '')
const comment = ref('')

const bookingDate = ref('')
const bookingTime = ref('')

const success = ref(false)

const selectedCar = ref<number | null>(null)

const cars = ref<Car[]>([])

const loading = ref(false)

onMounted(async () => {
  if (!user.value) return

  cars.value = await $fetch<Car[]>('/api/cars/get', {
    params: {
      userId: user.value.id
    }
  })
})

const submit = async () => {
  if (!user.value) {
    alert('Необходимо авторизоваться')
    return navigateTo('/account')
  }

  if (!service.value) {
    return alert('Выберите услугу')
  }

  if (!selectedCar.value) {
    return alert('Выберите автомобиль')
  }

  if (!bookingDate.value) {
    return alert('Выберите дату')
  }

  if (!bookingTime.value) {
    return alert('Выберите время')
  }

  loading.value = true

  try {
    // объединяем дату и время
    const fullDate = `${bookingDate.value}T${bookingTime.value}:00`

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

    bookingDate.value = ''
    bookingTime.value = ''

    selectedCar.value = null

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
        <span class="font-bold">
          {{ user.email }}
        </span>
      </p>

      <div
        v-if="success"
        class="mb-6 bg-green-500/20 border border-green-500 text-green-400 p-4 rounded-xl"
      >
        ✅ Заявка успешно отправлена
      </div>

      <form
        @submit.prevent="submit"
        class="space-y-5"
      >

        <!-- Услуга -->
        <div>
          <label class="block mb-2 text-sm text-gray-300">
            Услуга
          </label>

          <select
            v-model="service"
            class="w-full p-3 rounded-xl bg-black border border-gray-700"
          >
            <option value="" disabled>
              Выберите услугу
            </option>

            <option>Диагностика</option>
            <option>ТО Jaguar</option>
            <option>Ремонт двигателя</option>
            <option>Замена масла</option>
            <option>Ремонт подвески</option>
            <option>Тюнинг и апгрейд</option>
          </select>
        </div>

        <!-- Машина -->
        <div>
          <label class="block mb-2 text-sm text-gray-300">
            Автомобиль
          </label>

          <select
            v-model="selectedCar"
            class="w-full p-3 rounded-xl bg-black border border-gray-700"
          >
            <option disabled :value="null">
              Выберите автомобиль
            </option>

            <option
              v-for="car in cars"
              :key="car.id"
              :value="car.id"
            >
              {{ car.brand }} {{ car.model }} ({{ car.year }})
            </option>
          </select>
        </div>

        <!-- Дата -->
        <div>
          <label class="block mb-2 text-sm text-gray-300">
            Дата записи
          </label>

          <input
            v-model="bookingDate"
            type="date"
            class="w-full p-3 rounded-xl bg-black border border-gray-700"
          />
        </div>

        <!-- Время -->
        <div>
          <label class="block mb-2 text-sm text-gray-300">
            Время записи</label>

          <input
            v-model="bookingTime"
            type="time"
            class="w-full p-3 rounded-xl bg-black border border-gray-700"
          />
        </div>

        <!-- Комментарий -->
        <div>
          <label class="block mb-2 text-sm text-gray-300">
            Комментарий
          </label>

          <textarea
            v-model="comment"
            placeholder="Комментарий (необязательно)"
            class="w-full p-3 rounded-xl bg-black border border-gray-700 min-h-[120px]"
          />
        </div>

        <!-- Кнопка -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-white text-black py-3 rounded-xl font-bold hover:opacity-80 transition"
        >
          {{ loading ? 'Отправка...' : 'Записаться' }}
        </button>

      </form>

    </div>

  </div>
</template>