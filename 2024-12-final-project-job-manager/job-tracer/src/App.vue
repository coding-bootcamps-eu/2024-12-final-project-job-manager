<script setup>
import { RouterLink, RouterView } from 'vue-router';
import { useThemeStore } from '@/stores/themeStore';
import { computed } from 'vue';

const themeStore = useThemeStore();
const darkMode = computed(() => themeStore.darkMode);
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>

      <button @click="themeStore.toggleTheme" class="theme-button">
        <span v-if="darkMode">🌞</span>
        <span v-else>🌙</span>
      </button>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  padding: 20px;
  background-color: #f8f8f8;
}

.wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  background-color: #fff; /* Светлая тема по умолчанию */
}

nav {
  display: flex;
  gap: 20px;
}

.theme-button {
  padding: 5px 10px;
  font-size: 16px;
  cursor: pointer;
  background-color: #eee;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>