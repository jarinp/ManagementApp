import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
    Container, Box, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, TablePagination, FormControl, Select, MenuItem, InputLabel, Chip, FormControlLabel, Checkbox, Card, CardContent, Paper 
} from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [editEmployeeId, setEditEmployeeId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        designation: '',
        gender: '',
        course: [],
        image: null,
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

    const navigate = useNavigate(); // Initialize useNavigate

    // Fetch employees from the server
    const fetchEmployees = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/employee');
            setEmployees(response.data);
            setFilteredEmployees(response.data);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    useEffect(() => {
        fetchEmployees(); // Initial fetch
    }, []);

    useEffect(() => {
        const filtered = employees.filter((employee) =>
            employee.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredEmployees(filtered);
    }, [searchQuery, employees]);

    const handleEditClick = (employee) => {
        setEditEmployeeId(employee._id);
        setFormData({
            name: employee.name,
            email: employee.email,
            mobile: employee.mobile,
            designation: employee.designation,
            gender: employee.gender,
            course: employee.course,
            image: null,
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCourseChange = (e) => {
        const { value, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            course: checked
                ? [...prevData.course, value]
                : prevData.course.filter((item) => item !== value),
        }));
    };

    const handleImageChange = (e) => {
        setFormData({ ...formData, image: e.target.files[0] });
    };

    const handleSaveClick = async () => {
        const formDataToSend = new FormData();
        for (const key in formData) {
            formDataToSend.append(key, formData[key]);
        }

        try {
            await axios.put(`http://localhost:5000/api/employee/${editEmployeeId}`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            fetchEmployees(); // Refresh the list after updating
            setEditEmployeeId(null); // Exit edit mode
        } catch (error) {
            console.error('Error updating employee:', error);
        }
    };

    const handleCancelClick = () => {
        setEditEmployeeId(null); // Exit edit mode
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            try {
                await axios.delete(`http://localhost:5000/api/employee/${id}`);
                setEmployees(employees.filter((employee) => employee._id !== id));
            } catch (error) {
                console.error('Error deleting employee:', error);
            }
        }
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }

        const sortedEmployees = [...filteredEmployees].sort((a, b) => {
            if (a[key] < b[key]) {
                return direction === 'asc' ? -1 : 1;
            }
            if (a[key] > b[key]) {
                return direction === 'asc' ? 1 : -1;
            }
            return 0;
        });

        setSortConfig({ key, direction });
        setFilteredEmployees(sortedEmployees);
    };

    const handlePageChange = (event, newPage) => {
        setCurrentPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setCurrentPage(0);
    };

    const paginatedEmployees = filteredEmployees.slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage);

    const handleBackClick = () => {
        navigate('/dashboard'); // Navigate to dashboard or any other route
    };

    return (
        <Container
            maxWidth="xl"
            sx={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                background: 'linear-gradient(to right, #f0f4f8, #d9e2ec)',
                padding: 2,
                overflow: 'auto',
            }}
        >
            <Box sx={{ marginBottom: 2, display: 'flex', alignItems: 'center' }}>
                <Button variant="contained" color="secondary" onClick={handleBackClick}>
                    Back to Dashboard
                </Button>
                <Typography variant="h4" gutterBottom sx={{ color: '#333', fontWeight: 'bold', marginLeft: 2 }}>
                    Employee List
                </Typography>
            </Box>
            <Box sx={{ marginBottom: 2 }}>
                <TextField
                    label="Search by name"
                    variant="outlined"
                    fullWidth
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{ marginBottom: 2 }}
                />
            </Box>
            <Card sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
                    <TableContainer component={Paper} sx={{ flex: 1, overflow: 'auto' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Image</TableCell>
                                    <TableCell>
                                        <TableSortLabel
                                            active={sortConfig.key === 'name'}
                                            direction={sortConfig.direction}
                                            onClick={() => handleSort('name')}
                                        >
                                            Name
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>
                                        <TableSortLabel
                                            active={sortConfig.key === 'email'}
                                            direction={sortConfig.direction}
                                            onClick={() => handleSort('email')}
                                        >
                                            Email
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>
                                        <TableSortLabel
                                            active={sortConfig.key === 'mobile'}
                                            direction={sortConfig.direction}
                                            onClick={() => handleSort('mobile')}
                                        >
                                            Mobile No
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>
                                        <TableSortLabel
                                            active={sortConfig.key === 'designation'}
                                            direction={sortConfig.direction}
                                            onClick={() => handleSort('designation')}
                                        >
                                            Designation
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>
                                        <TableSortLabel
                                            active={sortConfig.key === 'gender'}
                                            direction={sortConfig.direction}
                                            onClick={() => handleSort('gender')}
                                        >
                                            Gender
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>Course</TableCell>
                                    <TableCell>
                                        <TableSortLabel
                                            active={sortConfig.key === 'createdAt'}
                                            direction={sortConfig.direction}
                                            onClick={() => handleSort('createdAt')}
                                        >
                                            Created At
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedEmployees.map((employee) => (
                                    <TableRow key={employee._id} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' } }}>
                                        <TableCell>
                                            {employee.image && (
                                                <img
                                                    src={`http://localhost:5000/uploads/${employee.image}`}
                                                    alt={employee.name}
                                                    width="50"
                                                    style={{ borderRadius: '50%' }}
                                                />
                                            )}
                                        </TableCell>
                                        {editEmployeeId === employee._id ? (
                                            <>
                                                <TableCell>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleImageChange}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <TextField
                                                        name="name"
                                                        value={formData.name}
                                                        onChange={handleInputChange}
                                                        fullWidth
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <TextField
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleInputChange}
                                                        fullWidth
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <TextField
                                                        name="mobile"
                                                        value={formData.mobile}
                                                        onChange={handleInputChange}
                                                        fullWidth
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <TextField
                                                        name="designation"
                                                        value={formData.designation}
                                                        onChange={handleInputChange}
                                                        fullWidth
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <FormControl fullWidth>
                                                        <InputLabel>Gender</InputLabel>
                                                        <Select
                                                            name="gender"
                                                            value={formData.gender}
                                                            onChange={handleInputChange}
                                                        >
                                                            <MenuItem value="Male">Male</MenuItem>
                                                            <MenuItem value="Female">Female</MenuItem>
                                                            <MenuItem value="Other">Other</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </TableCell>
                                                <TableCell>
                                                    <FormControl>
                                                        <FormControlLabel
                                                            control={
                                                                <Checkbox
                                                                    value="Course 1"
                                                                    checked={formData.course.includes('Course 1')}
                                                                    onChange={handleCourseChange}
                                                                />
                                                            }
                                                            label="Course 1"
                                                        />
                                                        <FormControlLabel
                                                            control={
                                                                <Checkbox
                                                                    value="Course 2"
                                                                    checked={formData.course.includes('Course 2')}
                                                                    onChange={handleCourseChange}
                                                                />
                                                            }
                                                            label="Course 2"
                                                        />
                                                        {/* Add more courses if needed */}
                                                    </FormControl>
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={handleSaveClick}
                                                    >
                                                        Save
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        color="secondary"
                                                        onClick={handleCancelClick}
                                                    >
                                                        Cancel
                                                    </Button>
                                                </TableCell>
                                            </>
                                        ) : (
                                            <>
                                                <TableCell>{employee.name}</TableCell>
                                                <TableCell>{employee.email}</TableCell>
                                                <TableCell>{employee.mobile}</TableCell>
                                                <TableCell>{employee.designation}</TableCell>
                                                <TableCell>{employee.gender}</TableCell>
                                                <TableCell>
                                                    {employee.course.map((c, i) => (
                                                        <Chip key={i} label={c} />
                                                    ))}
                                                </TableCell>
                                                <TableCell>{new Date(employee.createdAt).toLocaleDateString()}</TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={() => handleEditClick(employee)}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        color="error"
                                                        onClick={() => handleDelete(employee._id)}
                                                        sx={{ ml: 1 }}
                                                    >
                                                        Delete
                                                    </Button>
                                                </TableCell>
                                            </>
                                        )}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 50]}
                        component="div"
                        count={filteredEmployees.length}
                        rowsPerPage={rowsPerPage}
                        page={currentPage}
                        onPageChange={handlePageChange}
                        onRowsPerPageChange={handleRowsPerPageChange}
                    />
                </CardContent>
            </Card>
        </Container>
    );
};

export default EmployeeList;
