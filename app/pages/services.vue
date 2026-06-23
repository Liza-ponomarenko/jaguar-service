<script setup lang="ts">
const { user } = useAuth()


const services = [
  { id: 1, title: 'Диагностика', price: '3000 ₽' },
  { id: 2, title: 'ТО Jaguar', price: '12000 ₽' },
  { id: 3, title: 'Ремонт двигателя', price: 'от 50000 ₽' },
  { id: 4, title: 'Замена масла', price: 'от 5000 ₽' },
  { id: 5, title: 'Ремонт подвески', price: 'от 12000 ₽' },
  { id: 5, title: 'Тюнинг и апгрейд', price: 'от 20000 ₽' },
  { id: 6, title: 'Заправка автокондиционера', price: '800 ₽'},
  { id: 7, title: 'Установка сигнализации', price: '3000 ₽'}

]
</script>

<template>
  <div class="max-w-4xl mx-auto p-8">
    <h2 class="text-2xl font-bold mb-6">Наши услуги</h2>

    <div class="grid gap-4">
      <div
        v-for="service in services"
        :key="service.id"
        class="border p-4 flex justify-between items-center"
      >
        <div>
          <h3 class="font-bold">{{ service.title }}</h3>
          <p class="text-gray-600">{{ service.price }}</p>
        </div>

        <!-- КНОПКА ТОЛЬКО ЕСЛИ ВОШЁЛ -->
        <NuxtLink
          v-if="user"
          :to="`/booking?service=${service.title}`"
          class="bg-black text-white px-4 py-2"
        >
          Записаться
        </NuxtLink>

        <!-- ЕСЛИ НЕ ВОШЁЛ -->
        <NuxtLink
          v-else
          to="/account"
          class="text-sm underline"
        >
          Войдите, чтобы записаться
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
