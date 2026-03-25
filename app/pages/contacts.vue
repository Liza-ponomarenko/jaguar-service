<template>
  <div class="min-h-screen bg-[#252525] text-white">
    <section class="relative overflow-hidden">
      <div class="container mx-auto px-6 py-16 lg:py-24">
        <div class="grid lg:grid-cols-2 gap-12 items-center">

          <div class="space-y-6">
            <h1 class="text-4xl lg:text-6xl font-light tracking-wide uppercase">
              Контакты
            </h1>
            <p class="text-lg font-light">
              Свяжитесь с нами удобным для вас способом
            </p>
          </div>
          
          <div class="relative">
            <div class="max-w-3xl mx-auto lg:ml-auto  overflow-hidden">
              <img src="/img/start-stop.png" class="w-full h-full object-cover transition-transform duration-700">
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-10 bg-[#1a1a1a]">
      <div class="container mx-auto px-8">
        <h2 class="text-2xl font-light uppercase tracking-wider mb-8 pb-4">
          Как связаться
        </h2>
        
        <p class="mb-5  leading-relaxed">
          Мы приветствуем ваши запросы. Пожалуйста, используйте ссылки ниже, чтобы связаться с Jaguar. 
          Вы можете связаться с Jaguar по телефону, электронной почте или посетив ваш местный автосервис. 
          Ваш запрос будет отправлен члену нашей специальной команды, который свяжется с вами в ближайшее время.
        </p>

        <div class="grid md:grid-cols-2 gap-8 mb-16">
          <div class="relative overflow-hidden rounded-lg group">
           <img src="/img/img-left.png" class="w-full object-cover group-hover:scale-105 transition-transform duration-500">
            <div class="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
          </div>
          
          <div class="relative overflow-hidden rounded-lg group">
            <img src="/img/img-right.png" class="w-full object-cover group-hover:scale-105 transition-transform duration-500">
            <div class="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
          </div>
        </div>
      </div>
    </section>

    <div class="grid md:grid-cols-2 lg:grid-cols-2 gap-8 bg-[#252525] py-8 px-8">
          <div class="space-y-3">
            <h3 class="uppercase tracking-widest text-sm font-semibold">Телефон</h3>
            <a class="text-xl hover:text-[#c41e3a] transition-colors duration-300 block">
              +7 (999) 123-45-67
            </a>
          </div>

          <div class="space-y-3">
            <h3 class="uppercase tracking-widest text-sm font-semibold">Электронная почта</h3>
            <a class="text-xl hover:text-[#c41e3a] transition-colors duration-300 block">
              info@jaguarservice.ru
            </a>
          </div>

          <div class="space-y-3">
            <h3 class="uppercase tracking-widest text-sm font-semibold">Адрес</h3>
            <p class="text-xl">
              г. Ростов-на-Дону, ул. Пескова, 17у
            </p>
          </div>

          <div class="space-y-3">
            <h3 class="uppercase tracking-widest text-sm font-semibold">Режим работы</h3>
            <p class="text-xl">
              Пн-Пт: 9:00 - 20:00<br>
              Сб: 9:00 - 18:00
            </p>
          </div>
        </div>

    <section class="relative h-[500px] w-full bg-[#2a2a2a]">
      <ClientOnly>
        <YandexMap :coords="[47.213118, 39.586985]" :zoom="14" />
      </ClientOnly>
      
      <div class="absolute bottom-6 left-6 bg-black/80 backdrop-blur-sm p-6 rounded-lg max-w-sm z-10 pointer-events-none">
        <h4 class="text-[#c41e3a] font-bold uppercase tracking-wider mb-2">Jaguar Autoservice</h4>
        <p class="text-gray-300 text-sm">Ростов-на-Дону, ул. Пескова, 17у</p>
        <a href="https://yandex.ru/maps/?rtext=~47.2357,39.7015" 
          target="_blank"
          class="inline-flex items-center mt-3 text-[#c41e3a] hover:text-white transition-colors text-sm font-semibold pointer-events-auto">
          Построить маршрут
          <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </div>
    </section>
  </div>
</template>

<script setup>

useHead({
  title: 'Контакты | Jaguar Autoservice',
  meta: [
    { name: 'description', content: 'Свяжитесь с Jaguar Autoservice в Ростове-на-Дону. Телефон, email, адрес и режим работы.' }
  ]
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700&display=swap');

section {
  font-family: 'Montserrat', sans-serif;
}

.fade-in-up {
  animation: fadeInUp 0.8s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.glow-red {
  box-shadow: 0 0 30px rgba(196, 30, 58, 0.5);
}
</style>