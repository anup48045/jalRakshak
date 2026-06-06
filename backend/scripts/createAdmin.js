require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jalrakshak');
    console.log('MongoDB Connected');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@delhi.gov.in' });
    if (existingAdmin) {
      console.log('Admin user already exists with email: admin@delhi.gov.in');
      console.log('Password: admin123');
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@delhi.gov.in',
      password: 'admin123',
      role: 'admin',
      district: 'Central Delhi'
    });

    console.log('✓ Admin user created successfully!');
    console.log('Email: admin@delhi.gov.in');
    console.log('Password: admin123');
    console.log('Role: admin');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error.message);
    process.exit(1);
  }
};

createAdmin();
