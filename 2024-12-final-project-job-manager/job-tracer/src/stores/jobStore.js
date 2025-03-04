import { defineStore } from 'pinia';

export const useJobStore = defineStore('jobStore', {
  state: () => ({
    jobs: JSON.parse(localStorage.getItem('jobs')) || [],
  }),
  actions: {
    addJob(job) {
      this.jobs.push(job);
      this.saveJobs();
    },
    removeJob(index) {
      this.jobs.splice(index, 1);
      this.saveJobs();
    },
    editJob(index, updatedJob) {
      this.jobs[index] = updatedJob;
      this.saveJobs();
    },
    saveJobs() {
      localStorage.setItem('jobs', JSON.stringify(this.jobs));
    },
  },
});
