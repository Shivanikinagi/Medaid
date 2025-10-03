import User from '../models/User.js';

// Helper function to add timeout to database operations
const withTimeout = (promise, timeout = 5000) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Database operation timed out')), timeout)
    )
  ]);
};

// Get user by email
export const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    console.log('🔧 Fetching user by email:', email);
    console.log('🔧 Decoded email:', decodeURIComponent(email));
    console.log('🔧 Lowercase email:', decodeURIComponent(email).toLowerCase());
    
    // Decode the email parameter in case it's URL encoded
    const decodedEmail = decodeURIComponent(email).toLowerCase();
    
    console.log('🔧 Querying MongoDB for user with email:', decodedEmail);
    
    // Check if User model is properly imported
    if (!User) {
      console.error('❌ User model is undefined!');
      return res.status(500).json({ message: 'User model not available' });
    }
    
    console.log('🔧 User model is available, proceeding with query');
    
    // Add timeout to database operation
    const user = await withTimeout(User.findOne({ email: decodedEmail }));
    
    if (!user) {
      console.log('🔍 User not found for email:', decodedEmail);
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log('✅ User found:', user.name);
    res.status(200).json(user);
  } catch (error) {
    console.error('💥 Error fetching user:', error);
    console.error('💥 Error stack:', error.stack);
    res.status(500).json({ 
      message: 'Server error during user fetch', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
  }
};

// Create a new user
export const createUser = async (req, res) => {
  try {
    const { name, age, email, language } = req.body;
    console.log('🔧 Creating new user:', name, email);
    
    // Decode the email parameter in case it's URL encoded
    const decodedEmail = decodeURIComponent(email).toLowerCase();
    
    // Add timeout to database operations
    const existingUser = await withTimeout(User.findOne({ email: decodedEmail }));
    
    // Check if user already exists
    if (existingUser) {
      console.log('🔍 User already exists:', existingUser.name);
      return res.status(200).json(existingUser);
    }
    
    // Create new user
    const user = new User({
      name,
      age: parseInt(age),
      email: decodedEmail,
      language: language || 'English',
      past_history: {},
      records: [],
      created_at: new Date()
    });
    
    const savedUser = await withTimeout(user.save());
    console.log('✅ New user created successfully:', savedUser.name);
    res.status(201).json(savedUser);
  } catch (error) {
    console.error('💥 Error creating user:', error);
    console.error('💥 Error stack:', error.stack);
    res.status(500).json({ 
      message: 'Server error during user creation', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
  }
};

// Update user history
export const updateUserHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const { history_dict, session_record } = req.body;
    
    console.log('🔧 Updating user history for user ID:', userId);
    
    const updateFields = { past_history: history_dict };
    
    if (session_record) {
      updateFields.$push = { records: session_record };
    }
    
    // Add timeout to database operation
    const updatedUser = await withTimeout(
      User.findByIdAndUpdate(
        userId,
        updateFields,
        { new: true }
      )
    );
    
    if (!updatedUser) {
      console.log('🔍 User not found for history update:', userId);
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log('✅ User history updated successfully for:', updatedUser.name);
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('💥 Error updating user history:', error);
    console.error('💥 Error stack:', error.stack);
    res.status(500).json({ 
      message: 'Server error during history update', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
  }
};

// Update user report data
export const updateUserReportData = async (req, res) => {
  try {
    const { userId } = req.params;
    const { report_data } = req.body;
    
    console.log('🔧 Updating user report data for user ID:', userId);
    
    // Add timeout to database operation
    const updatedUser = await withTimeout(
      User.findByIdAndUpdate(
        userId,
        { report_data },
        { new: true }
      )
    );
    
    if (!updatedUser) {
      console.log('🔍 User not found for report data update:', userId);
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log('✅ User report data updated successfully for:', updatedUser.name);
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('💥 Error updating user report data:', error);
    console.error('💥 Error stack:', error.stack);
    res.status(500).json({ 
      message: 'Server error during report data update', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
  }
};