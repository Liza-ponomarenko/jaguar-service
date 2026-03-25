<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'

const isLogin = ref(true)
const showForgot = ref(false)
const isLoading = ref(false)
const errors = ref<Record<string, string>>({})

const form = reactive({
  email: '',
  password: '',
  fullName: '',
  phone: '',
  region: '',
  city: ''
})

const forgotForm = reactive({
  email: ''
})

// Список регионов России
const regions = [
  'Москва', 'Санкт-Петербург', 'Алтайский край', 'Амурская область', 'Архангельская область',
  'Астраханская область', 'Башкортостан', 'Белгородская область', 'Брянская область',
  'Бурятия', 'Владимирская область', 'Волгоградская область', 'Вологодская область',
  'Воронежская область', 'Дагестан', 'Еврейская автономная область', 'Забайкальский край',
  'Ивановская область', 'Ингушетия', 'Иркутская область', 'Кабардино-Балкария',
  'Калининградская область', 'Калмыкия', 'Калужская область', 'Камчатский край',
  'Карачаево-Черкессия', 'Карелия', 'Кемеровская область', 'Кировская область',
  'Коми', 'Костромская область', 'Краснодарский край', 'Красноярский край',
  'Курганская область', 'Курская область', 'Ленинградская область', 'Липецкая область',
  'Магаданская область', 'Марий Эл', 'Мордовия', 'Московская область', 'Мурманская область',
  'Ненецкий автономный округ', 'Нижегородская область', 'Новгородская область',
  'Новосибирская область', 'Омская область', 'Оренбургская область', 'Орловская область',
  'Пензенская область', 'Пермский край', 'Приморский край', 'Псковская область',
  'Ростовская область', 'Рязанская область', 'Самарская область', 'Саратовская область',
  'Саха (Якутия)', 'Сахалинская область', 'Свердловская область', 'Северная Осетия',
  'Смоленская область', 'Ставропольский край', 'Тамбовская область', 'Татарстан',
  'Тверская область', 'Томская область', 'Тульская область', 'Тыва', 'Тюменская область',
  'Удмуртия', 'Ульяновская область', 'Хабаровский край', 'Хакасия', 'Ханты-Мансийский автономный округ',
  'Челябинская область', 'Чечня', 'Чувашия', 'Чукотский автономный округ',
  'Ямало-Ненецкий автономный округ', 'Ярославская область', 'Севастополь', 'Крым'
]

