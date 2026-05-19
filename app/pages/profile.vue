<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
})

const { user } = useAuth()

const models = [
  'XE',
  'XF',
  'XJ',
  'F-PACE',
  'E-PACE',
  'I-PACE',
  'F-TYPE'
]

const carModel = ref('')
const carYear = ref<number | null>(null)

const cars = ref<any[]>([])
const bookings = ref<any[]>([])

const loadData = async () => {
  if (!user.value) return

  cars.value = await $fetch('/api/cars/get', {
    params: {
      userId: user.value.id
    }
  })

  bookings.value = await $fetch('/api/bookings/my', {
    params: {
      userId: user.value.id
    }
  })
}

onMounted(loadData)

const addCar = async () => {
  if (!carModel.value || !carYear.value) {
    return alert('Заполните все поля')
  }

  await $fetch('/api/cars/add', {
    method: 'POST',

    body: {
      model: carModel.value,
      year: carYear.value,
      userId: user.value?.id
    }
  })

  carModel.value = ''
  carYear.value = null

  loadData()
}
</script>

<template>
  <div class="max-w-6xl mx-auto p-8 text-white">

    <h1 class="text-4xl font-bold mb-8">
      Личный кабинет
    </h1>

    <!-- профиль -->
    <div class="bg-[#3F3F3F] rounded-2xl p-6 mb-8">

      <h2 class="text-2xl font-bold mb-4">
        Информация
      </h2>

      <div class="space-y-2 text-gray-300">

        <p>
          <span class="font-bold">ФИО:</span>
          {{ user?.fullName }}
        </p>

        <p>
          <span class="font-bold">Email:</span>
          {{ user?.email }}
        </p>

        <p>
          <span class="font-bold">Телефон:</span>
          {{ user?.phone }}
        </p>

      </div>

    </div>

    <!-- авто -->
    <div class="bg-[#3F3F3F] rounded-2xl p-6 mb-8">

      <h2 class="text-2xl font-bold mb-4">
        Мои автомобили
      </h2>

      <div class="flex gap-4 mb-6">

        <select
          v-model="carModel"
          class="bg-black border border-gray-700 p-3 rounded-xl flex-1"
        >
          <option value="">
            Модель Jaguar
          </option>

          <option
            v-for="model in models"
            :key="model"
          >
            {{ model }}
          </option>
        </select>

        <input
          v-model="carYear"
          type="number"
          placeholder="Год"
          class="bg-black border border-gray-700 p-3 rounded-xl w-40"
        />

        <button
          @click="addCar"
          class="bg-white text-black px-6 rounded-xl font-bold"
        >
          Добавить
        </button>

      </div>

      <div class="grid md:grid-cols-2 gap-4">

        <div
          v-for="car in cars"
          :key="car.id"
          class="bg-black rounded-xl p-4"
        >
          <div class="text-xl font-bold">
            Jaguar {{ car.model }}
          </div>

          <div class="text-gray-400">
            {{ car.year }} год
          </div>
        </div>

      </div>

    </div>

    <!-- история -->
    <div class="bg-[#3F3F3F] rounded-2xl p-6">

      <h2 class="text-2xl font-bold mb-6">
        История записей
      </h2>

      <div class="space-y-4">

        <div
          v-for="booking in bookings"
          :key="booking.id"
          class="bg-black rounded-xl p-4"
        >
          <div class="flex justify-between mb-2">

            <div class="font-bold">
              {{ booking.service }}
            </div>

            <div class="text-gray-400">
              {{ new Date(booking.bookingDate).toLocaleString() }}
            </div>

          </div>

          <div class="text-gray-300">
            Jaguar {{ booking.car.model }}
          </div>

          <div class="mt-2 text-sm text-gray-500">
            Статус: {{ booking.status }}
          </div>

        </div>

      </div>

    </div>

  </div>
</template>