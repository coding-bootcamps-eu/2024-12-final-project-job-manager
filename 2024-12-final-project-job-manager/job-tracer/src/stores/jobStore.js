import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const useJobStore = defineStore("job", () => {
  const jobs = ref([]);
  const loading = ref(false);
  const errorMessage = ref(null);

  // Функция обработки ошибок, обновляющая errorMessage
  const handleError = (err, defaultMessage) => {
    console.error("❌ Ошибка:", defaultMessage, err);
    errorMessage.value = err.response?.data?.message || defaultMessage || "Произошла ошибка";
  };

  // Получение вакансий с сервера
  const fetchJobs = async () => {
    loading.value = true;
    errorMessage.value = null;
    try {
      console.log("🚀 Запрос вакансий с сервера:", `${API_URL}/jobs`);
      const response = await axios.get(`${API_URL}/jobs`);
      console.log("✅ Ответ сервера:", response.data);

      if (!Array.isArray(response.data)) {
        throw new Error("Ожидался массив вакансий, получен некорректный формат");
      }

      // Добавляем уникальный id, если его нет
      jobs.value = response.data.map(job => ({
        ...job,
        id: job.id || `job_${Date.now()}_${Math.random()}`,
      }));
      console.log("✅ Вакансии успешно загружены в jobs.value:", jobs.value);
    } catch (err) {
      handleError(err, "Не удалось загрузить вакансии. Проверьте сервер.");
      jobs.value = [];
    } finally {
      loading.value = false;
    }
  };

  // Добавление вакансии через POST-запрос
  const addJob = async (formData) => {
    loading.value = true;
    errorMessage.value = null;
    try {
      console.log("📝 Добавление вакансии...");
      const response = await axios.post(`${API_URL}/jobs`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("✅ Вакансия добавлена на сервер:", response.data);
      await fetchJobs(); // Обновляем список вакансий после добавления
      return response.data;
    } catch (err) {
      handleError(err, "Не удалось добавить вакансию.");
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Обновление статуса вакансии с поддержкой параметра interviewDate
  const updateJobStatus = async (jobId, status, interviewDate = null) => {
    try {
      console.log(
        `🔄 Обновление статуса вакансии ${jobId} на ${status}` +
          (interviewDate ? ` с датой интервью ${interviewDate}` : "")
      );
      await axios.put(`${API_URL}/jobs/${jobId}`, { status, interviewDate });
      await fetchJobs();
    } catch (err) {
      handleError(err, "Не удалось обновить статус вакансии.");
    }
  };

  // Обновление заметок вакансии
  const updateJobNotes = async (jobId, notes) => {
    try {
      console.log(`📝 Обновление заметок вакансии ${jobId}`);
      await axios.put(`${API_URL}/jobs/${jobId}`, { notes });
      await fetchJobs();
    } catch (err) {
      handleError(err, "Не удалось обновить заметки.");
    }
  };

  // Удаление вакансии
  const removeJob = async (jobId) => {
    try {
      console.log(`🗑 Удаление вакансии ${jobId}`);
      await axios.delete(`${API_URL}/jobs/${jobId}`);
      await fetchJobs();
    } catch (err) {
      handleError(err, "Не удалось удалить вакансию.");
    }
  };

  return {
    jobs,
    loading,
    errorMessage,
    fetchJobs,
    addJob,
    updateJobStatus,
    updateJobNotes,
    removeJob,
  };
});
