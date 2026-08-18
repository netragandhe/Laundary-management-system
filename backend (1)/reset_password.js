const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to DB');
    const User = require('./src/models/User');
    const u = await User.findOne({ email: 'robert@tuhama.com' });
    if (u) {
      u.passwordHash = 'rider123';
      await u.save();
      console.log('Success! Password for robert@tuhama.com reset to: rider123');
    } else {
      console.log('User robert@tuhama.com not found in the database. Please create a delivery staff user from the Super Admin panel.');
    }
    process.exit();
  })
  .catch(err => {
    console.error('Error connecting to DB:', err);
    process.exit(1);
  });
