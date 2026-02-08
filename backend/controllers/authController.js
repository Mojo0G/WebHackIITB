const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register new user
// @route   POST /api/auth/register
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    console.log('📝 Register attempt:', email);
    
    // Validate required fields
    if (!name || !email || !password) {
      console.log('⚠️  Missing required fields');
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log('⚠️  User already exists:', email);
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const user = await User.create({ name, email, passwordHash: password });
    console.log('✅ User registered successfully:', user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('❌ Registration error:', error.message);
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('🔑 Login attempt:', email);
    
    // Validate required fields
    if (!email || !password) {
      console.log('⚠️  Missing email or password');
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('⚠️  User not found:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordMatch = await user.matchPassword(password);
    
    if (!isPasswordMatch) {
      console.log('⚠️  Invalid password for user:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log('✅ Login successful:', user._id);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('❌ Login error:', error.message);
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};