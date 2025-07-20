import multer from 'multer';
import path from 'path';

// Storage config: destination and filename
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/'); // Save files in 'uploads/' folder
  },
  filename(req, file, cb) {
    // Unique filename: timestamp + original extension
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});

// File filter: allow only specific types (PDF, audio)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|mp3|wav|m4a/;
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type. Only PDF and audio allowed.'));
  }
};

// Max file size 10MB
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

export default upload;
