const express = require('express');
const router = express.Router();
const Login = require('../models/login');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// POST: Register new user
router.post('/register', async (req, res) => {
    const { userName, password } = req.body;

    try {
        let user = await Login.findOne({ userName });
        if (user) return res.status(400).json({ message: 'User already exists' });

        // Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new Login({ userName, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ id: user._id }, 'secret', { expiresIn: '1h' });
        res.status(201).json({ token });
    } catch (error) {
        res.status(500).send('Server error');
    }
});

// Existing login route remains here
router.post('/login', async (req, res) => {
    const { userName, password } = req.body;

    try {
        const user = await Login.findOne({ userName });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, 'secret', { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).send('Server error');
    }
});

module.exports = router;
