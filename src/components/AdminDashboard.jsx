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
    Dashboard as DashboardIcon, People, Description, Settings
} from '@mui/icons-material';

// Breite der Sidebar definieren
const drawerWidth = 260;

function AdminDashboard() {
    const [mode, setMode] = useState(localStorage.getItem('theme') || 'dark');
    const [open, setOpen] = useState(false);
    const [zertifikate, setZertifikate] = useState([
        { id: 1, titel: "React Master", user: "Max Mustermann", fileName: "zertifikat_max.pdf" },
    ]);

    const [formData, setFormData] = useState({ titel: '', user: '', pdfFile: null });

    const theme = useMemo(() => createTheme({
        palette: {
            mode,
            primary: { main: '#646cff' },
            background: {
                default: mode === 'dark' ? '#0f0f0f' : '#f4f6f8',
                paper: mode === 'dark' ? '#1a1a1a' : '#ffffff',
            }
        },
    }), [mode]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const newCert = {
            id: Date.now(),
            titel: formData.titel,
            user: formData.user,
            fileName: formData.pdfFile ? formData.pdfFile.name : 'Unbekannt'
        };
        setZertifikate([...zertifikate, newCert]);
        setOpen(false);
        setFormData({ titel: '', user: '', pdfFile: null });
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ display: 'flex' }}>

                {/* TOPBAR */}
                <AppBar
                    position="fixed"
                    elevation={0}
                    sx={{
                        zIndex: (t) => t.zIndex.drawer + 1,
                        bgcolor: 'background.paper',
                        color: 'text.primary',
                        borderBottom: '1px solid',
                        borderColor: 'divider'
                    }}
                >
                    <Toolbar>
                        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold', letterSpacing: 1 }}>
                            ADMIN<span style={{ color: '#646cff' }}>PORTAL</span>
                        </Typography>
                        <IconButton onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')} color="inherit">
                            {mode === 'dark' ? <LightMode sx={{color: '#ffb700'}} /> : <DarkMode sx={{color: '#4f46e5'}} />}
                        </IconButton>
                    </Toolbar>
                </AppBar>

                {/* SIDEBAR (Links fixiert) */}
                <Drawer
                    variant="permanent"
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        [`& .MuiDrawer-paper`]: {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                            borderRight: '1px solid',
                            borderColor: 'divider'
                        },
                    }}
                >
                    <Toolbar /> {/* Platzhalter für die AppBar Höhe */}
                    <Box sx={{ overflow: 'auto', py: 2 }}>
                        <Box sx={{ p: 3, textAlign: 'center' }}>
                            <Avatar sx={{ width: 64, height: 64, mx: 'auto', mb: 2, bgcolor: 'primary.main', fontSize: '1.5rem' }}>AD</Avatar>
                            <Typography variant="subtitle1" fontWeight="bold">Haupt-Admin</Typography>
                            <Typography variant="caption" color="text.secondary">Systemverwaltung v1.0</Typography>
                        </Box>

                        <Divider sx={{ mx: 2, mb: 2 }} />

                        <List sx={{ px: 2 }}>
                            {[
                                { text: 'Dashboard', icon: <DashboardIcon /> },
                                { text: 'Zertifikate', icon: <Description />, active: true },
                                { text: 'Benutzer', icon: <People /> },
                                { text: 'Einstellungen', icon: <Settings /> }
                            ].map((item) => (
                                <ListItem
                                    button
                                    key={item.text}
                                    sx={{
                                        borderRadius: 2,
                                        mb: 1,
                                        bgcolor: item.active ? 'rgba(100, 108, 255, 0.1)' : 'transparent',
                                        color: item.active ? 'primary.main' : 'inherit',
                                        '&:hover': { bgcolor: 'rgba(100, 108, 255, 0.05)' }
                                    }}
                                >
                                    <ListItemIcon sx={{ color: item.active ? 'primary.main' : 'inherit', minWidth: 40 }}>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: item.active ? 600 : 400 }} />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                </Drawer>

                {/* HAUPTINHALT (Rechts neben dem Menü) */}
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        p: 4,
                        width: `calc(100% - ${drawerWidth}px)`,
                        minHeight: '100vh',
                        bgcolor: 'background.default'
                    }}
                >
                    <Toolbar /> {/* Platzhalter für AppBar Höhe */}

                    <Container maxWidth="xl">
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                            <Box>
                                <Typography variant="h4" fontWeight="900">Zertifikat-Verwaltung</Typography>
                                <Typography variant="body2" color="text.secondary">Erstellen und verwalten Sie digitale Dokumente</Typography>
                            </Box>
                            <Button
                                variant="contained"
                                startIcon={<Add />}
                                onClick={() => setOpen(true)}
                                disableElevation
                                sx={{ borderRadius: 2, py: 1, px: 3 }}
                            >
                                Neu Erstellen
                            </Button>
                        </Box>

                        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
                            <Table>
                                <TableHead sx={{ bgcolor: 'action.hover' }}>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Titel</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Empfänger</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Dokument</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>Aktion</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {zertifikate.map((cert) => (
                                        <TableRow key={cert.id} hover>
                                            <TableCell sx={{ fontWeight: 500 }}>{cert.titel}</TableCell>
                                            <TableCell>{cert.user}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    icon={<PictureAsPdf sx={{ fontSize: '1rem !important' }} />}
                                                    label={cert.fileName}
                                                    size="small"
                                                    variant="outlined"
                                                    sx={{ borderRadius: 1 }}
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <IconButton color="error" size="small" onClick={() => setZertifikate(zertifikate.filter(c => c.id !== cert.id))}>
                                                    <Delete />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Container>
                </Box>

                {/* ... DIALOG (wie zuvor) ... */}
                <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: 3 } }}>
                    <form onSubmit={handleSubmit}>
                        <DialogTitle sx={{ fontWeight: 'bold', pt: 3 }}>Zertifikat hochladen</DialogTitle>
                        <DialogContent>
                            <Stack spacing={3} sx={{ mt: 1 }}>
                                <TextField label="Titel" fullWidth required onChange={(e) => setFormData({...formData, titel: e.target.value})} />
                                <TextField label="Empfänger" fullWidth required onChange={(e) => setFormData({...formData, user: e.target.value})} />
                                <Button variant="outlined" component="label" startIcon={<UploadFile />} sx={{ py: 1.5, borderStyle: 'dashed' }}>
                                    {formData.pdfFile ? formData.pdfFile.name : "PDF-Datei auswählen"}
                                    <input type="file" hidden accept="application/pdf" onChange={(e) => setFormData({ ...formData, pdfFile: e.target.files[0] })} />
                                </Button>
                            </Stack>
                        </DialogContent>
                        <DialogActions sx={{ p: 3 }}>
                            <Button onClick={() => setOpen(false)} color="inherit">Abbrechen</Button>
                            <Button type="submit" variant="contained" disabled={!formData.pdfFile} disableElevation>Speichern</Button>
                        </DialogActions>
                    </form>
                </Dialog>

            </Box>
        </ThemeProvider>
    );
}

export default AdminDashboard;