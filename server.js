const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();

// Set up storage for video files using Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/videos'); // Store videos in the "uploads/videos" folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Use a timestamp as the filename
  }
});

const upload = multer({ storage: storage });

// Serve static files (like video files)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Handle video upload
app.post('/upload', upload.single('video'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  const videoPath = `/uploads/videos/${req.file.filename}`;
  res.json({ videoPath: videoPath }); // Return the video path to the client
});

// Handle video deletion
app.delete('/delete/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'uploads/videos', req.params.filename);
  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(500).send('Failed to delete video.');
    }
    res.send('Video deleted successfully.');
  });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
