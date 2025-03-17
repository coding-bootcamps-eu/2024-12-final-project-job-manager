<template>
  <div class="job-card" :class="jobClass">
    <div class="job-header">
      <h3>{{ job.company }}</h3>
      <span class="job-status" :class="statusClass">{{ statusText }}</span>
    </div>

    <div class="job-details">
      <p><strong>Должность:</strong> {{ job.position }}</p>
      <p>
        <strong>Ссылка:</strong>
        <a v-if="job.link" :href="job.link" target="_blank" class="job-link">
          Открыть вакансию
        </a>
        <span v-else>Ссылка отсутствует</span>
      </p>

      <div v-if="job.coverLetter" class="job-section">
        <details>
          <summary>Сопроводительное письмо (Anschreiben)</summary>
          <div class="details-content">
            {{ job.coverLetter }}
          </div>
        </details>
      </div>

      <div v-if="job.resume" class="job-section">
        <details>
          <summary>Резюме (Lebenslauf)</summary>
          <div class="details-content">
            {{ job.resume }}
          </div>
        </details>
      </div>

      <div v-if="job.interviewDate" class="job-section interview-info">
        <p><strong>Дата интервью:</strong> {{ formatDate(job.interviewDate) }}</p>
      </div>

      <div class="job-section">
        <details>
          <summary>Заметки</summary>
          <div class="details-content">
            <textarea
              v-model="notes"
              placeholder="Добавьте заметки о вакансии..."
              @change="saveNotes"
              class="notes-textarea"
            ></textarea>
          </div>
        </details>
      </div>
    </div>

    <div class="job-actions">
      <div class="status-actions">
        <select v-model="selectedStatus" @change="updateStatus">
          <option value="Sent">Отправлено</option>
          <option value="Interview">Интервью</option>
          <option value="Rejected">Отклонено</option>
          <option value="Accepted">Принято</option>
        </select>

        <input
          v-if="selectedStatus === 'Interview'"
          type="datetime-local"
          v-model="interviewDate"
          @change="updateStatus"
        />
      </div>

      <button @click="$emit('remove', job.id)" class="delete-button">
        Удалить
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watchEffect } from "vue";
import { useJobStore } from "@/stores/jobStore";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps({
  job: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["remove", "update-status"]);
const jobStore = useJobStore();

const selectedStatus = ref(props.job.status);
const interviewDate = ref("");
const notes = ref(props.job.notes || "");

// Обработка даты интервью при загрузке компонента
watchEffect(() => {
  if (props.job.interviewDate) {
    const date = new Date(props.job.interviewDate);
    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    interviewDate.value = localDate.toISOString().slice(0, 16);
  }
});

// Форматирование даты для отображения
const formatDate = (dateString) => {
  if (!dateString) return "Нет данных";
  return new Date(dateString).toLocaleString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Вычисляемый класс для карточки вакансии
const jobClass = computed(() => ({
  interview: props.job.status === "Interview",
  rejected: props.job.status === "Rejected",
}));

// Вычисляемый класс для статуса
const statusClass = computed(() => ({
  "status-sent": props.job.status === "Sent",
  "status-interview": props.job.status === "Interview",
  "status-rejected": props.job.status === "Rejected",
  "status-accepted": props.job.status === "Accepted",
}));

// Вычисляемый текст статуса с использованием i18n
const statusText = computed(() => {
  return {
    Sent: t("jobStatus.sent", "Отправлено"),
    Interview: t("jobStatus.interview", "Интервью"),
    Rejected: t("jobStatus.rejected", "Отклонено"),
    Accepted: t("jobStatus.accepted", "Принято"),
  }[props.job.status] || props.job.status;
});

// Обновление статуса вакансии
const updateStatus = async () => {
  try {
    const interviewDateValue =
      selectedStatus.value === "Interview" && interviewDate.value
        ? new Date(interviewDate.value).toISOString()
        : null;

    await jobStore.updateJobStatus(props.job.id, selectedStatus.value, interviewDateValue);
    emit("update-status", {
      id: props.job.id,
      status: selectedStatus.value,
      interviewDate: interviewDateValue,
    });
  } catch (error) {
    console.error("Ошибка при обновлении статуса:", error);
  }
};

// Сохранение заметок
const saveNotes = async () => {
  try {
    await jobStore.updateJobNotes(props.job.id, notes.value);
  } catch (error) {
    console.error("Ошибка при сохранении заметок:", error);
  }
};
</script>

<style scoped>
.job-card {
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.3s;
  animation: fadeIn 0.5s ease-in-out;
}

.job-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.dark .job-card {
  background-color: #2a2a2a;
  border-color: #444;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.dark .job-card:hover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
}

.job-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.job-header h3 {
  margin: 0;
  font-size: 20px;
  color: #333;
}

.dark .job-header h3 {
  color: #fff;
}

.status {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
  color: #fff;
}

.status.sent {
  background-color: #0288d1;
}

.status.interview {
  background-color: #ffb300;
}

.status.rejected {
  background-color: #d32f2f;
}

.status.accepted {
  background-color: #388e3c;
}

.job-details p {
  margin: 10px 0;
  color: #555;
}

.dark .job-details p {
  color: #bbb;
}

.job-details a {
  color: #007bff;
  text-decoration: none;
}

.job-details a:hover {
  text-decoration: underline;
}

.dark .job-details a {
  color: #ffcc00;
}

.notes-section {
  margin-top: 15px;
}

.notes-section label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
}

.dark .notes-section label {
  color: #ddd;
}

.notes-section textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  resize: vertical;
  background-color: #f9f9f9;
  color: #333;
}

.dark .notes-section textarea {
  border-color: #555;
  background-color: #333;
  color: #ddd;
}

.status-section {
  margin-top: 15px;
}

.status-section label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
}

.dark .status-section label {
  color: #ddd;
}

.status-section select,
.status-section input[type="date"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  color: #333;
  transition: border-color 0.3s;
}

.dark .status-section select,
.dark .status-section input[type="date"] {
  border-color: #555;
  background-color: #333;
  color: #ddd;
}

.status-section select:hover,
.status-section input[type="date"]:hover {
  border-color: #007bff;
}

.dark .status-section select:hover,
.dark .status-section input[type="date"]:hover {
  border-color: #ffcc00;
}

.interview-date {
  margin-top: 10px;
}

.remove-button {
  margin-top: 15px;
  padding: 10px 20px;
  background-color: #ef5350;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.remove-button:hover {
  background-color: #d32f2f;
}

.dark .remove-button {
  background-color: #d32f2f;
}

.dark .remove-button:hover {
  background-color: #b71c1c;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
