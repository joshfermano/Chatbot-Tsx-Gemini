import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes';
import chatRoutes from './routes/chatRoutes';
import conversationRoutes from './routes/conversationRoutes';
import { connectDb } from './config/db';
import 'dotenv/config';

const PORT = process.env.PORT;

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

app.use(cookieParser());

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/conversations', conversationRoutes);

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
      console.log(`✨ Server running on port: ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Server startup failed:', error);
    process.exit(1);
  }
};

startServer();

export default app;
