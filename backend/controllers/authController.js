import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'medaid_default_secret', {
    expiresIn: '30d',
  });
};

// Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // In a real app, you would validate the password here
    // For this app, we'll just check if the user exists
    
    // Add a timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Database operation timed out')), 5000);
    });
    
    // Try to find or create user with timeout
    const userOperation = (async () => {
      const user = await User.findOne({ email: email.toLowerCase() });
      
      if (!user) {
        // If user doesn't exist, create a new user
        const newUser = new User({
          name: email.split('@')[0], // Use email prefix as name
          age: 0, // Default age
          email: email.toLowerCase(),
          language: 'English', // Default language
          past_history: {},
          records: [],
          created_at: new Date()
        });
        
        const savedUser = await newUser.save();
        
        // Generate token
        const token = generateToken(savedUser._id);
        
        return {
          status: 201,
          data: {
            token,
            user: savedUser
          }
        };
      } else {
        // User exists, generate token
        const token = generateToken(user._id);
        
        return {
          status: 200,
          data: {
            token,
            user
          }
        };
      }
    })();
    
    // Race the database operation against the timeout
    const result = await Promise.race([userOperation, timeoutPromise]);
    
    res.status(result.status).json(result.data);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Server error during login', 
      error: error.message 
    });
  }
};

// Register user
export const registerUser = async (req, res) => {
  try {
    const { name, age, email, language } = req.body;
    
    // Add a timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Database operation timed out')), 5000);
    });
    
    // Try to register user with timeout
    const registerOperation = (async () => {
      // Check if user already exists
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return {
          status: 400,
          data: { message: 'User already exists' }
        };
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
      
      // Generate token
      const token = generateToken(savedUser._id);
      
      return {
        status: 201,
        data: {
          token,
          user: savedUser
        }
      };
    })();
    
    // Race the database operation against the timeout
    const result = await Promise.race([registerOperation, timeoutPromise]);
    
    res.status(result.status).json(result.data);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: 'Server error during registration', 
      error: error.message 
    });
  }
};