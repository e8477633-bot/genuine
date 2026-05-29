const express = require('express');
const path = require('path');
const multer = require('multer');
const app = express();
const PORT = process.env.PORT || 3000;

// Configure file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, unique + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Ensure uploads folder exists
const fs = require('fs');
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');

app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

let posts = [];

// Get all posts
app.get('/api/posts', (req, res) => {
    res.json(posts);
});

// Create post with file upload
app.post('/api/posts', upload.single('mediaFile'), (req, res) => {
    const { program, level, title, content, lecturer, mediaType } = req.body;
    let media = null;
    
    if (req.file) {
        media = {
            type: mediaType,
            url: `/uploads/${req.file.filename}`,
            filename: req.file.originalname
        };
    }
    
    const post = {
        id: Date.now(),
        program,
        level: parseInt(level),
        title,
        content,
        lecturer,
        media,
        date: new Date().toLocaleString()
    };
    
    posts.push(post);
    res.json({ success: true, post });
});

// Delete post
app.delete('/api/posts/:id', (req, res) => {
    posts = posts.filter(p => p.id != req.params.id);
    res.json({ success: true });
});

// Get all programs
app.get('/api/programs', (req, res) => {
    const programs = [
        "Bachelor of Education ICT",
        "Bachelor of Education (Science)",
        "Bachelor of Education (Languages)",
        "Bachelor of Education (Arts)",
        "BSc Information Communication Technology",
        "BSc Data Science",
        "BSc Nursing and Midwifery",
        "BA Communication Studies"
    ];
    res.json(programs);
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Mzuzu University Portal Running on port ${PORT}`);
});
