import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('authToken') || null,
    apiUrl: import.meta.env.VITE_APP_API_URL
  }),

  actions: {
    async login(email, password) {
      try {
        const response = await axios.post(`${this.apiUrl}/api/login`, { email, password })
        this.token = response.data.token
        localStorage.setItem('authToken', this.token)

        // Establece encabezado global para futuras peticiones
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`

        await this.fetchUser()
        return true
      } catch (error) {
        console.error("Login fallido:", error.response?.data || error.message)
        return false
      }
    },

    async fetchUser() {
      if (!this.token) return

      try {
        // Establece el token en la petición actual
        const response = await axios.get(`${this.apiUrl}/api/user`, {
          headers: { Authorization: `Bearer ${this.token}` }
        })
        this.user = response.data
      } catch (error) {
        console.warn("Error al obtener usuario:", error.response?.data || error.message)
        this.logout()
      }
    },

    async logout() {
      try {
        await axios.post(`${this.apiUrl}/api/logout`, {}, {
          headers: { Authorization: `Bearer ${this.token}` }
        })
        console.log('cerrando usuario')
      } catch (error) {
        console.warn("Error al cerrar sesión:", error.response?.data || error.message)
      }

      this.token = null
      this.user = null
      localStorage.removeItem('authToken')
      delete axios.defaults.headers.common['Authorization']
    },

    async register(name, email, password, password_confirmation) {
      try {
        const response = await axios.post(`${this.apiUrl}/api/register`, {
          name, email, password, password_confirmation
        })

        this.token = response.data.token
        localStorage.setItem('authToken', this.token)
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`

        await this.fetchUser()
        return true
      } catch (error) {
        console.error("Error en el registro:", error.response?.data || error.message)
        return false
      }
    }
  }
})