import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box, Grid } from '@mui/material';

const Dashboard = () => {
    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundImage: 'linear-gradient(135deg, #f3e5f5, #e1bee7)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Dashboard
                    </Typography>
                    <Button color="inherit" component={Link} to="/">
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>

            <Container
                maxWidth="md"
                sx={{
                    marginTop: 4,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Box
                    sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        padding: 4,
                        borderRadius: 2,
                        boxShadow: 3,
                        width: '100%',
                    }}
                >
                    <Typography variant="h4" gutterBottom align="center">
                        Welcome to the Dashboard
                    </Typography>

                    <Grid container spacing={2} justifyContent="center">
                        <Grid item>
                            <Button
                                component={Link}
                                to="/employee-list"
                                variant="contained"
                                color="primary"
                                sx={{ minWidth: 150 }}
                            >
                                Employee List
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                component={Link}
                                to="/create-employee"
                                variant="contained"
                                color="secondary"
                                sx={{ minWidth: 150 }}
                            >
                                Create Employee
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </Box>
    );
};

export default Dashboard;
