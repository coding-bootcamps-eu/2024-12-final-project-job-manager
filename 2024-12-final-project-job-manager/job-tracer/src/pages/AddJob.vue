<template>
  <div>
    <h2>Добавить вакансию</h2>
    <form @submit.prevent="handleSubmit">
      <input v-model="job.company" placeholder="Компания" required />
      <input v-model="job.position" placeholder="Должность" required />
      <input v-model="job.link" placeholder="Ссылка на вакансию" required />
      <textarea v-model="job.coverLetter" placeholder="Сопроводительное письмо"></textarea>
      <input v-model="job.resume" placeholder="Файл резюме (ссылка)" />
      <select v-model="job.status">
        <option value="Sent">Отправлено</option>
        <option value="Interview">Интервью</option>
        <option value="Rejected">Отклонено</option>
      </select>
      <button type="submit">Добавить</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useJobStore } from '@/stores/jobStore';

const jobStore = useJobStore();
const job = ref({
  company: '',
  position: '',
  link: '',
  coverLetter: '',
  resume: '',
  status: 'Sent'
});

const handleSubmit = async () => {
  await jobStore.addJob({ ...job.value });
  job.value = { company: '', position: '', link: '', coverLetter: '', resume: '', status: 'Sent' };
};
</script>
