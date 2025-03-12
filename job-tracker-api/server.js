const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // Генератор уникальных ID

const app = express();
const PORT = 5000;
const JOBS_DIR = path.join(__dirname, 'jobs');

app.use(cors());
app.use(express.json());

// 📌 Убедимся, что папка для вакансий существует
if (!fs.existsSync(JOBS_DIR)) {
    fs.mkdirSync(JOBS_DIR);
}

// 📌 Получаем все вакансии
app.get('/api/jobs', (req, res) => {
    fs.readdir(JOBS_DIR, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Ошибка чтения вакансий' });
        }
        const jobs = files.map(file => {
            const data = fs.readFileSync(path.join(JOBS_DIR, file));
            return JSON.parse(data);
        });
        res.json(jobs);
    });
});

// 📌 Добавляем новую вакансию
app.post('/api/jobs', (req, res) => {
    const job = req.body;
    const jobId = uuidv4(); // Генерируем уникальный ID
    job.id = jobId; // Добавляем ID в объект вакансии

    const jobPath = path.join(JOBS_DIR, `${jobId}.json`);
    fs.writeFileSync(jobPath, JSON.stringify(job, null, 2));

    res.status(201).json(job);
});

// 📌 Обновляем статус вакансии
app.put('/api/jobs/:id', (req, res) => {
    const jobId = req.params.id;
    const jobPath = path.join(JOBS_DIR, `${jobId}.json`);

    if (!fs.existsSync(jobPath)) {
        return res.status(404).json({ error: 'Вакансия не найдена' });
    }

    const job = JSON.parse(fs.readFileSync(jobPath));
    const { status, interviewDate } = req.body;

    job.status = status;
    if (interviewDate) job.interviewDate = interviewDate;

    fs.writeFileSync(jobPath, JSON.stringify(job, null, 2));
    res.json({ message: 'Вакансия обновлена', job });
});

// 📌 Удаляем вакансию
app.delete('/api/jobs/:id', (req, res) => {
    const jobId = req.params.id;
    const jobPath = path.join(JOBS_DIR, `${jobId}.json`);

    if (!fs.existsSync(jobPath)) {
        return res.status(404).json({ error: 'Вакансия не найдена' });
    }

    fs.unlinkSync(jobPath);
    res.json({ message: 'Вакансия удалена' });
});

app.listen(PORT, () => console.log(`✅ Сервер запущен на http://localhost:${PORT}`));
