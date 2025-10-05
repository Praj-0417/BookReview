const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    // Log full error to get more details (helps debug auth/network issues)
    console.error(err);
    process.exit(1);
  }
};

module.exports = connectDB;
