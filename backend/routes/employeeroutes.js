const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Employee = require('../models/employee'); // Import the Employee model

const router = express.Router();

// Ensure 'uploads/' directory exists
const uploadDir = 'uploads/';

// Check if directory exists, if not, create it
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Save files in the 'uploads/' folder
    },
    filename: (req, file, cb) => {
        // Generate a unique name by appending timestamp
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName); // Save the file with a unique name
    }
});

// Multer middleware
const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB limit
    fileFilter: (req, file, cb) => {
        // Accept only image files
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
}).single('image');

// POST: Create employee
router.post('/employee', (req, res) => {
    upload(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            // Multer-specific errors
            return res.status(400).json({ message: err.message });
        } else if (err) {
            // Other errors
            return res.status(400).json({ message: err.message });
        }

        const { name, email, mobile, designation, gender, course } = req.body;

        if (!name || !email || !mobile || !designation || !gender || !course) {
            // Remove the uploaded image if other fields are invalid
            if (req.file) fs.unlinkSync(path.join(uploadDir, req.file.filename));
            return res.status(400).json({ message: 'All fields are required' });
        }

        try {
            const employee = new Employee({
                name,
                email,
                mobile,
                designation,
                gender,
                course,
                image: req.file?.filename // Save filename if image is uploaded
            });

            await employee.save();
            res.status(201).json(employee);
        } catch (error) {
            console.error('Error creating employee:', error);
            // Remove uploaded file if an error occurs during database save
            if (req.file) fs.unlinkSync(path.join(uploadDir, req.file.filename));
            res.status(500).json({ message: 'Server error' });
        }
    });
});

// GET: List employees
router.get('/employee', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/employee/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Employee.findByIdAndDelete(id);
        
        if (!result) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (error) {
        console.error('Error deleting employee:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.put('/employee/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const updatedEmployee = await Employee.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedEmployee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.status(200).json(updatedEmployee);
    } catch (error) {
        console.error('Error updating employee:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});


module.exports = router;
