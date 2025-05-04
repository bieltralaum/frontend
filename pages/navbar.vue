<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.back()
}
</script>


<template>
    <nav>
    

    
    <div class="links">
        
      <NuxtLink to="calendar">Calendário</NuxtLink>
      <button @click="goBack" class="back-button">Voltar</button>
      
    </div>

    
  </nav>
    
  </template>
  
  <style scoped>

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #dce6e9;
  padding: 10px 20px;
  border-bottom: 2px solid #ccc;
}

.links {
  display: flex;
  gap: 20px;
  align-items: center;
  margin-left: auto; /* Empurra os links para a direita */
}

.nav-link {
  text-decoration: none;
  color: #28a745;
  font-weight: bold;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 15px;
}

.nav-link:hover {
  text-decoration: underline;
}
</style>
