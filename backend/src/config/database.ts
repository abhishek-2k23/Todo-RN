import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.DB_URL || 'mongodb://127.0.0.1:27017/todo-app';
    
    if (!process.env.DB_URL) {
      console.warn('Warning: Using default MongoDB URI. Please set DB_URL in your .env file for production.');
    }
    
    // Add connection options
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    };

    console.log('Attempting to connect to MongoDB at:', mongoURI);
    
    await mongoose.connect(mongoURI, options);
    
    // Get the default connection
    const db = mongoose.connection;
    
    // Handle connection events
    db.on('error', (error) => {
      console.error('MongoDB connection error:', error);
    });
    
    db.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });
    
    db.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });
    
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    // Don't exit the process, let the application handle the error
    throw error;
  }
};

export default connectDB; 