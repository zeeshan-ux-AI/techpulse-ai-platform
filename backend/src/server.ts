import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { CONFIG } from './config';
import routes from './routes';

const app = express();

// Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'TechPulse AI API', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api', routes);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
  });
});

app.listen(CONFIG.PORT, () => {
  console.log(`🚀 TechPulse AI Backend running on port ${CONFIG.PORT} (${CONFIG.NODE_ENV})`);
});
