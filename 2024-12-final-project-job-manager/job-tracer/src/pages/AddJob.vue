<template>
  <div class="add-job-container">
    <h2>{{ t('addJob') }}</h2>
    
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label>{{ t('company') }}</label>
        <input v-model="job.company" :placeholder="t('companyPlaceholder')" required />
      </div>

      <div class="form-group">
        <label>{{ t('position') }}</label>
        <input v-model="job.position" :placeholder="t('positionPlaceholder')" required />
      </div>

      <div class="form-group">
        <label>{{ t('link') }}</label>
        <input v-model="job.link" :placeholder="t('linkPlaceholder')" required />
      </div>

      <div class="form-group">
        <label>{{ t('coverLetter') }}</label>
        <input type="file" ref="coverLetterInput" @change="handleCoverLetterUpload" accept=".txt,.doc,.docx,.pdf" />
      </div>

      <div class="form-group">
        <label>{{ t('resume') }}</label>
        <input type="file" ref="resumeInput" @change="handleResumeUpload" accept=".txt,.doc,.docx,.pdf" />
      </div>

      <div class="form-group">
        <label>{{ t('status') }}</label>
        <select v-model="job.status">
          <option value="Sent">{{ t('jobStatus.sent') }}</option>
          <option value="Interview">{{ t('jobStatus.interview') }}</option>
          <option value="Rejected">{{ t('jobStatus.rejected') }}</option>
          <option value="Accepted">{{ t('jobStatus.accepted') }}</option>
        </select>
      </div>

      <div class="form-actions">
        <button type="submit" class="submit-btn" :disabled="loading">
          {{ loading ? t('loading') : t('submit') }}
        </button>
        <button type="button" class="cancel-btn" @click="$emit('cancel')" v-if="showCancelButton">
          {{ t('cancel') }}
        </button>
      </div>
      
      <div v-if="errorMessage" class="error-message">
        <span>{{ errorMessage }}</span>
        <button @click="clearError" class="clear-error-btn">&times;</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from "vue";
import { useJobStore } from "@/stores/jobStore";
import { useI18n } from "vue-i18n";

const props = defineProps({
  showCancelButton: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['job-added', 'cancel']);
const { t } = useI18n();
const jobStore = useJobStore();
const loading = ref(false);
const errorMessage = ref("");
const coverLetterFile = ref(null);
const resumeFile = ref(null);
const coverLetterInput = ref(null);
const resumeInput = ref(null);

const job = ref({
  company: "",
  position: "",
  link: "",
  status: "Sent",
});

const validateJob = () => {
  if (!job.value.company.trim()) {
    errorMessage.value = t('validation.companyRequired');
    return false;
  }
  if (!job.value.position.trim()) {
    errorMessage.value = t('validation.positionRequired');
    return false;
  }
  
  // Проверяем, что ссылка начинается с http:// или https://
  const urlPattern = /^https?:\/\/.+/i;
  if (!job.value.link.trim() || !urlPattern.test(job.value.link)) {
    errorMessage.value = t('validation.validLinkRequired');
    return false;
  }
  
  return true;
};

const clearError = () => {
  errorMessage.value = "";
};

const handleCoverLetterUpload = (event) => {
  coverLetterFile.value = event.target.files[0];
};

const handleResumeUpload = (event) => {
  resumeFile.value = event.target.files[0];
};

const resetForm = () => {
  job.value = { company: "", position: "", link: "", status: "Sent" };
  coverLetterFile.value = null;
  resumeFile.value = null;
  
  // Сбрасываем file-инпуты
  if (coverLetterInput.value) coverLetterInput.value.value = "";
  if (resumeInput.value) resumeInput.value.value = "";
  
  errorMessage.value = "";
};

const handleSubmit = async () => {
  clearError();
  if (!validateJob()) return;

  loading.value = true;
  try {
    const formData = new FormData();
    formData.append("company", job.value.company);
    formData.append("position", job.value.position);
    formData.append("link", job.value.link);
    formData.append("status", job.value.status);
    
    if (coverLetterFile.value) {
      formData.append("coverLetter", coverLetterFile.value);
    }
    
    if (resumeFile.value) {
      formData.append("resume", resumeFile.value);
    }

    await jobStore.addJob(formData);
    resetForm();
    emit('job-added');
  } catch (error) {
    errorMessage.value = t('errorAdding');
    console.error("Ошибка при добавлении:", error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.add-job-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  color: #333;
  transition: background-color 0.2s, color 0.2s;
}

.dark .add-job-container {
  background-color: #333;
  color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
}

.form-group {
  margin-bottom: 16px;
}

label {
  font-weight: 600;
  display: block;
  margin-bottom: 6px;
  color: inherit;
}

input,
select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background-color: #fff;
  color: #333;
  font-size: 14px;
  transition: border-color 0.2s, background-color 0.2s;
}

input:focus,
select:focus {
  outline: none;
  border-color: #007bff;
}

.dark input,
.dark select {
  border-color: #555;
  background-color: #444;
  color: #eee;
}

.dark input:focus,
.dark select:focus {
  border-color: #0d6efd;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.submit-btn, .cancel-btn {
  padding: 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: background-color 0.2s, transform 0.1s;
}

.submit-btn {
  flex: 1;
  background: #007bff;
  color: white;
}

.submit-btn:hover:not(:disabled) {
  background: #0069d9;
  transform: translateY(-1px);
}

.cancel-btn {
  background: #f8f9fa;
  color: #333;
  border: 1px solid #ddd;
}

.cancel-btn:hover {
  background: #e9ecef;
}

.dark .submit-btn {
  background: #0d6efd;
}

.dark .submit-btn:hover:not(:disabled) {
  background: #0a58ca;
}

.dark .cancel-btn {
  background: #343a40;
  color: #eee;
  border-color: #495057;
}

.dark .cancel-btn:hover {
  background: #495057;
}

.submit-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
  opacity: 0.7;
}

.error-message {
  margin-top: 16px;
  padding: 10px;
  background-color: #f8d7da;
  color: #721c24;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dark .error-message {
  background-color: #481217;
  color: #f8d7da;
}

.clear-error-btn {
  background: none;
  border: none;
  color: #721c24;
  font-size: 18px;
  cursor: pointer;
}

.dark .clear-error-btn {
  color: #f8d7da;
}
</style>