<script setup>
import { RouterLink, RouterView } from 'vue-router';
import { useThemeStore } from '@/stores/themeStore.js';
import { useLanguageStore } from '@/stores/languageStore.js';
import { computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

const themeStore = useThemeStore();
const languageStore = useLanguageStore();
const darkMode = computed(() => themeStore.darkMode);
const { t } = useI18n();

onMounted(() => {
  languageStore.initLanguage();
  themeStore.applyTheme();
});
</script>

<template>
  <header :class="{ dark: darkMode }">
    <div class="wrapper">
      <div class="logo">
        <span class="logo-icon">📋</span>
        <span class="logo-text">{{ t('title') }}</span>
      </div>

      <nav>
        <RouterLink to="/">{{ t('home') }}</RouterLink>
        <RouterLink to="/about">{{ t('about') }}</RouterLink>
        <RouterLink to="/add">{{ t('addJob') }}</RouterLink>
      </nav>

      <div class="controls">
        <select 
          v-model="languageStore.currentLanguage" 
          @change="languageStore.setLanguage(languageStore.currentLanguage)"
        >
          <option value="ru">🇷🇺 Русский</option>
          <option value="en">🇬🇧 English</option>
          <option value="de">🇩🇪 Deutsch</option>
        </select>

        <button @click="themeStore.toggleTheme" class="theme-button">
          <span v-if="darkMode">🌞</span>
          <span v-else>🌙</span>
        </button>
      </div>
    </div>
  </header>

  <main>
    <RouterView />
  </main>
</template>

<style scoped>
header {
  padding: 15px 0;
  background-color: #f8f9fa;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: background-color 0.3s;
}

header.dark {
  background-color: #1a1a1a;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}

.wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-icon {
  font-size: 24px;
}

.logo-text {
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.dark .logo-text {
  color: #fff;
}

nav {
  display: flex;
  gap: 25px;
}

nav a {
  text-decoration: none;
  color: #333;
  font-weight: 600;
  font-size: 16px;
  padding: 8px 12px;
  border-radius: 5px;
  transition: color 0.2s, background-color 0.2s;
}

nav a.router-link-active {
  color: #fff;
  background-color: #007bff;
}

header.dark nav a {
  color: #ddd;
}

header.dark nav a.router-link-active {
  color: #fff;
  background-color: #ffcc00;
}

.controls {
  display: flex;
  gap: 15px;
  align-items: center;
}

.controls select {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #fff;
  color: #333;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s, border-color 0.3s;
}

header.dark .controls select {
  background-color: #333;
  color: #ddd;
  border-color: #555;
}

.controls select:hover {
  border-color: #007bff;
}

header.dark .controls select:hover {
  border-color: #ffcc00;
}

.theme-button {
  padding: 8px 12px;
  font-size: 16px;
  cursor: pointer;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 5px;
  transition: background-color 0.3s, border-color 0.3s;
}

header.dark .theme-button {
  background-color: #333;
  border-color: #555;
  color: #ddd;
}

.theme-button:hover {
  background-color: #f0f0f0;
  border-color: #007bff;
}

header.dark .theme-button:hover {
  background-color: #444;
  border-color: #ffcc00;
}

main {
  min-height: calc(100vh - 100px);
  padding: 20px;
  background-color: #f5f5f5;
  transition: background-color 0.3s;
}

.dark main {
  background-color: #121212;
}
</style>
