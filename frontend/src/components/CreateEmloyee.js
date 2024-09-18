import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    TextField, Button, Checkbox, FormControlLabel, FormControl, InputLabel, Select, MenuItem,
    Grid, Typography, Paper, FormGroup, Box
} from '@mui/material';

const CreateEmployee = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        designation: '',
        gender: '',
        course: [],
        image: null
    });

    const [fileError, setFileError] = useState('');
    const navigate = useNavigate();

    const maxFileSize = 2 * 1024 * 1024; // 2MB

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            handleFileChange(e);
        } else if (type === 'checkbox') {
            setFormData((prevData) => ({
                ...prevData,
                course: prevData.course.includes(value)
                    ? prevData.course.filter((item) => item !== value)
                    : [...prevData.course, value]
            }));
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const validTypes = ['image/jpeg', 'image/png', 'image/gif'];

        if (file && validTypes.includes(file.type)) {
            if (file.size <= maxFileSize) {
                setFormData({ ...formData, image: file });
                setFileError(''); // Clear error if file size is valid
            } else {
                setFileError('File size exceeds the 2MB limit.');
            }
        } else {
            alert('Please upload a valid image file (jpeg, png, gif)');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (fileError) return; // Stop submission if file size is too large

        const form = new FormData();
        for (const key in formData) {
            if (Array.isArray(formData[key])) {
                formData[key].forEach((item) => form.append(key, item));
            } else {
                form.append(key, formData[key]);
            }
        }

        try {
            const response = await axios.post('http://localhost:5000/api/employee', form, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('Employee created successfully!');
            navigate("/employee-list");
        } catch (error) {
            console.error('Error creating employee:', error.response?.data || error.message);
            if (error.response?.data?.message) {
                alert(error.response.data.message);
            } else {
                alert('Failed to create employee!');
            }
        }
    };

    return (
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <Paper elevation={3} sx={{ p: 4, width: '500px' }}>
                <Typography variant="h4" component="h1" align="center" gutterBottom>
                    Create Employee
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Mobile No"
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Designation</InputLabel>
                                <Select
                                    name="designation"
                                    value={formData.designation}
                                    onChange={handleChange}
                                    required
                                >
                                    <MenuItem value="">Select</MenuItem>
                                    <MenuItem value="Developer">Developer</MenuItem>
                                    <MenuItem value="Manager">Manager</MenuItem>
                                    <MenuItem value="Designer">Designer</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Gender</InputLabel>
                                <Select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    required
                                >
                                    <MenuItem value="">Select</MenuItem>
                                    <MenuItem value="Male">Male</MenuItem>
                                    <MenuItem value="Female">Female</MenuItem>
                                    <MenuItem value="Other">Other</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormGroup>
                                <Typography>Courses:</Typography>
                                <FormControlLabel
                                    control={<Checkbox checked={formData.course.includes('Course1')} onChange={handleChange} name="course" value="Course1" />}
                                    label="Course 1"
                                />
                                <FormControlLabel
                                    control={<Checkbox checked={formData.course.includes('Course2')} onChange={handleChange} name="course" value="Course2" />}
                                    label="Course 2"
                                />
                                <FormControlLabel
                                    control={<Checkbox checked={formData.course.includes('Course3')} onChange={handleChange} name="course" value="Course3" />}
                                    label="Course 3"
                                />
                            </FormGroup>
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                component="label"
                                fullWidth
                            >
                                Upload Image
                                <input
                                    type="file"
                                    name="image"
                                    onChange={handleChange}
                                    hidden
                                    required
                                />
                            </Button>
                            {fileError && <Typography color="error" variant="body2">{fileError}</Typography>}
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="contained" color="primary" type="submit" fullWidth>
                                Create Employee
                            </Button>
                        </Grid>
                    </Grid>
                </form>
                <Button
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() => navigate('/dashboard')}
                >
                    Back to Dashboard
                </Button>
            </Paper>
        </Box>
    );
};

export default CreateEmployee;
