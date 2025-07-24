import mongoose from 'mongoose';

let isConnected = false;

const connect = async () => {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eventspak');

    const connection = mongoose.connection;

    if (connection.listeners('connected').length === 0) {
      connection.on('connected', () => {
        console.log('MongoDB connected successfully');
      });
    }

    if (connection.listeners('error').length === 0) {
      connection.on('error', (err) => {
        console.error(`MongoDB connection error: ${err.message}`);
        process.exit(1);
      });
    }

    isConnected = true;
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};

export { connect };
