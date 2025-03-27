import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes';
import chatRoutes from './routes/chatRoutes';
import conversationRoutes from './routes/conversationRoutes';
import { connectDb } from './config/db';
import 'dotenv/config';

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

const app = express();

// Improved CORS configuration
const allowedOrigins = [
  'https://perpsbot-joshfermano.vercel.app',
  'https://perpsbot-joshfermano-git-main-josh-khovick-fermanos-projects.vercel.app',
  'https://perpsbot-joshfermano-im374hg6x-josh-khovick-fermanos-projects.vercel.app',
  CLIENT_URL,
  'http://localhost:5173',
];

// Use a single CORS configuration - this is critical for consistency
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin) || NODE_ENV === 'development') {
        // Set the specific origin instead of '*'
        callback(null, true);
      } else {
        console.log('Blocked by CORS:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: [
      'Access-Control-Allow-Origin',
      'Access-Control-Allow-Credentials',
    ],
    optionsSuccessStatus: 200,
  })
);

// Special handling for OPTIONS requests (preflight)
app.options('*', cors());

app.use(cookieParser());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/conversations', conversationRoutes);

// Simple health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', environment: NODE_ENV });
});

const startServer = async () => {
  try {
    const isConnected = await connectDb();

    if (!isConnected) {
      console.error('❌ Failed to start: MongoDB connection unsuccessful');
      process.exit(1);
    } else {
      console.log('✅ MongoDB connection successful');
    }

    app.listen(PORT, () => {
      console.log(`✨ Server running in ${NODE_ENV} mode on port: ${PORT}`);
      console.log(`🌐 CORS enabled for origins: ${allowedOrigins.join(', ')}`);
    });
  } catch (error) {
    console.error('❌ Server startup failed:', error);
    process.exit(1);
  }
};

startServer();

export default app;
