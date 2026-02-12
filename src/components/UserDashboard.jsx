import React, { useState, useMemo, useEffect } from 'react';
import {
    Box, AppBar, Toolbar, Typography, IconButton, Container, Grid,
    Card, Avatar, Divider, createTheme,
    ThemeProvider, CssBaseline, Tooltip
} from '@mui/material';
import { DarkMode, LightMode, Download, School} from '@mui/icons-material';

export default function UserDashboard() {
    const [mode, setMode] = useState(localStorage.getItem('theme') || 'dark');

    useEffect(() => {
        fetch("http://localhost:8081/diploma/student?name=Max%20Mustermann")
            .then(res => res.json())
            .then(setMyDiplomas)
            .catch(console.error);
    }, []);

    const theme = useMemo(() => createTheme({
        palette: {
            mode,
            primary: { main: '#646cff' },
            background: {
                default: mode === 'dark' ? '#121212' : '#f8f9fa',
                paper: mode === 'dark' ? '#1e1e1e' : '#ffffff',
            },
        },
        components: {
            MuiCssBaseline: {
                styleOverrides: {
                    body: { transition: 'background-color 0.3s ease, color 0.3s ease' },
                },
            },
        },
    }), [mode]);

    const toggleTheme = () => {
        const newMode = mode === 'dark' ? 'light' : 'dark';
        setMode(newMode);
        localStorage.setItem('theme', newMode);
    };

    const [user] = useState({
        name: "Max Mustermann",
        beruf: "Fullstack Entwickler",
        email: "max@beispiel.de",
        ort: "Berlin, Deutschland"
    });

    const [myDiplomas, setMyDiplomas] = useState([]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

                {/* TOPBAR */}
                <AppBar position="sticky" elevation={0} sx={{
                    bgcolor: 'background.paper',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    color: 'text.primary'
                }}>
                    <Toolbar>
                        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 800, letterSpacing: 1 }}>
                            Bachelor4All
                        </Typography>
                        <IconButton onClick={toggleTheme} color="inherit">
                            {mode === 'dark' ? <LightMode sx={{color: '#ffb700'}} /> : <DarkMode sx={{color: '#4f46e5'}} />}
                        </IconButton>
                    </Toolbar>
                </AppBar>

                <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
                    <Grid container spacing={4}>

                        <Grid item xs={12} md={3}>
                            <Box sx={{
                                position: { md: 'sticky' },
                                top: 100,
                            }}>
                                <Card elevation={0} sx={{
                                    p: 3,
                                    borderRadius: 4,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    textAlign: 'center',
                                    bgcolor: 'background.paper'
                                }}>
                                    <Avatar sx={{
                                        width: 80, height: 80, mx: 'auto', mb: 2,
                                        bgcolor: 'primary.main', fontSize: '2rem'
                                    }}>
                                        {user.name.charAt(0)}
                                    </Avatar>

                                    <Typography variant="h6" fontWeight="bold">{user.name}</Typography>
                                    <Typography color="primary" variant="caption" sx={{ display: 'block', mb: 2, fontWeight: 600, textTransform: 'uppercase' }}>
                                        {user.beruf}
                                    </Typography>

                                    <Divider sx={{ my: 2 }} />

                                    <Box sx={{ textAlign: 'left' }}>
                                        <Typography variant="caption" color="text.secondary">KONTAKT</Typography>
                                        <Typography variant="body2" sx={{ mb: 2, mt: 0.5, fontWeight: 500 }}>{user.email}</Typography>

                                        <Typography variant="caption" color="text.secondary">STANDORT</Typography>
                                        <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 500 }}>{user.ort}</Typography>
                                    </Box>
                                </Card>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={9}>
                            <Box sx={{ mb: 3, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                                <Typography variant="h4" fontWeight="900" sx={{ letterSpacing: -0.5 }}>
                                    Zertifikate
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, ml: 2}}>
                                    {myDiplomas.length} Einträge gefunden
                                </Typography>
                            </Box>

                            <Grid container spacing={2}>
                                {myDiplomas.map((cert) => (
                                    <Grid item xs={12} key={cert.id}>
                                        <Card elevation={0} sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            p: 2.5,
                                            borderRadius: 3,
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            transition: 'all 0.2s ease-in-out',
                                            '&:hover': {
                                                borderColor: 'primary.main',
                                                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                                transform: 'translateX(4px)'
                                            }
                                        }}>
                                            <Box sx={{
                                                bgcolor: 'primary.main',
                                                color: 'white',
                                                p: 1.5,
                                                borderRadius: 2,
                                                mr: 3,
                                                display: 'flex',
                                                boxShadow: '0 4px 12px rgba(100, 108, 255, 0.3)'
                                            }}>
                                                <School />
                                            </Box>

                                            <Box sx={{ flexGrow: 1 }}>
                                                <Typography variant="h6" sx={{ fontSize: '1.1rem', lineHeight: 1.2, fontWeight: 700 }}>
                                                    {cert.title}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                                    {cert.institution} • <span style={{ opacity: 0.7 }}>{cert.publicationYear}</span>
                                                </Typography>
                                            </Box>

                                            <Tooltip title="Herunterladen">
                                                <IconButton
                                                    component="a"
                                                    href={cert.url}
                                                    download
                                                    sx={{
                                                        border: '1px solid',
                                                        ml: 1,
                                                        borderColor: 'divider',
                                                        '&:hover': { bgcolor: 'primary.main', color: 'white', borderColor: 'primary.main' }
                                                    }}
                                                >
                                                    <Download />
                                                </IconButton>
                                            </Tooltip>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>

                    </Grid>
                </Container>
            </Box>
        </ThemeProvider>
    );
}