// Города по регионам (упрощённый набор для примера)
const citiesByRegion: Record<string, string[]> = {
  'Москва': ['Москва'],
  'Санкт-Петербург': ['Санкт-Петербург'],
  'Московская область': ['Балашиха', 'Подольск', 'Химки', 'Королёв', 'Мытищи', 'Люберцы', 'Красногорск', 'Одинцово', 'Домодедово', 'Сергиев Посад'],
  'Краснодарский край': ['Краснодар', 'Сочи', 'Новороссийск', 'Анапа', 'Геленджик', 'Армавир', 'Туапсе', 'Ейск'],
  'Свердловская область': ['Екатеринбург', 'Нижний Тагил', 'Каменск-Уральский', 'Первоуральск', 'Серов'],
  'Нижегородская область': ['Нижний Новгород', 'Дзержинск', 'Арзамас', 'Саров', 'Бор'],
  'Самарская область': ['Самара', 'Тольятти', 'Сызрань', 'Новокуйбышевск'],
  'Ростовская область': ['Ростов-на-Дону', 'Таганрог', 'Шахты', 'Волгодонск', 'Новочеркасск'],
  'Челябинская область': ['Челябинск', 'Магнитогорск', 'Златоуст', 'Миасс', 'Копейск'],
  'Татарстан': ['Казань', 'Набережные Челны', 'Нижнекамск', 'Альметьевск', 'Зеленодольск'],
  'Башкортостан': ['Уфа', 'Стерлитамак', 'Салават', 'Нефтекамск', 'Октябрьский'],
  'Новосибирская область': ['Новосибирск', 'Бердск', 'Искитим', 'Куйбышев', 'Барабинск'],
  'Приморский край': ['Владивосток', 'Находка', 'Уссурийск', 'Артём', 'Спасск-Дальний'],
  'Волгоградская область': ['Волгоград', 'Волжский', 'Камышин', 'Михайловка', 'Урюпинск'],
  'Воронежская область': ['Воронеж', 'Борисоглебск', 'Россошь', 'Лиски', 'Павловск'],
  'Красноярский край': ['Красноярск', 'Ачинск', 'Канск', 'Железногорск', 'Норильск'],
  'Пермский край': ['Пермь', 'Березники', 'Лысьва', 'Краснокамск', 'Чайковский'],
  'Саратовская область': ['Саратов', 'Энгельс', 'Балаково', 'Балашов', 'Вольск'],
  'Иркутская область': ['Иркутск', 'Братск', 'Ангарск', 'Усть-Илимск', 'Усолье-Сибирское'],
  'Алтайский край': ['Барнаул', 'Бийск', 'Рубцовск', 'Новоалтайск', 'Заринск'],
  'Омская область': ['Омск', 'Тара', 'Исилькуль', 'Калачинск', 'Называевск'],
  'Хабаровский край': ['Хабаровск', 'Комсомольск-на-Амуре', 'Амурск', 'Советская Гавань'],
  'Тюменская область': ['Тюмень', 'Тобольск', 'Ишим', 'Ялуторовск', 'Заводоуковск'],
  'Ленинградская область': ['Гатчина', 'Всеволожск', 'Сосновый Бор', 'Тихвин', 'Кириши'],
  'default': ['Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург', 'Казань', 'Нижний Новгород', 'Челябинск', 'Самара', 'Омск', 'Ростов-на-Дону', 'Уфа', 'Красноярск', 'Воронеж', 'Пермь', 'Волгоград']
}

// Поисковые запросы для фильтрации
const regionSearch = ref('')
const citySearch = ref('')
const showRegionDropdown = ref(false)
const showCityDropdown = ref(false)

// Фильтрованные списки
const filteredRegions = computed(() => {
  if (!regionSearch.value) return regions
  return regions.filter(r => r.toLowerCase().includes(regionSearch.value.toLowerCase()))
})

const filteredCities = computed((): string[] => {
  const availableCities = citiesByRegion[form.region] || citiesByRegion['default'] || []
  if (!citySearch.value) return availableCities
  return availableCities.filter(c => c.toLowerCase().includes(citySearch.value.toLowerCase()))
})

// Сброс города при смене региона
watch(() => form.region, () => {
  form.city = ''
  citySearch.value = ''
})

// Выбор из списка
const selectRegion = (region: string) => {
  form.region = region
  regionSearch.value = region
  showRegionDropdown.value = false
}

const selectCity = (city: string) => {
  form.city = city
  citySearch.value = city
  showCityDropdown.value = false
}

// Валидация
const validateForm = () => {
  errors.value = {}
  
  if (!form.email || !form.email.includes('@')) {
    errors.value.email = 'Введите корректный email'
  }
  
  if (!form.password || form.password.length < 6) {
    errors.value.password = 'Пароль должен быть не менее 6 символов'
  }
  
  if (!isLogin.value) {
    if (!form.fullName || form.fullName.length < 2) {
      errors.value.fullName = 'Введите полное имя'
    }
    
    if (!form.phone || form.phone.length < 10) {
      errors.value.phone = 'Введите корректный телефон'
    }
    
    if (!form.region) {
      errors.value.region = 'Выберите регион'
    }
    
    if (!form.city) {
      errors.value.city = 'Выберите город'
    }
  }
  
  return Object.keys(errors.value).length === 0
}

