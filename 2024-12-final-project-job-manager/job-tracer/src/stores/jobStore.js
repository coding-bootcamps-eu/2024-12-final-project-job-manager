import { defineStore } from 'pinia';
import { ref, onMounted } from 'vue';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/jobs';

export const useJobStore = defineStore('jobStore', () => {
  const jobs = ref([]);

  // Загружаем вакансии
  const fetchJobs = async () => {
    try {
      const res = await axios.get(API_URL);
      jobs.value = res.data;
    } catch (error) {
      console.error('Ошибка загрузки вакансий:', error);
    }
  };

  // Добавляем вакансию
  const addJob = async (job) => {
    try {
        const response = await axios.post("/api/jobs", job);
        console.log("Добавленная вакансия:", response.data);
        jobs.value.push(response.data);
    } catch (error) {
        console.error("Ошибка при добавлении вакансии:", error);
    }
};


  // Обновляем статус вакансии
  const updateJobStatus = async (id, newStatus, interviewDate = null) => {
    try {
      await axios.put(`${API_URL}/${id}`, { status: newStatus, interviewDate });
      await fetchJobs();
    } catch (error) {
      console.error('Ошибка при обновлении статуса:', error);
    }
  };

  // Удаляем вакансию
  const removeJob = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      await fetchJobs();
    } catch (error) {
      console.error('Ошибка при удалении вакансии:', error);
    }
  };

  onMounted(fetchJobs); // Вызов при монтировании компонента

  return { jobs, fetchJobs, addJob, updateJobStatus, removeJob };
});
