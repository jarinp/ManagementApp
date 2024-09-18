const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const loginRoutes = require('./routes/loginroutes');
const employeeRoutes = require('./routes/employeeroutes');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api', loginRoutes);
app.use('/api', employeeRoutes);

// Database Connection
mongoose.connect('mongodb+srv://jerinr050:jerin@employee-management.ffijk.mongodb.net/?retryWrites=true&w=majority&appName=employee-management', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Listen to Port
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
