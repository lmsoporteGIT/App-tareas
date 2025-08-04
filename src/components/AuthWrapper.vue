<template>
  <div>
    <Login v-if="!auth.user" />

    <Logout v-else />
  </div>

  <div v-if="!auth.user" >
    <Register></Register>
  </div>
  
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import Login from './Login.vue'
import Logout from './Logout.vue'
import Register from './Register.vue'

const auth = useAuthStore()
onMounted(() => {
  if (auth.token) auth.fetchUser()
})
</script>
