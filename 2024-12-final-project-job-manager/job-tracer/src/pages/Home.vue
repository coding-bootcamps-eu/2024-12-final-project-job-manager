<template>
    <div>
      <h1>Job Tracker</h1>
      <JobForm @add-job="addJob" />
      <ul>
        <li v-for="job in jobs" :key="job.id">
          {{ job.company }} - {{ job.position }} ({{ job.status }})
        </li>
      </ul>
    </div>
  </template>
  
  <script>
import { useJobStore } from '@/stores/jobStore';
import JobForm from '../components/JobForm.vue';

export default {
  components: { JobForm }, // Не забудь объявить его здесь
  setup() {
    const jobStore = useJobStore();
    return {
        jobs: jobStore.jobs, 
      addJob: jobStore.addJob,
    };
  },
};


  </script>
  