const submit = async () => {
  if (!validateForm()) return
  
  isLoading.value = true
  try {
    if (isLogin.value) {
      await $fetch('/api/auth/login', {
        method: 'POST',
        body: {
          email: form.email,
          password: form.password
        }
      })
      alert('Вход выполнен')
    } else {
      await $fetch('/api/auth/register', {
        method: 'POST',
        body: form
      })
      alert('Регистрация успешна')
      isLogin.value = true
    }
  } catch (e: any) {
    alert(e.statusMessage || 'Произошла ошибка')
  } finally {
    isLoading.value = false
  }
}

const forgotPassword = async () => {
  if (!forgotForm.email || !forgotForm.email.includes('@')) {
    alert('Введите корректный email')
    return
  }
  
  isLoading.value = true
  try {
    const res = await $fetch<{ message: string }>('/api/auth/forgot', {
      method: 'POST',
      body: { email: forgotForm.email }
    })
    alert(res.message)
    showForgot.value = false
    forgotForm.email = ''
  } catch (e: any) {
    alert(e.statusMessage || 'Ошибка отправки')
  } finally {
    isLoading.value = false
  }
}

// Закрытие dropdown при клике вне
const regionInputRef = ref<HTMLDivElement>()
const cityInputRef = ref<HTMLDivElement>()

onClickOutside(regionInputRef, () => {
  showRegionDropdown.value = false
  if (!form.region) regionSearch.value = ''
})

onClickOutside(cityInputRef, () => {
  showCityDropdown.value = false
  if (!form.city) citySearch.value = ''
})
</script>

