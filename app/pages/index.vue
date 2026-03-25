<template>

<div class="bg-black text-white">

<div class="bg-[#141414]">
<section class="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center px-2 ">

  <div>
    <h1 class="text-[25px] font-bold mb-6">
      АВТОСЕРВИС БУДУЩЕГО
    </h1>

    <p class="text-gray-300 mb-6 leading-relaxed text-[20px]">
      Специализированное обслуживание Jaguar с использованием
      передовых технологий и оригинальных запчастей.
      Поддерживайте свой автомобиль в идеальном состоянии.
      Наши гибкие варианты обслуживания включают бесплатную
      проверку состояния автомобиля.
    </p>

    <div class="flex gap-4">
      <NuxtLink
        to="/services"
        class="bg-[#D9D9D9] text-[#1E1E1E] text-[18px] px-4 py-2 rounded"
      >
        Наши услуги
      </NuxtLink>

      <NuxtLink
        to="/account"
        class="bg-[#D9D9D9] text-[#1E1E1E] text-[18px] px-4 py-2 rounded"
      >
        Записаться
      </NuxtLink>
    </div>
  </div>

  <img src="/img/jaguar-car.png" class="rounded"/>

</section>
</div>


<section class="py-14">

  <h2 class="text-center text-[25px] font-semibold mb-10">
    Почему выбирают нас
  </h2>

  <div class="max-w-7xl mx-auto grid md:grid-cols-3 gap-14 px-8">

    <div class="bg-[#D9D9D9] text-black p-6 rounded text-center">
      <h3 class="font-semibold mb-2 text-[25px]">
        Оригинальные детали
      </h3>

      <p class="text-[20px] text-[#141414]">
        Мы используем только оригинальные запчасти
        Jaguar и сертифицированное оборудование.
      </p>
    </div>

    <div class="bg-[#D9D9D9] text-black p-6 rounded text-center">
      <h3 class="font-semibold mb-2 text-[25px]">
        Опытные специалисты
      </h3>

      <p class="text-[20px] text-[#141414]">
        Наши механики проходят регулярное обучение
        и сертификацию Jaguar.
      </p>
    </div>

    <div class="bg-[#D9D9D9] text-black p-6 rounded text-center">
      <h3 class="font-semibold mb-2 text-[25px]">
        Быстрая запись
      </h3>

      <p class="text-[20px] text-[#141414]">
        Запишитесь онлайн и приезжайте в удобное
        для вас время — без ожидания.
      </p>
    </div>

  </div>

</section>

 <div class="bg-[#141414]">
<section class="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center px-8">

  <p class="text-gray-300 leading-relaxed text-[22px]">
    Сегодня бренд Jaguar продолжает воплощать роскошь,
    элегантность и инновации в каждом своём автомобиле.
    Jaguar остаётся символом престижа и высокой
    производительности. Его история — это история
    стремления к совершенству и превосходству,
    которая продолжает вдохновлять поклонников
    по всему миру.
  </p>

  <img
    src="/img/jaguar-detail.png"
    class="rounded"
  />

</section>
</div>

</div>

</template>