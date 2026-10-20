<script setup>
import { ref } from 'vue';
import fun from '@/services/api';
import { useRouter } from 'vue-router';

const router = useRouter()

const users = ref([]);
const errorMessage = ref('');

const modelo = defineModel()

async function fecthUsers() {

  try {
    const data = await fun.getUsers()
    users.value = data
  } catch (e) {
    errorMessage.value = 'Não foi possivel carregar os usuarios'
    console.error(e);
  }
}

const handleLogout = () => {
  localStorage.clear()
  router.push({name: 'login'})
}

</script>

<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
  <div class="navbar-item">
    <h2 class="is-size-4">Vue List Of Posts</h2>
  </div>
  <div class="navbar-end">
    <div class="navbar-item">
      <div class="buttons">
        <div class="mr-5 mb-2">
          <p>{{`User: ${modelo?.name}`}}</p>
        </div>

        <a @click="handleLogout" class="button is-light"> Logout </a>
      </div>
    </div>
  </div>
</nav>
</template>
