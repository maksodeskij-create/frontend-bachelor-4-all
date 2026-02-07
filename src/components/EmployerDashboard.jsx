import React, { useState, useMemo } from 'react';
import {
    Box, AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem,
    ListItemIcon, ListItemText, Divider, Container, Grid, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, Paper, Button,
    Chip, Avatar, createTheme, ThemeProvider, CssBaseline, TextField, InputAdornment
} from '@mui/material';
import {
    DarkMode, LightMode, Search, VerifiedUser, Business,
    Group, History, FileDownload
} from '@mui/icons-material';

const drawerWidth = 260;

function EmployerDashboard() {
    const [mode, setMode] = useState(localStorage.getItem('theme') || 'dark');
    const [activeTab, setActiveTab] = useState('Verifizierung');

    // Beispieldaten für den Arbeitgeber
    const [verifizierteZerts] = useState([
        { id: 1, student: "Max Mustermann", titel: "React Professional", code: "CERT-8821", status: "Gültig" },
        { id: 2, student: "Erika Muster", titel: "Cloud Architect", code: "CERT-1092", status: "Gültig" },
    ]);

    const theme = useMemo(() => createTheme({
        palette: {
            mode,
            primary: { main: '#646cff' },
            background: {
                default: mode === 'dark' ? '#0f0f0f' : '#f4f6f8',
                paper: mode === 'dark' ? '#1a1a1a' : '#ffffff'
            }
        },
        shape: { borderRadius: 12 }
    }), [mode]);

    const toggleTheme = () => {
        const newMode = mode === 'dark' ? 'light' : 'dark';
        setMode(newMode);
        localStorage.setItem('theme', newMode);
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ display: 'flex' }}>

                {/* TOPBAR */}
                <AppBar position="fixed" elevation={0} sx={{ zIndex: (t) => t.zIndex.drawer + 1, bgcolor: 'background.paper', color: 'text.primary', borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Toolbar>
                        <Business sx={{ mr: 2, color: 'primary.main' }} />
                        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}><span style={{ color: '#646cff' }}>Bachelor4All</span></Typography>
                        <IconButton onClick={toggleTheme} color="inherit">
                            {mode === 'dark' ? <LightMode sx={{color: '#ffb700'}} /> : <DarkMode sx={{color: '#4f46e5'}} />}
                        </IconButton>
                    </Toolbar>
                </AppBar>

                {/* SIDEBAR */}
                <Drawer variant="permanent" sx={{ width: drawerWidth, flexShrink: 0, [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' } }}>
                    <Toolbar />
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Avatar sx={{ width: 54, height: 54, mx: 'auto', mb: 1, bgcolor: 'secondary.main' }} variant="rounded">
                            <Business />
                        </Avatar>
                        <Typography variant="subtitle2" fontWeight="bold">Tech Corp GmbH</Typography>
                        <Typography variant="caption" color="text.secondary">Premium Partner</Typography>
                    </Box>
                    <Divider sx={{ mx: 2, mb: 2 }} />
                    <List sx={{ px: 2 }}>
                        {[
                            { text: 'Verifizierung', icon: <VerifiedUser /> }
                        ].map((item) => (
                            <ListItem
                                button
                                key={item.text}
                                onClick={() => setActiveTab(item.text)}
                                sx={{
                                    borderRadius: 2, mb: 1,
                                    bgcolor: activeTab === item.text ? 'rgba(100, 108, 255, 0.1)' : 'transparent',
                                    color: activeTab === item.text ? 'primary.main' : 'inherit'
                                }}
                            >
                                <ListItemIcon sx={{ color: activeTab === item.text ? 'primary.main' : 'inherit' }}>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: activeTab === item.text ? 700 : 400 }} />
                            </ListItem>
                        ))}
                    </List>
                </Drawer>

                {/* CONTENT */}
                <Box component="main" sx={{ flexGrow: 1, p: 4, width: `calc(100% - ${drawerWidth}px)` }}>
                    <Toolbar />
                    <Container maxWidth="xl">
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h4" fontWeight="900">Zertifikats-Check</Typography>
                            <Typography variant="body1" color="text.secondary">Validieren Sie die Echtheit von Qualifikationen per Zertifikats-ID.</Typography>
                        </Box>

                        {/* SEARCH BAR SECTION */}
                        <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', mb: 4, bgcolor: 'background.paper' }}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} md={8}>
                                    <TextField
                                        fullWidth
                                        placeholder="Zertifikats-ID eingeben"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Search color="primary" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Button variant="contained" fullWidth size="large" disableElevation sx={{ height: 56 }}>
                                        Jetzt Prüfen
                                    </Button>
                                </Grid>
                            </Grid>
                        </Paper>

                        {/* RESULT TABLE */}
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Zuletzt geprüft</Typography>
                        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                            <Table>
                                <TableHead sx={{ bgcolor: 'action.hover' }}>
                                    <TableRow>
                                        <TableCell><b>Inhaber</b></TableCell>
                                        <TableCell><b>Zertifikat</b></TableCell>
                                        <TableCell><b>ID-Code</b></TableCell>
                                        <TableCell><b>Status</b></TableCell>
                                        <TableCell align="right"><b>Aktion</b></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {verifizierteZerts.map((row) => (
                                        <TableRow key={row.id} hover>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                    <Avatar sx={{ width: 24, height: 24, fontSize: '0.7rem' }}>{row.student[0]}</Avatar>
                                                    {row.student}
                                                </Box>
                                            </TableCell>
                                            <TableCell>{row.titel}</TableCell>
                                            <TableCell><code>{row.code}</code></TableCell>
                                            <TableCell><Chip label={row.status} color="success" size="small" variant="filled" /></TableCell>
                                            <TableCell align="right">
                                                <Button size="small" startIcon={<FileDownload />}>PDF</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default EmployerDashboard;