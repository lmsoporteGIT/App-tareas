<script setup>
import TaskList from './components/TaskList.vue';
import AuthWrapper from './components/AuthWrapper.vue';


import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore()
</script>

<template>
  <header>
   <!-- <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />  -->

    <div class="wrapper">
      <AuthWrapper></AuthWrapper>
    </div>

  </header>

  <main>
    <TaskList/>
  </main>

</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {

    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
