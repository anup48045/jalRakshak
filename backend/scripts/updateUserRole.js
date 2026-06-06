require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const updateUserRole = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jalrakshak');
    console.log('MongoDB Connected');

    // Find user by email or name
    const user = await User.findOne({ 
      $or: [
        { email: 'anup' },
        { name: 'Anup' },
        { email: /anup/i }
      ]
    });

    if (!user) {
      console.log('User "Anup" not found in database');
      console.log('Available users:');
      const allUsers = await User.find({}, { name: 1, email: 1, role: 1 });
      allUsers.forEach(u => {
        console.log(`- ${u.name} (${u.email}) - Role: ${u.role}`);
      });
      process.exit(1);
    }

    console.log(`Found user: ${user.name} (${user.email}) - Current role: ${user.role}`);

    // Update role to officer
    user.role = 'officer';
    await user.save();

    console.log(`✓ Updated user role to: ${user.role}`);
    console.log('You can now login and access the Survey Officer Dashboard');
    process.exit(0);
  } catch (error) {
    console.error('Error updating user role:', error.message);
    process.exit(1);
  }
};

updateUserRole();
