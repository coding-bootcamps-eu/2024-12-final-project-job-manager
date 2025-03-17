const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');

const app = express();
const PORT = 5000;
const JOBS_DIR = path.join(__dirname, 'jobs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const companyDir = path.join(JOBS_DIR, req.body.company.replace(/[^a-zA-Z0-9]/g, '_'));
        if (!fs.existsSync(companyDir)) {
            fs.mkdirSync(companyDir, { recursive: true });
        }
        cb(null, companyDir);
    },
    filename: (req, file, cb) => {
        const jobId = req.body.jobId || uuidv4();
        const ext = path.extname(file.originalname);
        if (file.fieldname === 'coverLetter') {
            cb(null, `${jobId}_coverLetter${ext}`);
        } else if (file.fieldname === 'resume') {
            cb(null, `${jobId}_resume${ext}`);
        }
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }
});

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

if (!fs.existsSync(JOBS_DIR)) {
    fs.mkdirSync(JOBS_DIR);
}

app.use('/jobs', express.static(JOBS_DIR));

app.get('/api/jobs', (req, res) => {
    const jobs = [];
    fs.readdir(JOBS_DIR, { withFileTypes: true }, (err, companies) => {
        if (err) {
            console.error('Ошибка чтения директории:', err);
            return res.status(500).json({ error: 'Ошибка чтения вакансий' });
        }

        const companyDirs = companies.filter(dirent => dirent.isDirectory());
        let processedCompanies = 0;

        if (companyDirs.length === 0) {
            console.log('Нет компаний, возвращаем пустой массив');
            return res.json(jobs);
        }

        companyDirs.forEach(companyDir => {
            const companyPath = path.join(JOBS_DIR, companyDir.name);
            fs.readdir(companyPath, (err, files) => {
                if (err) {
                    console.error(`Ошибка чтения папки компании ${companyDir.name}:`, err);
                } else {
                    files.forEach(file => {
                        if (file.endsWith('.json')) {
                            try {
                                const filePath = path.join(companyPath, file);
                                const data = fs.readFileSync(filePath);
                                const job = JSON.parse(data);
                                if (job.coverLetterPath) {
                                    job.coverLetterUrl = `/jobs/${companyDir.name}/${job.coverLetterPath}`;
                                }
                                if (job.resumePath) {
                                    job.resumeUrl = `/jobs/${companyDir.name}/${job.resumePath}`;
                                }
                                jobs.push(job);
                            } catch (parseError) {
                                console.error(`Ошибка парсинга файла ${file} в папке ${companyDir.name}:`, parseError);
                            }
                        }
                    });
                }

                processedCompanies++;
                if (processedCompanies === companyDirs.length) {
                    console.log('📦 Возвращаемые вакансии:', jobs);
                    res.json(jobs);
                }
            });
        });
    });
});

// Остальные маршруты (POST, PUT, DELETE) остаются без изменений
app.post('/api/jobs', upload.fields([{ name: 'coverLetter', maxCount: 1 }, { name: 'resume', maxCount: 1 }]), (req, res) => {
    const job = {
        company: req.body.company,
        position: req.body.position,
        link: req.body.link,
        status: req.body.status,
    };
    job.id = uuidv4();
    job.createdAt = new Date().toISOString();
    job.notes = req.body.notes || "";
    job.interviewDate = req.body.interviewDate || null;

    const companyDir = path.join(JOBS_DIR, job.company.replace(/[^a-zA-Z0-9]/g, '_'));
    if (!fs.existsSync(companyDir)) {
        fs.mkdirSync(companyDir);
    }

    const jobFile = path.join(companyDir, `${job.id}.json`);
    const coverLetterPath = req.files.coverLetter ? `${job.id}_coverLetter${path.extname(req.files.coverLetter[0].originalname)}` : null;
    const resumePath = req.files.resume ? `${job.id}_resume${path.extname(req.files.resume[0].originalname)}` : null;

    fs.writeFileSync(jobFile, JSON.stringify({
        id: job.id,
        company: job.company,
        position: job.position,
        link: job.link,
        status: job.status,
        createdAt: job.createdAt,
        notes: job.notes,
        interviewDate: job.interviewDate,
        coverLetterPath: coverLetterPath,
        resumePath: resumePath
    }, null, 2));

    res.status(201).json(job);
});

// ... остальные маршруты (PUT, DELETE) ...

app.listen(PORT, () => console.log(`✅ Сервер запущен на http://localhost:${PORT}`));