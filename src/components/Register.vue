<template>
  <div class="register-wrapper">
    <div v-if="!showForm">
      <button class="link" @click="showForm = true">Register</button>
    </div>

    <form v-else @submit.prevent="handleRegister">
      <h2>Crear Cuenta</h2>
      <input v-model="name" placeholder="Nombre completo" required />
      <input v-model="email" type="email" placeholder="Correo electrónico" required />
      <input v-model="password" type="password" placeholder="Contraseña" required />
      <input v-model="password_confirmation" type="password" placeholder="Confirmar contraseña" required />
      <button>Registrar</button>
      <p v-if="error">{{ error }}</p>

      <div><button class="link" @click="showForm = false">cerrar</button></div>
      
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

const showForm = ref(false)
const name = ref('')
const email = ref('')
const password = ref('')
const password_confirmation = ref('')
const error = ref('')

const handleRegister = async () => {
  error.value = ''
  if (password.value !== password_confirmation.value) {
    error.value = 'Las contraseñas no coinciden.'
    return
  }

  const ok = await auth.register(
    name.value,
    email.value,
    password.value,
    password_confirmation.value
  )

  if (!ok) {
    error.value = 'No se pudo registrar. Revisa los datos.'
  } else {
    console.log("usuario creado")
    // ✅ Limpiar campos
    name.value = ''
    email.value = ''
    password.value = ''
    password_confirmation.value = ''
    // ✅ Ocultar el formulario
    showForm.value = false
  }
}
</script>

<style scoped>
.register-wrapper {
  text-align: center;
  margin-top: 2rem;
}

form {
  background-color: #fff;
  border: 1px solid #ccc;
  padding: 2rem;
  border-radius: 12px;
  width: 300px;
  margin: 2rem auto;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

input {
  display: block;
  width: 100%;
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

button {
  background-color: #42b883;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 10px;
}

button:hover {
  background-color: #35495e;
}

button.link {
  background: none;
  color: #42b883;
  border: none;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  text-decoration: underline;
}

p {
  color: #ff4444;
  margin-top: 1rem;
}
</style>
