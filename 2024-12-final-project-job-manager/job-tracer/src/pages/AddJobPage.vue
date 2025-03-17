<template>
  <div class="add-job-page">
    <h1>Добавить вакансию</h1>
    <button @click="openModal" class="open-modal-button">
      Открыть форму добавления
    </button>

    <div v-if="isModalOpen" class="modal-overlay">
      <div class="modal-content">
        <button @click="closeModal" class="close-button">×</button>
        <AddJob @job-added="handleJobAdded" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import AddJob from "@/pages/AddJob.vue";
import { useJobStore } from "@/stores/jobStore";
import { useI18n } from "vue-i18n"; // добавлено для поддержки i18n
// При необходимости можно импортировать languageStore для отслеживания смены языка:
// import { useLanguageStore } from "@/stores/languageStore";

const { t } = useI18n();
// const languageStore = useLanguageStore(); // если нужно отслеживать изменения языка

const jobStore = useJobStore();
const isModalOpen = ref(false);

const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const handleJobAdded = async () => {
  console.log("✅ Вакансия добавлена! Обновляем список...");
  await jobStore.fetchJobs();
  closeModal();
};

// Если нужно реагировать на смену языка, можно добавить watch:
// watch(() => languageStore.currentLanguage, (newLang, oldLang) => {
//   console.log(`Язык изменился с ${oldLang} на ${newLang}`);
//   // Дополнительная логика при смене языка, если требуется
// });
</script>

<style scoped>
.add-job-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
  background-color: #fff;
  color: #333;
  transition: background-color 0.2s, color 0.2s;
}

.dark .add-job-page {
  background-color: #222;
  color: #fff;
}

.open-modal-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.open-modal-button:hover {
  background-color: #0056b3;
}

.dark .open-modal-button {
  background-color: #0056b3;
}

.dark .open-modal-button:hover {
  background-color: #003d7a;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  position: relative;
  max-width: 500px;
  width: 90%;
}

.dark .modal-content {
  background-color: #333;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

.dark .close-button {
  color: #bbb;
}

.close-button:hover {
  color: #000;
}

.dark .close-button:hover {
  color: #fff;
}
</style>
