import React, { useState, useMemo } from 'react';
import {
    Box, AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem,
    ListItemIcon, ListItemText, Divider, Container, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, Paper, Button,
    Chip, Avatar, createTheme, ThemeProvider, CssBaseline, Dialog,
    DialogTitle, DialogContent, DialogActions, TextField, Stack
} from '@mui/material';
import {
    DarkMode, LightMode, Delete, Add, UploadFile, PictureAsPdf,
    Dashboard as DashboardIcon, People, Description, Settings, Email
} from '@mui/icons-material';

const drawerWidth = 260;

function AdminDashboard() {
    const [mode, setMode] = useState(localStorage.getItem('theme') || 'dark');
    const [activeTab, setActiveTab] = useState('Zertifikate'); // Steuert den Screen
    const [open, setOpen] = useState(false);

    // Daten-States
    const [zertifikate, setZertifikate] = useState([
        { id: 1, titel: "React Master", user: "Max Mustermann", fileName: "zertifikat_max.pdf" },
    ]);
    const [users, setUsers] = useState([
        { id: 1, name: "Max Mustermann", email: "max@beispiel.de", rolle: "User" },
        { id: 2, name: "Erika Muster", email: "erika@web.de", rolle: "Admin" },
    ]);

    // Formular-States
    const [certForm, setCertForm] = useState({ titel: '', user: '', pdfFile: null });
    const [userForm, setUserForm] = useState({ name: '', email: '', rolle: 'User' });

    const theme = useMemo(() => createTheme({
        palette: {
            mode,
            primary: { main: '#646cff' },
            background: { default: mode === 'dark' ? '#0f0f0f' : '#f4f6f8', paper: mode === 'dark' ? '#1a1a1a' : '#ffffff' }
        },
    }), [mode]);

    // Handlers
    const handleSave = (e) => {
        e.preventDefault();
        if (activeTab === 'Zertifikate') {
            setZertifikate([...zertifikate, { id: Date.now(), ...certForm, fileName: certForm.pdfFile?.name }]);
        } else {
            setUsers([...users, { id: Date.now(), ...userForm }]);
        }
        setOpen(false);
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ display: 'flex' }}>

                {/* TOPBAR */}
                <AppBar position="fixed" elevation={0} sx={{ zIndex: (t) => t.zIndex.drawer + 1, bgcolor: 'background.paper', color: 'text.primary', borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Toolbar>
                        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>ADMIN<span style={{ color: '#646cff' }}>PORTAL</span></Typography>
                        <IconButton onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')} color="inherit">
                            {mode === 'dark' ? <LightMode sx={{color: '#ffb700'}} /> : <DarkMode sx={{color: '#4f46e5'}} />}
                        </IconButton>
                    </Toolbar>
                </AppBar>

                {/* SIDEBAR */}
                <Drawer variant="permanent" sx={{ width: drawerWidth, flexShrink: 0, [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' } }}>
                    <Toolbar />
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Avatar sx={{ width: 54, height: 54, mx: 'auto', mb: 1, bgcolor: 'primary.main' }}>AD</Avatar>
                        <Typography variant="subtitle2" fontWeight="bold">Administrator</Typography>
                    </Box>
                    <Divider sx={{ mx: 2, mb: 2 }} />
                    <List sx={{ px: 2 }}>
                        {[
                            { text: 'Dashboard', icon: <DashboardIcon /> },
                            { text: 'Zertifikate', icon: <Description /> },
                            { text: 'Benutzer', icon: <People /> },
                            { text: 'Einstellungen', icon: <Settings /> }
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
                                <ListItemText primary={item.text} />
                            </ListItem>
                        ))}
                    </List>
                </Drawer>

                {/* CONTENT */}
                <Box component="main" sx={{ flexGrow: 1, p: 4, width: `calc(100% - ${drawerWidth}px)` }}>
                    <Toolbar />
                    <Container maxWidth="xl">
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                            <Typography variant="h4" fontWeight="900">{activeTab} Verwaltung</Typography>
                            <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)} disableElevation>
                                {activeTab === 'Zertifikate' ? 'Zertifikat erstellen' : 'Benutzer anlegen'}
                            </Button>
                        </Box>

                        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
                            <Table>
                                <TableHead sx={{ bgcolor: 'action.hover' }}>
                                    <TableRow>
                                        {activeTab === 'Zertifikate' ? (
                                            <><TableCell><b>Titel</b></TableCell><TableCell><b>Empfänger</b></TableCell><TableCell><b>Dokument</b></TableCell></>
                                        ) : (
                                            <><TableCell><b>Name</b></TableCell><TableCell><b>Email</b></TableCell><TableCell><b>Rolle</b></TableCell></>
                                        )}
                                        <TableCell align="right"><b>Aktion</b></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {(activeTab === 'Zertifikate' ? zertifikate : users).map((row) => (
                                        <TableRow key={row.id} hover>
                                            {activeTab === 'Zertifikate' ? (
                                                <><TableCell sx={{ fontWeight: 500 }}>{row.titel}</TableCell><TableCell>{row.user}</TableCell><TableCell><Chip label={row.fileName} size="small" icon={<PictureAsPdf />} /></TableCell></>
                                            ) : (
                                                <><TableCell sx={{ fontWeight: 500 }}>{row.name}</TableCell><TableCell>{row.email}</TableCell><TableCell><Chip label={row.rolle} size="small" color="primary" variant="outlined" /></TableCell></>
                                            )}
                                            <TableCell align="right">
                                                <IconButton color="error" size="small"><Delete /></IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Container>
                </Box>

                {/* DYNAMISCHER DIALOG */}
                <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
                    <form onSubmit={handleSave}>
                        <DialogTitle sx={{ fontWeight: 'bold' }}>{activeTab === 'Zertifikate' ? 'Neuer Upload' : 'Neuer Benutzer'}</DialogTitle>
                        <DialogContent>
                            <Stack spacing={3} sx={{ mt: 1 }}>
                                {activeTab === 'Zertifikate' ? (
                                    <>
                                        <TextField label="Titel" fullWidth required onChange={(e) => setCertForm({...certForm, titel: e.target.value})} />
                                        <TextField label="Empfänger" fullWidth required onChange={(e) => setCertForm({...certForm, user: e.target.value})} />
                                        <Button variant="outlined" component="label" startIcon={<UploadFile />} sx={{ borderStyle: 'dashed' }}>
                                            {certForm.pdfFile ? certForm.pdfFile.name : "PDF auswählen"}
                                            <input type="file" hidden accept="application/pdf" onChange={(e) => setCertForm({...certForm, pdfFile: e.target.files[0]})} />
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <TextField label="Vollständiger Name" fullWidth required onChange={(e) => setUserForm({...userForm, name: e.target.value})} />
                                        <TextField label="Email Adresse" type="email" fullWidth required onChange={(e) => setUserForm({...userForm, email: e.target.value})} />
                                    </>
                                )}
                            </Stack>
                        </DialogContent>
                        <DialogActions sx={{ p: 3 }}>
                            <Button onClick={() => setOpen(false)}>Abbrechen</Button>
                            <Button type="submit" variant="contained" disableElevation>Speichern</Button>
                        </DialogActions>
                    </form>
                </Dialog>

            </Box>
        </ThemeProvider>
    );
}

export default AdminDashboard;