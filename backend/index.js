import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import postRoutes from './routes/posts.js';
import searchRoutes from './routes/search.js';
import notificationsRoutes from './routes/notifications.js';
import saveRoutes from './routes/save.js';
import { register } from './controllers/auth.js';
import { createPost } from './controllers/posts.js';
import { verifyToken } from './middleware/auth.js';
import pictureRoutes from './routes/picture.js';

/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(morgan('common'));
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

/* FILE STORAGE */
const storage = multer.memoryStorage(); // Storing in memory to upload directly to Firebase
const upload = multer({ storage });

app.get('/ping', (req, res) => {
  res.send('Pong 2.');
});

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

/* ROUTES WITH FILES */
app.get('/about', (req, res) => {
  const filePath = path.join(__dirname, 'about.html');
  
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      res.status(500).send('Error reading about.html');
      return;
    }
    
    res.send(data);
  });
});

app.get('/terms', (req, res) => {
  const filePath = path.join(__dirname, 'TikTour Terms and Conditions.html');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      res.status(500).send('Error reading TikTour Terms and Conditions.html');
      return;
    }
    
    res.send(data);
  });
});

app.post('/auth/register', register);

/* ROUTES */
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/posts', postRoutes);
app.use('/search', searchRoutes);
app.use('/picture', pictureRoutes);
app.use('/notifications', notificationsRoutes);
app.use('/save', saveRoutes);

/* MONGOOSE SETUP */
mongoose.set('strictQuery', false); // Set here before connecting

const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    if (process.env.NODE_ENV !== 'test') {
      app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
    }
  })
  .catch((error) => console.log(`${error} did not connect`));

export default app;