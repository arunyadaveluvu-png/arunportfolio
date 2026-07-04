import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { supabase } from './config/supabase';

// Import routes
import projectsRouter from './routes/projects';
import skillsRouter from './routes/skills';
import certificatesRouter from './routes/certificates';
import educationRouter from './routes/education';
import profileRouter from './routes/profile';
import galleryRouter from './routes/gallery';
import messagesRouter from './routes/messages';
import settingsRouter from './routes/settings';
import statsRouter from './routes/stats';
import contactRouter from './routes/contact';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // Allow all origins in development (can restrict in production)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Root check route
app.get('/', (req, res) => {
  res.json({ message: 'Premium Portfolio Website API v1.0.0 is running!' });
});

// Mount Public / Admin routes
app.use('/api/projects', projectsRouter);
app.use('/api/skills', skillsRouter);
app.use('/api/certificates', certificatesRouter);
app.use('/api/education', educationRouter);
app.use('/api/profile', profileRouter);
app.use('/api/gallery', galleryRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/stats', statsRouter);
app.use('/api/contact', contactRouter);

// Public route to log page visits (used by frontend)
app.post('/api/visitor-log', async (req, res) => {
  const { page_visited } = req.body;
  const ipAddress = req.ip || req.headers['x-forwarded-for']?.toString() || 'unknown';
  const userAgent = req.headers['user-agent'] || 'unknown';

  try {
    const { error } = await supabase.from('visitor_logs').insert([{
      ip_address: ipAddress,
      user_agent: userAgent,
      page_visited: page_visited || 'Home'
    }]);

    if (error) {
      console.error('Failed to insert visitor log:', error);
      throw error;
    }

    return res.json({ success: true, message: 'Visit logged successfully.' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to log visitor action.' });
  }
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
