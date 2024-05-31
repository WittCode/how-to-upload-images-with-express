import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const HOST = process.env.HOST;
const PORT = process.env.PORT;

const FILE_NAME = 'FILE_UPLOADED';
const HTML_FORM_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Image Uploader</title>
</head>
<body>
  <a href="/images">View Uploaded Images</a>
  <h1>Upload an image to Express</h1>
  <form method='post' action='/images' enctype="multipart/form-data">
    <input type='file' name='${FILE_NAME}'>
    <input type='submit'>
  </form>
</body>
</html>
`;

const app = express();
app.use(express.static(path.resolve(import.meta.dirname, 'public')));
const upload = multer({dest: path.resolve(import.meta.dirname, 'public')});

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  return next();
});

// Serve up HTML form
app.get('/', (req, res) => {
  return res.send(HTML_FORM_TEMPLATE);
});

// Handle image upload
app.post('/images', upload.single(FILE_NAME), (req, res) => {
  /**
     {
      fieldname: 'FILE_UPLOADED',
      originalname: 'jungle-symbol.png',
      encoding: '7bit',
      mimetype: 'image/png',
      destination: '/Users/wittcode/Documents/IN_PROGRESS/googleapis-login/src/uploads',
      filename: 'dcd071c0c6895d1815b82eb6786d8cd8',
      path: '/Users/wittcode/Documents/IN_PROGRESS/googleapis-login/src/uploads/dcd071c0c6895d1815b82eb6786d8cd8',
      size: 3721
    }
    */
  console.log(req.file);
  return res.redirect('/images');
});

// Display the uploaded images
app.get('/images', async (req, res) => {
  const images = await fs.promises.readdir(path.resolve(import.meta.dirname, 'public'));
  const HTML_IMAGES = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
  </head>
  <body>
    <a href="/">Home</a>
    <h1>Uploaded Images</h1>
    ${images.map(i => `<img height="300px" width="200px" src="${i}">`).join('')}
  </body>
  </html>`;
  return res.send(HTML_IMAGES);
});

app.listen(PORT, HOST, () => {
  console.log(`Server running on ${HOST}:${PORT}`);
});