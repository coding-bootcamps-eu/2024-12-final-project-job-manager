<template>
  <div class="about">
    <h1>About the Project</h1>
    <p>
      Job Tracker is a simple application designed to help users track their job applications.
      You can add, edit, and remove job entries, as well as keep notes on each application.
    </p>
    <p>
      The goal of this project is to provide an easy way to organize and manage job applications efficiently.
      этот следующий файл
    </p>
  </div>
</template>

<script>
import { defineComponent, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useLanguageStore } from "@/stores/languageStore";

export default defineComponent({
  name: "About",
  setup() {
    // Инициализируем i18n для использования переводов в шаблоне
    const { t } = useI18n();

    // Подключаем стор для отслеживания смены языка
    const languageStore = useLanguageStore();

    // Реагируем на смену языка (при необходимости можно добавить дополнительную логику)
    watch(
      () => languageStore.currentLanguage,
      (newLang, oldLang) => {
        console.log(`🌐 Язык в About.vue поменялся с ${oldLang} на ${newLang}`);
      }
    );

    // Возвращаем t для использования в шаблоне
    return { t };
  },
});
</script>

<style scoped>
.about {
  padding: 20px;
}
</style>
