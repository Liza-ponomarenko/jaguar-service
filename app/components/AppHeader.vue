<script setup lang="ts">
const { user, logout, isAuthenticated } = useAuth()

onMounted(() => {
  const { fetchUser } = useAuth()
  fetchUser()
})
</script>

<template>
  <header class="bg-[#3F3F3F] text-white">
    <div class="max-w-7xl mx-auto flex justify-between items-center px-8 py-4">
      <NuxtLink to="/" class="text-2xl tracking-widest font-semibold">
        JAGUAR
      </NuxtLink>

      <nav class="flex items-center gap-8 text-sm">
        <NuxtLink to="/services" class="hover:opacity-80">
          Услуги
        </NuxtLink>

        <NuxtLink to="/contacts" class="hover:opacity-80">
          Контакты
        </NuxtLink>

        <NuxtLink
          v-if="!isAuthenticated"
          to="/account"
          class="bg-gray-200 text-black px-3 py-1 rounded hover:bg-white transition"
        >
          Вход/Регистрация
        </NuxtLink>

        <div v-else class="flex items-center gap-3">
  
  <!-- ADMIN -->
 <NuxtLink
  v-if="user?.role === 'ADMIN'"
  to="/admin"
  class="bg-gray-200 text-black px-3 py-1 rounded"
>
  Админ-панель
</NuxtLink>

  <!-- ПРОФИЛЬ -->
  <NuxtLink
    to="/profile"
    class="flex items-center gap-2 bg-gray-200 text-black px-3 py-1 rounded hover:bg-white transition"
  >
    <!-- аватар -->
    <div class="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-xs">
      {{ user?.fullName?.charAt(0) || user?.email?.charAt(0) }}
    </div>

    <!-- имя -->
    <span>
      {{ user?.fullName || user?.email }}
    </span>
  </NuxtLink>

  <!-- ВЫХОД -->
  <button
    @click="logout"
    class="text-sm opacity-70 hover:opacity-100 hover:text-red-400 transition"
  >
    Выйти
  </button>

</div>
      </nav>
    </div>
  </header>
</template>