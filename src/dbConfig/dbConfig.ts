import mongoose from 'mongoose';

const connect = async () => {
  try {
    await mongoose.connect(process.env.mongo_url || 'mongodb://localhost:27017/eventspak')
    const connection = mongoose.connection;
    connection.on('connected', () => {
      console.log('MongoDB connected successfully');
    }
    );
    connection.on('error', (err) => {
        console.error(`MongoDB connection error: ${err.message}`);
        process.exit(1);
    });
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};

export { connect };