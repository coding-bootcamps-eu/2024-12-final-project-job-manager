import { createI18n } from 'vue-i18n';

const messages = {
  ru: {
    title: "Трекер вакансий",
    home: "Главная",
    about: "О нас",
    addJob: "Добавить вакансию",
    allStatuses: "Все статусы",
    sent: "Отправлено",
    interview: "Интервью",
    rejected: "Отклонено",
    accepted: "Принято",
    searchPlaceholder: "Поиск...",
    noJobsWithFilters: "Нет вакансий с такими фильтрами",
    noJobs: "Нет вакансий",
    stats: "Статистика",
    total: "Всего",
    confirmRemove: "Удалить вакансию?",
    loading: "Загрузка...",
    retry: "Повторить",
    // ... и т.д.
  },
  en: {
    title: "Job Tracker",
    home: "Home",
    about: "About",
    addJob: "Add Job",
    allStatuses: "All statuses",
    sent: "Sent",
    interview: "Interview",
    rejected: "Rejected",
    accepted: "Accepted",
    searchPlaceholder: "Search...",
    noJobsWithFilters: "No jobs match these filters",
    noJobs: "No jobs found",
    stats: "Stats",
    total: "Total",
    confirmRemove: "Remove this job?",
    loading: "Loading...",
    retry: "Retry",
    // ... и т.д.
  },
  de: {
    title: "Job-Tracker",
    home: "Startseite",
    about: "Über uns",
    addJob: "Job hinzufügen",
    allStatuses: "Alle Status",
    sent: "Gesendet",
    interview: "Vorstellungsgespräch",
    rejected: "Abgelehnt",
    accepted: "Angenommen",
    searchPlaceholder: "Suche...",
    noJobsWithFilters: "Keine Jobs mit diesen Filtern",
    noJobs: "Keine Jobs gefunden",
    stats: "Statistiken",
    total: "Insgesamt",
    confirmRemove: "Diesen Job entfernen?",
    loading: "Laden...",
    retry: "Wiederholen",
    // ... и т.д.
  },
};

const i18n = createI18n({
  locale: 'ru',
  fallbackLocale: 'en',
  messages,
});

export default i18n;
