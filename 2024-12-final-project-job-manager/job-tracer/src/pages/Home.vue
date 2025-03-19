<template>
  <div class="job-tracker-home">
    <!-- Показываем детальный просмотр вакансии, если она выбрана -->
    <div v-if="selectedJob" class="job-view-container">
      <div class="back-button-container">
        <button @click="selectedJob = null" class="back-button">
          &larr; {{ t('backToList') }}
        </button>
      </div>
      <JobView 
        :job="selectedJob" 
        @update="updateJob"
        @delete="handleRemoveJob"
      />
    </div>
    
    <!-- Показываем список вакансий, если ничего не выбрано -->
    <div v-else>
      <div class="header-section">
        <h1>{{ t('title') }}</h1>
        <div class="filter-controls">
          <select v-model="statusFilter" class="status-filter">
            <option value="all">{{ t('allStatuses') }}</option>
            <option value="sent">{{ t('sent') }}</option>
            <option value="interview">{{ t('interview') }}</option>
            <option value="rejected">{{ t('rejected') }}</option>
            <option value="accepted">{{ t('accepted') }}</option>
          </select>
  
          <input
            v-model="searchQuery"
            :placeholder="t('searchPlaceholder')"
            class="search-input"
          />
        </div>
      </div>
  
      <div v-if="loading" class="loading-indicator">{{ t('loading') }}</div>
  
      <div v-else-if="errorMessage" class="error-message">
        {{ errorMessage }}
        <button @click="fetchJobs" class="retry-button">{{ t('retry') }}</button>
      </div>
  
      <div v-else-if="filteredJobs.length" class="jobs-list">
        <JobCard
          v-for="job in filteredJobs"
          :key="job.id"
          :job="job"
          @click="selectJob(job)"
          @remove="handleRemoveJob"
          @update-status="handleStatusUpdate"
        />
      </div>
  
      <div v-else class="empty-state">
        <p v-if="statusFilter !== 'all' || searchQuery">
          {{ t('noJobsWithFilters') }}
        </p>
        <p v-else>
          {{ t('noJobs') }}
        </p>
      </div>
  
      <div class="stats-panel">
        <h3>{{ t('stats') }}</h3>
        <div class="stats-grid">
          <div class="stat-card total">
            <span class="stat-value">{{ stats.total }}</span>
            <span class="stat-label">{{ t('total') }}</span>
          </div>
          <div class="stat-card sent">
            <span class="stat-value">{{ stats.sent }}</span>
            <span class="stat-label">{{ t('sent') }}</span>
          </div>
          <div class="stat-card interview">
            <span class="stat-value">{{ stats.interview }}</span>
            <span class="stat-label">{{ t('interview') }}</span>
          </div>
          <div class="stat-card rejected">
            <span class="stat-value">{{ stats.rejected }}</span>
            <span class="stat-label">{{ t('rejected') }}</span>
          </div>
          <div class="stat-card accepted">
            <span class="stat-value">{{ stats.accepted }}</span>
            <span class="stat-label">{{ t('accepted') }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useJobStore } from "@/stores/jobStore";
import JobCard from "@/pages/JobCard.vue";
import JobView from "@/views/JobView.vue";
import { ref, computed, onMounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useLanguageStore } from "@/stores/languageStore"; 
import { storeToRefs } from "pinia";

// Инициализация i18n
const { t } = useI18n();

// Получаем доступ к вакансиям и языковому стору
const jobStore = useJobStore();
const languageStore = useLanguageStore();

// Используем storeToRefs для сохранения реактивности
const { jobs, loading, errorMessage } = storeToRefs(jobStore);
// Методы можно использовать напрямую
const { fetchJobs, removeJob, updateJobStatus } = jobStore;

// Локальные переменные для фильтрации и поиска
const statusFilter = ref("all");
const searchQuery = ref("");
const selectedJob = ref(null);

