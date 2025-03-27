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

// Configure CORS based on environment
const corsOptions = {
  origin:
    NODE_ENV === 'production'
      ? [CLIENT_URL, 'https://perpsbot-joshfermano.vercel.app']
      : CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

// Remove the problematic middleware - we'll handle cookies directly in controllers

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
      console.log(`🌐 CORS enabled for origin: ${corsOptions.origin}`);
    });
  } catch (error) {
    console.error('❌ Server startup failed:', error);
    process.exit(1);
  }
};

startServer();

export default app;
