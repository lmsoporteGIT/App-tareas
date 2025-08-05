<script setup>
import { useTaskStore } from '@/stores/taskStore'
import { watch, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const taskStore = useTaskStore()

watch(() => auth.user, async (newUser) => {
  if (newUser && auth.token) {
    console.log('Autenticado con token. Cargando tareas...')
    await taskStore.getTasks()
  }
}, { immediate: false })

function formatDateFromString(dateStr) {
  if (!dateStr) return ''
  const [year, month, day] = dateStr.split('-')
  return `${parseInt(day)}-${parseInt(month)}-${year}`
}

function getTaskStatus(dateStr) {
  if (!dateStr) return 'no-date'

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [year, month, day] = dateStr.split('-').map(Number)
  if (!year || !month || !day) return 'no-date'

  const taskDate = new Date(year, month - 1, day)
  taskDate.setHours(0, 0, 0, 0)

  if (taskDate < today) return 'past'
  if (taskDate.getTime() === today.getTime()) return 'today'
  return 'future'
}

const sortedTasks = computed(() => {
  return [...taskStore.tasks].sort((a, b) => {
    if (!a.date && !b.date) return 0
    if (!a.date) return -1
    if (!b.date) return 1
    return a.date.localeCompare(b.date)
  })
})

// ✅ Alternar tarea en barra y cambiar ícono
function mostrarBarraTask(task) {
  // Desactivar todos los íconos
  taskStore.tasks.forEach(t => {
    if (t.modificarActivo) t.modificarActivo = false
  })

  const esMismaTarea = taskStore.idModificar === task.id

  // Si se vuelve a presionar la misma, se desactiva
  if (esMismaTarea) {
    taskStore.newTask = ''
    taskStore.newTaskDate = ''
    taskStore.idModificar = 0
    task.modificarActivo = false
  } else {
    taskStore.newTask = task.task
    taskStore.newTaskDate = task.date ? task.date.slice(0, 10) : null;
    //taskStore.newTaskDate = task.date.slice(0, 10)
    taskStore.idModificar = task.id
    task.modificarActivo = true
  }
  console.log('Modificando:', task.id, task.task)
}


// Modificación de la fecha
  function modificarFecha(task, event) {
    const nuevaFecha = event.target.value;
    console.log('Nueva fecha:', nuevaFecha);
    task.date = nuevaFecha + 'T00:00:00';
    taskStore.tacharTask(task)
  }
</script>

<template>
  <div class="todo-container" v-if="auth.user && taskStore.isLoading">
    <h1 class="title">Tareas</h1>

    <div class="task-input-group">
    <input
      type="text"
      v-model="taskStore.newTask"
      placeholder="Agregar una tarea"
      class="task-input"
      maxlength="30"
    />
      <input
        type="date"
        v-model="taskStore.newTaskDate"
        class="task-date-input"
        onkeydown="return false"
      />

      <!-------  boton agregar Tarea              -->
      <button
        v-show="taskStore.idModificar == 0"
        @click="taskStore.addTask"
        class="task-add-btn"
      >
        ➕
      </button>

       <!-------  boton modificar Tarea              -->
      <button
        v-show="taskStore.idModificar > 0"
        @click="taskStore.modificarTask"
        class="task-modificar-btn"
      >
        <img src="https://cdn-icons-png.flaticon.com/512/1828/1828911.png" alt="Modificar" />
      </button>
    </div>

    <ul class="task-list">
      <li v-for="task in sortedTasks" :key="task.id" class="task-item">
        <!-------  tachar Tarea               -->
        <input
          title="tachar"
          type="checkbox"
          v-model="task.completed"
          @change="taskStore.tacharTask(task)"
          class="task-checkbox"
        />
        <span
          :class="[
            'task-label',
            task.completed ? 'completed' : getTaskStatus(task.date?.split('T')[0] || '')
          ]"
        >
          {{ task.task }}
          <small v-if="task.date">
            [{{ formatDateFromString(task.date.split('T')[0]) }})

            <!-------  modificación de la fecha              -->            
            <input
              class="task-date-list"
              type="date"
              :value="task.date.split('T')[0]"
              @change="modificarFecha(task, $event)"
            />
          </small>
        </span>

        <button
          v-if="task.completed"
          title="Eliminar"
          @click="taskStore.deleteTask(task.id)"
          class="btn-eliminar"
        >
          <img src="https://cdn-icons-png.flaticon.com/512/1214/1214428.png" alt="Eliminar" />
        </button>

        <!--  Boton modificar y mostrarBarraTask      --> 
        <button
          v-if="!task.completed"
          title="Modificar"
          @click="mostrarBarraTask(task)"
          class="btn-modificar"
        >
        <img
          src="https://cdn-icons-png.flaticon.com/512/1828/1828911.png"
          :class="{ 'activo': task.modificarActivo }"
          alt="Modificar"
        />
        </button>
        
      </li>
    </ul>

    <div><br>
      <span class="no-date">sin fecha</span> <span> | </span>
      <span class="past">vencida</span> <span> | </span>
      <span class="today">hoy</span> <span> | </span>
      <span class="future">posterior</span>
    </div>
  </div>
</template>