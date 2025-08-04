<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const email = ref('')
const password = ref('')
const error = ref('')

const login = async () => {
  const ok = await auth.login(email.value, password.value)
  if (!ok) error.value = 'Credenciales inválidas'
}
</script>


<template>
  <form @submit.prevent="login">
    <h2>Iniciar Sesión</h2>
    <input v-model="email" type="email" placeholder="Correo electrónico" required />
    <input v-model="password" type="password" placeholder="Contraseña" required />
    <button>Login</button>
    <p v-if="error">{{ error }}</p>
  </form>
</template>



<style scoped>
form,
.logout-box {
  background-color: #ffffff;
  border: 1px solid #ccc;
  padding: 2rem;
  border-radius: 12px;
  width: 300px;
  margin: 2rem auto;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  text-align: center;
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
}

button:hover {
  background-color: #35495e;
}

p {
  color: #ff4444;
  margin-top: 1rem;
}

</style>
