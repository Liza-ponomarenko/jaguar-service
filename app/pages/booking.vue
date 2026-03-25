<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const { user } = useAuth()

const route = useRoute()
const service = ref(route.query.service || '')
const comment = ref('')
const success = ref(false)

const submit = async () => {
  await $fetch('/api/booking', {
    method: 'POST',
    body: {
      userId: user.value.id,
      email: user.value.email,
      service: service.value,
      comment: comment.value
    }
  })

  success.value = true
  service.value = ''
  comment.value = ''
}
</script>

<template>
  <div class="max-w-xl mx-auto p-8">
    <h2 class="text-2xl font-bold mb-6">Онлайн-запись в автосервис</h2>

    <p class="mb-4 text-gray-600">
      Клиент: <b>{{ user.email }}</b>
    </p>

    <div v-if="success" class="mb-4 text-green-600">
      Заявка успешно отправлена
    </div>

    <form @submit.prevent="submit" class="space-y-4">
      <select
        v-model="service"
        required
        class="w-full border p-2"
      >
        <option value="" disabled>Выберите услугу</option>
        <option>Диагностика</option>
        <option>ТО Jaguar</option>
        <option>Ремонт двигателя</option>
        <option>Замена масла</option>
      </select>

      <textarea
        v-model="comment"
        placeholder="Комментарий (необязательно)"
        class="w-full border p-2"
      />

      <button
        type="submit"
        class="bg-black text-white px-6 py-2"
      >
        Записаться
      </button>
    </form>
  </div>
</template>
