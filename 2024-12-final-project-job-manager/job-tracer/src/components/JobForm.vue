<template>
    <form @submit.prevent="submitJob">
      <input v-model="job.company" placeholder="Company" required />
      <input v-model="job.position" placeholder="Position" required />
      <select v-model="job.status">
        <option value="Sent">Sent</option>
        <option value="Interview">Interview</option>
        <option value="Rejected">Rejected</option>
        <option value="Offer">Offer</option>
      </select>
      <input v-model="job.date" type="date" required />
      <input v-model="job.link" placeholder="Job Link" />
      <textarea v-model="job.note" placeholder="Notes"></textarea>
      <button type="submit">Add Job</button>
    </form>
  </template>
  
  <script>
  export default {
    data() {
      return {
        job: {
          company: '',
          position: '',
          status: 'Sent',
          date: '',
          link: '',
          note: '',
        },
      };
    },
    methods: {
      submitJob() {
        this.$emit('add-job', this.job);
        this.job = {
          company: '',
          position: '',
          status: 'Sent',
          date: '',
          link: '',
          note: '',
        };
      },
    },
  };
  </script>
  