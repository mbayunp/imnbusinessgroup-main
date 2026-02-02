// backend/routes/uploadRoutes.js
import path from 'path';
import express from 'express';
import multer from 'multer';
import fs from 'fs'; // Tambahkan import fs (File System)

const router = express.Router();

// --- PERBAIKAN OTOMATIS FOLDER ---
const uploadDir = 'uploads/';

// Cek apakah folder uploads sudah ada? Jika belum, buatkan.
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Konfigurasi penyimpanan file
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir); // Gunakan variabel folder yang sudah dipastikan ada
  },
  filename(req, file, cb) {
    // Namai file: fieldname-tanggal.extensi
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Images only!');
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

router.post('/', upload.single('image'), (req, res) => {
  if (req.file) {
    // Ubah backslash (\) windows jadi slash (/) agar bisa dibaca browser
    const cleanPath = req.file.path.replace(/\\/g, '/');
    res.send(`/${cleanPath}`); 
  } else {
    res.status(400).send('No file uploaded');
  }
});

export default router;