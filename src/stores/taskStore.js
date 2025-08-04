import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from './auth'

export const useTaskStore = defineStore('task', {
  state: () => ({
    tasks: [],
    newTask: '',
    newTaskDate: '',
    isLoading: false,
    idModificar: 0,
    modificarActivo: false
  }),

  actions: {
    async getTasks() {
      const auth = useAuthStore()
      const token = auth.token || localStorage.getItem('authToken')

      if (!token) {
        console.warn('Token no disponible')
        return
      }

      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/api/me/tasks`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        this.tasks = response.data
        this.isLoading = true
        console.log('Tareas cargadas')
      } catch (error) {
        console.error('Error al obtener tareas:', error.response?.data || error.message)
      }
    },

    async addTask() {
      const auth = useAuthStore()
      const token = auth.token || localStorage.getItem('authToken')

      if (!token) return

      try {
        const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}/api/me/tasks`, {
          task: this.newTask,
          completed: false,
          date: this.newTaskDate
        }, {
          headers: { Authorization: `Bearer ${token}` }
        })

        this.tasks.push(response.data)
        this.newTask = ''
        this.newTaskDate = ''
        console.log('Tarea agregada')
      } catch (error) {
        console.error('Error al agregar tarea:', error.response?.data || error.message)
      }
    },

    // Tachar tarea
    async tacharTask(task) {
      const auth = useAuthStore()
      const token = auth.token || localStorage.getItem('authToken')

      try {
        await axios.put(`${import.meta.env.VITE_APP_API_URL}/api/tasks/${task.id}`, task, {
          headers: { Authorization: `Bearer ${token}` }
        })
        console.log('Tarea tachada')
      } catch (error) {
        console.error('Error al tachar tarea:', error.response?.data || error.message)
      }
    },


    // Modificar tarea
    async modificarTask() {
      console.log('Grabando modificación de tarea....')
      console.log("Mi id : "+this.idModificar)
      console.log(this.newTask)
      console.log(this.newTaskDate)

      const auth = useAuthStore()
      const token = auth.token || localStorage.getItem('authToken')

      try {
        await axios.put(`${import.meta.env.VITE_APP_API_URL}/api/modificar/${this.idModificar}`, {
          task: this.newTask,
          completed: false,
          date: this.newTaskDate
        }, {
          headers: { Authorization: `Bearer ${token}` }
        })
        console.log('Tarea modificada')

        this.newTask = ''
        this.newTaskDate = ''
        this.idModificar = 0
        this.tasks.forEach(t => {
          this.modificarActivo = false
        })
        this.getTasks()

      } catch (error) {
        console.error('Error al modificar la tarea:', error.response?.data || error.message)
      }


      return
    },

    async deleteTask(id) {
      const auth = useAuthStore()
      const token = auth.token || localStorage.getItem('authToken')

      try {
        await axios.delete(`${import.meta.env.VITE_APP_API_URL}/api/tasks/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        this.tasks = this.tasks.filter(task => task.id !== id)
        
        console.log('Tarea eliminada')
        this.newTask = ''
        this.newTaskDate = ''
        this.idModificar = 0
        this.tasks.forEach(t => {
          this.modificarActivo = false
        })
        this.getTasks()
        
      } catch (error) {
        console.error('Error al eliminar tarea:', error.response?.data || error.message)
      }
    },

  }
})