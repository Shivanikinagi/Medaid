import User from '../models/User.js';

// Get user by email
export const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    console.log('Fetching user by email:', email);
    
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log('User found:', user.name);
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ 
      message: 'Server error during user fetch', 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

// Create a new user
export const createUser = async (req, res) => {
  try {
    const { name, age, email, language } = req.body;
    console.log('Creating new user:', name, email);
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      console.log('User already exists:', existingUser.name);
      return res.status(200).json(existingUser);
    }
    
    // Create new user
    const user = new User({
      name,
      age: parseInt(age),
      email: email.toLowerCase(),
      language: language || 'English',
      past_history: {},
      records: [],
      created_at: new Date()
    });
    
    const savedUser = await user.save();
    console.log('New user created successfully:', savedUser.name);
    res.status(201).json(savedUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ 
      message: 'Server error during user creation', 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

// Update user history
export const updateUserHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const { history_dict, session_record } = req.body;
    
    console.log('Updating user history for user ID:', userId);
    
    const updateFields = { past_history: history_dict };
    
    if (session_record) {
      updateFields.$push = { records: session_record };
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateFields,
      { new: true }
    );
    
    if (!updatedUser) {
      console.log('User not found for history update:', userId);
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log('User history updated successfully for:', updatedUser.name);
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user history:', error);
    res.status(500).json({ 
      message: 'Server error during history update', 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

// Update user report data
export const updateUserReportData = async (req, res) => {
  try {
    const { userId } = req.params;
    const { report_data } = req.body;
    
    console.log('Updating user report data for user ID:', userId);
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { report_data },
      { new: true }
    );
    
    if (!updatedUser) {
      console.log('User not found for report data update:', userId);
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log('User report data updated successfully for:', updatedUser.name);
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user report data:', error);
    res.status(500).json({ 
      message: 'Server error during report data update', 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};