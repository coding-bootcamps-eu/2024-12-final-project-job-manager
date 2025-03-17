import { defineStore } from 'pinia';
import { ref } from 'vue';
import i18n from '../i18n.js'; // Убедитесь, что путь правильный

export const useLanguageStore = defineStore('language', () => {
  const currentLanguage = ref('ru');

  const setLanguage = (lang) => {
    if (['ru', 'en', 'de'].includes(lang)) {
      currentLanguage.value = lang;
      // Если используете Vue I18n v9, обновляем значение через .value
      i18n.global.locale.value = lang;
      try {
        localStorage.setItem('language', lang);
        console.log(`🌐 Язык изменен на: ${lang}`);
      } catch (e) {
        console.warn('Не удалось сохранить язык в localStorage:', e);
      }
    } else {
      console.warn(`Язык ${lang} не поддерживается`);
    }
  };

  const initLanguage = () => {
    try {
      const savedLanguage = localStorage.getItem('language');
      if (savedLanguage && ['ru', 'en', 'de'].includes(savedLanguage)) {
        setLanguage(savedLanguage);
      }
    } catch (e) {
      console.warn('Не удалось загрузить язык из localStorage:', e);
    }
  };

  return { currentLanguage, setLanguage, initLanguage };
});