<template>
  <div class="max-w-md mx-auto p-8">
    <!-- Форма входа/регистрации -->
    <template v-if="!showForgot">
      <h2 class="text-2xl font-bold mb-4">
        {{ isLogin ? 'Вход' : 'Регистрация' }}
      </h2>

      <div class="space-y-3">
        <label class="block text-sm font-medium mb-1">Email *</label>
        <!-- Email -->
        <div>
          <input 
            v-model="form.email" 
            placeholder="Email" 
            class="input"
            :class="{ 'border-red-500': errors.email }"
          />
          <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</p>
        </div>

        <!-- Password -->
        <div>
          <label class="block text-sm font-medium mb-1">Пароль *</label>
          <input 
            v-model="form.password" 
            type="password" 
            placeholder="Пароль" 
            class="input"
            :class="{ 'border-red-500': errors.password }"
          />
          <p v-if="errors.password" class="text-red-500 text-sm mt-1">{{ errors.password }}</p>
        </div>

        <!-- Поля регистрации -->
        <template v-if="!isLogin">
          <!-- ФИО -->
          <div>
            <label class="block text-sm font-medium mb-1">ФИО *</label>
            <input 
              v-model="form.fullName" 
              placeholder="ФИО" 
              class="input"
              :class="{ 'border-red-500': errors.fullName }"
            />
            <p v-if="errors.fullName" class="text-red-500 text-sm mt-1">{{ errors.fullName }}</p>
          </div>

          <!-- Телефон -->
          <div>
            <label class="block text-sm font-medium mb-1">Телефон *</label>
            <input 
              v-model="form.phone" 
              placeholder="Телефон" 
              class="input"
              :class="{ 'border-red-500': errors.phone }"
            />
            <p v-if="errors.phone" class="text-red-500 text-sm mt-1">{{ errors.phone }}</p>
          </div>

          <!-- Регион с поиском -->
          <div class="relative" ref="regionInputRef">
            <label class="block text-sm font-medium mb-1">Область / край / республика *</label>
            <input
              v-model="regionSearch"
              @focus="showRegionDropdown = true"
              @input="showRegionDropdown = true"
              placeholder="Начните вводить регион..."
              class="input"
              :class="{ 'border-red-500': errors.region }"
            />
            <p v-if="errors.region" class="text-red-500 text-sm mt-1">{{ errors.region }}</p>
            
            <!-- Dropdown регионов -->
            <div 
              v-if="showRegionDropdown && filteredRegions.length > 0" 
              class="absolute z-50 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto shadow-lg"
            >
              <div
                v-for="region in filteredRegions"
                :key="region"
                @click="selectRegion(region)"
                class="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-0"
                :class="{ 'bg-blue-50': form.region === region }"
              >
                {{ region }}
              </div>
            </div>
            <div 
              v-if="showRegionDropdown && filteredRegions.length === 0" 
              class="absolute z-50 w-full bg-white border border-gray-300 rounded-md mt-1 p-4 text-gray-500 shadow-lg"
            >
              Ничего не найдено
            </div>
          </div>

          <!-- Город с поиском -->
          <div class="relative" ref="cityInputRef">
            <label class="block text-sm font-medium mb-1">Город *</label>
            <input
              v-model="citySearch"
              @focus="form.region && (showCityDropdown = true)"
              @input="form.region && (showCityDropdown = true)"
              placeholder="Начните вводить город..."
              class="input"
              :class="{ 'border-red-500': errors.city, 'bg-gray-100': !form.region }"
              :disabled="!form.region"
            />
            <p v-if="errors.city" class="text-red-500 text-sm mt-1">{{ errors.city }}</p>
            <p v-if="!form.region" class="text-gray-400 text-sm mt-1">Сначала выберите регион</p>
            
            <!-- Dropdown городов -->
            <div 
              v-if="showCityDropdown && filteredCities.length > 0 && form.region" 
              class="absolute z-50 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto shadow-lg"
            >
              <div
                v-for="city in filteredCities"
                :key="city"
                @click="selectCity(city)"
                class="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-0"
                :class="{ 'bg-blue-50': form.city === city }"
              >
                {{ city }}
              </div>
            </div>
            <div 
              v-if="showCityDropdown && filteredCities.length === 0 && form.region" 
              class="absolute z-50 w-full bg-white border border-gray-300 rounded-md mt-1 p-4 text-gray-500 shadow-lg"
            >
              Ничего не найдено
            </div>
          </div>
        </template>

        <!-- Кнопка отправки -->
        <button 
          @click="submit" 
          class="bg-black text-white px-4 py-2 w-full mt-4 rounded hover:bg-gray-800 transition disabled:opacity-50"
          :disabled="isLoading"
        >
          <span v-if="isLoading">Загрузка...</span>
          <span v-else>{{ isLogin ? 'Войти' : 'Зарегистрироваться' }}</span>
        </button>

        <!-- Забыли пароль -->
        <button
          v-if="isLogin"
          @click="showForgot = true"
          class="text-sm underline mt-2 block text-gray-600 hover:text-black"
        >
          Забыли пароль?
        </button>

        <!-- Переключение режима -->
        <button
          class="text-sm mt-4 underline block w-full text-center text-gray-600 hover:text-black"
          @click="isLogin = !isLogin"
        >
          {{ isLogin ? 'Создать аккаунт' : 'Уже есть аккаунт' }}
        </button>
      </div>
    </template>

    <!-- Форма восстановления пароля -->
    <template v-else>
      <h2 class="text-2xl font-bold mb-4">Восстановление пароля</h2>
      
      <div class="space-y-3">
        <div>
          <input 
            v-model="forgotForm.email" 
            placeholder="Введите ваш Email" 
            class="input"
          />
        </div>

        <button 
          @click="forgotPassword" 
          class="bg-black text-white px-4 py-2 w-full mt-4 rounded hover:bg-gray-800 transition disabled:opacity-50"
          :disabled="isLoading"
        >
          <span v-if="isLoading">Отправка...</span>
          <span v-else>Отправить инструкцию</span>
        </button>

        <button
          @click="showForgot = false"
          class="text-sm underline mt-4 block w-full text-center text-gray-600 hover:text-black"
        >
          Вернуться к входу
        </button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.input {
  @apply border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent;
}
</style>