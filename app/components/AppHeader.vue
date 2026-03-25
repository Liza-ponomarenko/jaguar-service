<script setup lang="ts">
const { user, logout } = useAuth()
</script>

<template>
<header class="bg-[#3F3F3F] text-white">
  <div class="max-w-7xl mx-auto flex justify-between items-center px-8 py-4">

    <!-- ЛОГО -->
    <NuxtLink
      to="/"
      class="text-2xl tracking-widest font-semibold"
    >
      JAGUAR
    </NuxtLink>

    <!-- НАВИГАЦИЯ -->
    <nav class="flex items-center gap-8 text-sm">

      <NuxtLink to="/services" class="hover:opacity-80">
        Услуги
      </NuxtLink>

      <NuxtLink to="/contacts" class="hover:opacity-80">
        Контакты
      </NuxtLink>

      <!-- НЕ АВТОРИЗОВАН -->
      <NuxtLink
        v-if="!user"
        to="/account"
        class="bg-gray-200 text-black px-3 py-1 rounded"
      >
        Вход/Регистрация
      </NuxtLink>

      <!-- АВТОРИЗОВАН -->
      <div v-else class="flex items-center gap-3">

        <NuxtLink
          to="/account"
          class="bg-gray-200 text-black px-3 py-1 rounded"
        >
          Личный кабинет
        </NuxtLink>

        <button
          @click="logout"
          class="text-sm opacity-70 hover:opacity-100"
        >
          Выйти
        </button>

      </div>

    </nav>

  </div>
</header>
</template>