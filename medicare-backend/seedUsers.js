import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const seedUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Hash passwords
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create test users
    const testUsers = [
      {
        name: 'Dr. Sarah Johnson',
        email: 'doctor@test.com',
        password: hashedPassword,
        role: 'doctor',
        specialization: 'Cardiology',
        qualifications: 'MD, PhD in Cardiology'
      },
      {
        name: 'John Doe',
        email: 'patient@test.com',
        password: hashedPassword,
        role: 'patient'
      }
    ];

    // Insert test users
    await User.insertMany(testUsers);
    console.log('Test users created successfully');

    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
};

seedUsers();