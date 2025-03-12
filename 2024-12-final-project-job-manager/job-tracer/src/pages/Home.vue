<template>
  <div>
    <h1>Сохранённые вакансии</h1>
    <AddJob />

    <ul v-if="jobs.length">
      <li v-for="job in jobs" :key="job.id">
        <strong>{{ job.company }}</strong> - {{ job.position }} ({{ job.status }})
        <a :href="job.link" target="_blank">[Ссылка]</a>
        <p v-if="job.coverLetter"><strong>Сопроводительное письмо:</strong> {{ job.coverLetter }}</p>
        <p v-if="job.resume"><strong>Резюме:</strong> <a :href="job.resume" target="_blank">Скачать</a></p>
        <button @click="console.log('Updating job:', job) || updateJobStatus(job.id, 'Interview')">Назначить интервью</button>
        <button @click="console.log('Removing job:', job) || removeJob(job.id)">Удалить</button>
      </li>
    </ul>

    <p v-else>Нет сохранённых вакансий</p>
  </div>
</template>

<script setup>
import { useJobStore } from '@/stores/jobStore';
import AddJob from './AddJob.vue';


import { onMounted } from 'vue';

const jobStore = useJobStore();
const { jobs, fetchJobs, updateJobStatus, removeJob } = jobStore;

onMounted(fetchJobs);
</script>
