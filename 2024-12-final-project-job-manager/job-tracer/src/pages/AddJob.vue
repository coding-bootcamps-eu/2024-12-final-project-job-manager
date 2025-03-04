<template>
    <div>
      <h1>Add Job</h1>
      <JobForm @add-job="addJob" />
    </div>
  </template>
  
  <script>
  import JobForm from '../components/JobForm.vue';
  //import JobForm from '../components/JobForm.vue';

export default {
  components: {
    JobForm, // Должно быть объявлено перед использованием
  },
  setup() {
    const jobStore = useJobStore();
    return {
      addJob: jobStore.addJob,
    };
  },
};

  </script>
  