// При монтировании компонента загружаем вакансии
onMounted(async () => {
  console.log("🚀 Компонент Home.vue смонтирован, загружаем вакансии...");
  await fetchJobs();
  console.log("✅ Вакансии после загрузки:", jobs.value);
  
  // Добавляем информацию о парсинге для каждой вакансии
  if (jobs.value && Array.isArray(jobs.value)) {
    jobs.value.forEach(job => {
      if (job.isParsed) {
        job.parsedLinks = {
          data: `/api/jobs/${job.id}/parsed`,
          screenshot: `/api/jobs/${job.id}/screenshot`,
          html: `/api/jobs/${job.id}/html`,
          text: `/api/jobs/${job.id}/text`
        };
      }
    });
  }
});

// Выбор вакансии для подробного просмотра
const selectJob = (job) => {
  console.log("📄 Выбрана вакансия:", job);
  
  // Если вакансия распарсена, но нет ссылок на данные парсинга, добавляем их
  if (job.isParsed && !job.parsedLinks) {
    job.parsedLinks = {
      data: `/api/jobs/${job.id}/parsed`,
      screenshot: `/api/jobs/${job.id}/screenshot`,
      html: `/api/jobs/${job.id}/html`,
      text: `/api/jobs/${job.id}/text`
    };
  }
  
  selectedJob.value = job;
};

// Обновление информации о вакансии (включая парсинг)
const updateJob = (updatedJob) => {
  console.log("🔄 Обновление вакансии:", updatedJob);
  
  // Находим индекс вакансии в массиве
  const index = jobs.value.findIndex(j => j.id === updatedJob.id);
  
  if (index !== -1) {
    // Обновляем вакансию в массиве
    jobs.value[index] = updatedJob;
    
    // Если эта вакансия выбрана в данный момент, обновляем и ее
    if (selectedJob.value && selectedJob.value.id === updatedJob.id) {
      selectedJob.value = updatedJob;
    }
  }
};

// Удаление вакансии с подтверждением
const handleRemoveJob = async (jobId) => {
  if (confirm(t("confirmRemove"))) {
    console.log(`🗑️ Удаление вакансии с ID ${jobId}`);
    await removeJob(jobId);
    await fetchJobs();
    
    // Если была удалена выбранная вакансия, закрываем просмотр
    if (selectedJob.value && selectedJob.value.id === jobId) {
      selectedJob.value = null;
    }
  }
};

// Обработка обновления статуса (в данном случае просто обновляем список вакансий)
const handleStatusUpdate = async (data) => {
  console.log("🔄 Обновление статуса:", data);
  
  // Обновляем статус вакансии
  await updateJobStatus(data.jobId, data.status);
  
  // Обновляем список вакансий
  await fetchJobs();
  
  // Если эта вакансия выбрана, обновляем ее статус
  if (selectedJob.value && selectedJob.value.id === data.jobId) {
    selectedJob.value.status = data.status;
  }
};

// Вычисляемый список вакансий с фильтрами и поиском
const filteredJobs = computed(() => {
  console.log("🔍 Вычисляем filteredJobs, текущие jobs.value:", jobs.value);
  if (!jobs.value || !Array.isArray(jobs.value)) {
    console.warn("⚠️ jobs.value не является массивом или undefined:", jobs.value);
    return [];
  }
  return jobs.value.filter((job) => {
    if (statusFilter.value !== "all" && job.status !== statusFilter.value) {
      return false;
    }
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      return (
        job.company?.toLowerCase().includes(query) ||
        job.position?.toLowerCase().includes(query)
      );
    }
    return true;
  });
});

// Вычисляемая статистика по вакансиям
const stats = computed(() => {
  if (!jobs.value || !Array.isArray(jobs.value)) {
    return { total: 0, sent: 0, interview: 0, rejected: 0, accepted: 0 };
  }
  return {
    total: jobs.value.length,
    sent: jobs.value.filter((job) => job.status === "sent").length,
    interview: jobs.value.filter((job) => job.status === "interview").length,
    rejected: jobs.value.filter((job) => job.status === "rejected").length,
    accepted: jobs.value.filter((job) => job.status === "accepted").length,
  };
});

