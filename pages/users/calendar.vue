<script setup>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { ref, onMounted } from 'vue'
import axios from 'axios'

const events = ref([])

const calendarOptions = ref({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  events: events.value,
  eventClick(info) {
    alert(`Guarda em ${info.event.start.toLocaleDateString()}\n\n${info.event.title}`)
  }
})

const fetchEvents = async () => {
  try {
    const [guardasRes, usuariosRes] = await Promise.all([
      axios.get('http://localhost:8000/Guarda/'),
      axios.get('http://localhost:8000/UsuarioGuarda/')
    ])

    const guardas = guardasRes.data.results
    const usuarios = usuariosRes.data.results

    const eventosFormatados = guardas.map(guarda => {
      const usuariosDaGuarda = usuarios.filter(u => u.id_guarda === guarda.id)

      const atiradores = usuariosDaGuarda
        .filter(u => !u.comandante)
        .map(u => `#${u.numero_atirador}`)
        .join(', ')

      const comandante = usuariosDaGuarda.find(u => u.comandante)

      const titulo = `Atiradores: ${atiradores}\nComandante: #${comandante?.numero_atirador || '---'}`

      return {
        title: titulo,
        start: guarda.data_guarda.split('T')[0]
      }
    })

    events.value = eventosFormatados
    calendarOptions.value.events = events.value

  } catch (error) {
    console.error('Erro ao carregar os eventos:', error)
  }
}


onMounted(fetchEvents)
</script>

<template>
  <div>
    <FullCalendar :options="calendarOptions" />
  </div>
</template>
