const express = require('express');
const multer = require('multer');
const fs = require('fs-extra');
const path = require('path');

const app = express();
const port = 3000;

const imageDir = path.join(__dirname, 'public', 'images');
fs.ensureDirSync(imageDir);

const storage = multer.diskStorage({
  destination: imageDir,
  filename: (req, file, cb) => cb(null, file.originalname)
});
const upload = multer({ storage });

app.use('/images', express.static(imageDir));

app.post('/upload', upload.single('image'), (req, res) => {
  res.send(`Đã upload ảnh: ${req.file.originalname}`);
});

app.delete('/delete/:filename', (req, res) => {
  const filePath = path.join(imageDir, req.params.filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    res.send(`Đã xóa ảnh: ${req.params.filename}`);
  } else {
    res.status(404).send('Không tìm thấy ảnh');
  }
});

app.get('/list', (req, res) => {
  const files = fs.readdirSync(imageDir);
  res.json(files);
});

app.listen(port, () => {
  console.log(`Server chạy tại http://localhost:${port}`);
});

app.get('/', (req, res) => {
  res.send('Hello! Server đang chạy. Dùng /upload, /list, /images để xem ảnh.');
});
