import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export const useThemeStore = defineStore('theme', () => {
  const darkMode = ref(localStorage.getItem('darkMode') === 'true');
  console.log('Initial darkMode:', darkMode.value); // Для отладки

  const toggleTheme = () => {
    darkMode.value = !darkMode.value;
    localStorage.setItem('darkMode', darkMode.value);
    console.log('Dark mode toggled to:', darkMode.value);
  };

  watch(darkMode, (newVal) => {
    if (document.body) {
      document.body.classList.toggle('dark-theme', newVal);
    } else {
      console.warn('Document body is not available yet');
    }
  }, { immediate: true });

  return { darkMode, toggleTheme };
});