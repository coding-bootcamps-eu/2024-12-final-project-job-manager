<template>
  <div class="parsed-job-container">
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>{{ t('loadingJobData') }}</p>
    </div>
    
    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
      <button @click="loadJobData" class="retry-btn">{{ t('retry') }}</button>
    </div>
    
    <div v-else-if="parsedJob" class="parsed-job-content">
      <div class="parsed-job-header">
        <h2>{{ parsedJob.title }}</h2>
        <div class="company">{{ parsedJob.company }}</div>
        <div class="parsed-date">{{ t('parsedOn') }}: {{ formatDate(parsedJob.parsedAt) }}</div>
        <div v-if="parsedJob.url" class="original-link">
          <a :href="parsedJob.url" target="_blank">{{ t('openOriginalPage') }}</a>
        </div>
      </div>
      
      <div class="view-tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="{ active: activeTab === tab.id }"
          class="tab-btn"
        >
          {{ tab.label }}
        </button>
      </div>
      
      <div class="tab-content">
        <div v-if="activeTab === 'description'" class="description-tab">
          <div class="job-text">{{ parsedJob.description }}</div>
        </div>
        
        <div v-else-if="activeTab === 'screenshot'" class="screenshot-tab">
          <img :src="`/api/jobs/${jobId}/screenshot`" alt="Job Screenshot" class="job-screenshot">
        </div>
        
        <div v-else-if="activeTab === 'html'" class="html-tab">
          <iframe :src="`/api/jobs/${jobId}/html`" class="html-frame"></iframe>
        </div>
      </div>
    </div>
    
    <div v-else class="no-data">
      <p>{{ t('noDataAvailable') }}</p>
      <button v-if="canParse" @click="parseJob" class="parse-btn">
        {{ t('parseNow') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import axios from 'axios';

const { t } = useI18n();
const route = useRoute();

const jobId = computed(() => route.params.id);
const loading = ref(true);
const error = ref(null);
const parsedJob = ref(null);
const activeTab = ref('description');
const canParse = ref(false);

// Доступные вкладки
const tabs = [
  { id: 'description', label: t('description') },
  { id: 'screenshot', label: t('screenshot') },
  { id: 'html', label: t('htmlSource') }
];

// Загрузка данных о распарсенной вакансии
const loadJobData = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const jobResponse = await axios.get(`/api/jobs/${jobId.value}`);
    const job = jobResponse.data;
    canParse.value = !!job.link;
    
    if (job.isParsed) {
      const parsedResponse = await axios.get(`/api/jobs/${jobId.value}/parsed`);
      if (parsedResponse.data.success) {
        parsedJob.value = parsedResponse.data.parsedData;
      } else {
        error.value = t('errorLoadingParsedData');
      }
    } else {
      parsedJob.value = null;
    }
  } catch (err) {
    console.error('Ошибка при загрузке данных:', err);
    error.value = err.response?.data?.error || t('errorLoadingData');
  } finally {
    loading.value = false;
  }
};

// Метод для запуска парсинга вакансии
const parseJob = async () => {
  loading.value = true;
  try {
    await axios.post(`/api/jobs/${jobId.value}/parse`);
    await loadJobData();
  } catch (err) {
    console.error('Ошибка при парсинге вакансии:', err);
    error.value = err.response?.data?.error || t('errorParsingJob');
  } finally {
    loading.value = false;
  }
};

// Форматирование даты
const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(
    navigator.language || 'ru-RU', 
    { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
  ).format(date);
};

onMounted(() => {
  loadJobData();
});
</script>

<style scoped>
.parsed-job-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
}

.dark .parsed-job-container {
  background-color: #333;
  color: #eee;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
}

.loading, .error, .no-data {
  text-align: center;
  padding: 40px 0;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  margin: 0 auto 20px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.parsed-job-header {
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.dark .parsed-job-header {
  border-bottom-color: #555;
}

.parsed-job-header h2 {
  font-size: 24px;
  margin-bottom: 10px;
}

.company {
  font-size: 18px;
  color: #666;
  margin-bottom: 10px;
}

.dark .company {
  color: #bbb;
}

.parsed-date, .original-link {
  font-size: 14px;
  color: #888;
  margin-top: 5px;
}

.dark .parsed-date, .dark .original-link {
  color: #aaa;
}

.original-link a {
  color: #3498db;
  text-decoration: none;
}

.original-link a:hover {
  text-decoration: underline;
}

.view-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.tab-btn {
  padding: 8px 16px;
  background-color: #f5f5f5;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.dark .tab-btn {
  background-color: #444;
  color: #eee;
}

.tab-btn:hover {
  background-color: #e0e0e0;
}

.dark .tab-btn:hover {
  background-color: #555;
}

.tab-btn.active {
  background-color: #3498db;
  color: white;
}

.dark .tab-btn.active {
  background-color: #2980b9;
}

.tab-content {
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 20px;
  min-height: 300px;
}

.dark .tab-content {
  border-color: #555;
}

.job-text {
  line-height: 1.6;
  white-space: pre-line;
  max-height: 500px;
  overflow-y: auto;
}

.job-screenshot {
  max-width: 100%;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.dark .job-screenshot {
  border-color: #444;
}

.html-frame {
  width: 100%;
  height: 500px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.dark .html-frame {
  border-color: #444;
}

.retry-btn, .parse-btn {
  padding: 8px 16px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 15px;
  transition: all 0.3s ease;
}

.retry-btn:hover, .parse-btn:hover {
  background-color: #2980b9;
}

.dark .retry-btn, .dark .parse-btn {
  background-color: #2980b9;
}

.dark .retry-btn:hover, .dark .parse-btn:hover {
  background-color: #3498db;
}
</style>