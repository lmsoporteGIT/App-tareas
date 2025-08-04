<template>
  <div class="logout-box" v-if="auth.user">
    <h2>Bienvenido, {{ auth.user.name }}</h2>
    <button @click="auth.logout()">Cerrar sesión</button>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore()
</script>

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