// Отслеживание изменений фильтров для дебага
watch([statusFilter, searchQuery], () => {
  console.log("🔍 Фильтры изменены:", statusFilter.value, searchQuery.value);
});

// Отслеживание смены языка
watch(
  () => languageStore.currentLanguage,
  (newLang, oldLang) => {
    console.log(`🌐 Язык поменялся с ${oldLang} на ${newLang}`);
    // При необходимости можно обновить вакансии
    // fetchJobs();
  }
);
</script>

<style scoped>
.job-tracker-home {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s, color 0.3s;
}

.dark .job-tracker-home {
  background-color: #1e1e1e;
  color: #ddd;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.header-section {
  margin-bottom: 30px;
  text-align: center;
}

.header-section h1 {
  margin-bottom: 20px;
  color: #333;
  font-size: 28px;
  font-weight: 700;
}

.dark .header-section h1 {
  color: #fff;
}

.filter-controls {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  animation: fadeIn 0.5s ease-in-out;
}

.status-filter,
.search-input {
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  background-color: #f9f9f9;
  color: #333;
  transition: border-color 0.3s, background-color 0.3s;
}

.dark .status-filter,
.dark .search-input {
  border-color: #555;
  background-color: #333;
  color: #ddd;
}

.status-filter:hover,
.search-input:hover {
  border-color: #007bff;
}

.dark .status-filter:hover,
.dark .search-input:hover {
  border-color: #ffcc00;
}

.search-input {
  flex-grow: 1;
}

.jobs-list {
  margin-bottom: 40px;
}

.loading-indicator,
.error-message,
.empty-state {
  padding: 30px;
  text-align: center;
  background-color: #f9f9f9;
  border-radius: 10px;
  margin-bottom: 40px;
  animation: fadeIn 0.5s ease-in-out;
}

.dark .loading-indicator,
.dark .error-message,
.dark .empty-state {
  background-color: #2a2a2a;
}

.error-message {
  color: #ff4444;
}

.dark .error-message {
  color: #ff6666;
}

.retry-button {
  margin-top: 15px;
  padding: 8px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.retry-button:hover {
  background-color: #0056b3;
}

.dark .retry-button {
  background-color: #ffcc00;
  color: #333;
}

.dark .retry-button:hover {
  background-color: #e6b800;
}

.stats-panel {
  background-color: #f9f9f9;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: background-color 0.3s;
}

.dark .stats-panel {
  background-color: #2a2a2a;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  text-align: center;
}

.stat-card {
  padding: 15px;
  border-radius: 8px;
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-value {
  display: block;
  font-size: 28px;
  font-weight: 700;
  color: #333;
}

.dark .stat-value {
  color: #fff;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.dark .stat-label {
  color: #bbb;
}

.total { background-color: #e0e0e0; }
.sent { background-color: #4fc3f7; }
.interview { background-color: #ffca28; }
.rejected { background-color: #ef5350; }
.accepted { background-color: #66bb6a; }

.dark .total { background-color: #424242; }
.dark .sent { background-color: #0288d1; }
.dark .interview { background-color: #ffb300; }
.dark .rejected { background-color: #d32f2f; }
.dark .accepted { background-color: #388e3c; }

/* Стили для JobView и кнопки "Назад" */
.job-view-container {
  animation: fadeIn 0.5s ease-in-out;
}

.back-button-container {
  margin-bottom: 20px;
}

.back-button {
  padding: 8px 15px;
  background-color: #f1f1f1;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.back-button:hover {
  background-color: #e0e0e0;
}

.dark .back-button {
  background-color: #333;
  color: #ddd;
}

.dark .back-button:hover {
  background-color: #444;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>