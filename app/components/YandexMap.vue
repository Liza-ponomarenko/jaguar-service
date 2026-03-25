<template>
  <div ref="mapContainer" class="w-full h-full"></div>
</template>

<script setup>
const props = defineProps({
  coords: {
    type: Array,
    default: () => [47.2357, 39.7015]
  },
  zoom: {
    type: Number,
    default: 14
  }
})

const mapContainer = ref(null)
let map = null
let placemark = null

onMounted(() => {
  // Динамически загружаем API Яндекс.Карт
  if (!window.ymaps) {
    const script = document.createElement('script')
    script.src = `https://api-maps.yandex.ru/2.1/?apikey=12ac8e41-cdac-400f-a8f1-c218a0bd7d71&lang=ru_RU`
    script.onload = initMap
    document.head.appendChild(script)
  } else {
    initMap()
  }
})

const initMap = () => {
  window.ymaps.ready(() => {
    // Создаём карту
    map = new window.ymaps.Map(mapContainer.value, {
      center: props.coords,
      zoom: props.zoom,
      controls: ['zoomControl', 'fullscreenControl']
    })
    
    // Создаём кастомную иконку
    const placemarkLayout = window.ymaps.templateLayoutFactory.createClass(
      `<div style="position: relative;">
        <div style="background-color: #c41e3a; width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 20px rgba(196,30,58,0.5); border: 3px solid white; cursor: pointer; transition: transform 0.2s;">
          <svg width="24" height="24" viewBox="0 0 20 20" fill="white">
            <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
          </svg>
        </div>
        <div style="position: absolute; bottom: -8px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 10px solid transparent; border-right: 10px solid transparent; border-top: 12px solid #c41e3a;"></div>
      </div>`
    )
    
    // Создаём метку
    placemark = new window.ymaps.Placemark(props.coords, {
      hintContent: 'Jaguar Autoservice',
      balloonContent: `
        <div style="padding: 10px; font-family: Montserrat, sans-serif;">
          <h3 style="color: #c41e3a; margin: 0 0 8px 0; font-weight: bold;">Jaguar Autoservice</h3>
          <p style="margin: 0; color: #333;">Ростов-на-Дону, ул. Пескова, 17у</p>
          <p style="margin: 4px 0 0 0; color: #666; font-size: 12px;">Пн-Пт: 9:00 - 20:00</p>
        </div>
      `
    }, {
      iconLayout: placemarkLayout,
      iconShape: {
        type: 'Circle',
        coordinates: [24, 24],
        radius: 24
      }
    })
    
    map.geoObjects.add(placemark)
    
    // Отключаем скролл зума (чтобы страница прокручивалась нормально)
    map.behaviors.disable('scrollZoom')
  })
}

onBeforeUnmount(() => {
  if (map) {
    map.destroy()
  }
})
</script>