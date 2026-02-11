import React, { useState, useMemo } from 'react';
import {
    Box, AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem,
    ListItemIcon, ListItemText, Divider, Container, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, Paper, Button,
    Chip, Avatar, createTheme, ThemeProvider, CssBaseline, Dialog,
    DialogTitle, DialogContent, DialogActions, TextField, Stack,
    FormControl, InputLabel, Select, MenuItem, Autocomplete, createFilterOptions
} from '@mui/material';
import {
    DarkMode, LightMode, Delete, Add, UploadFile, PictureAsPdf,
    People, Description
} from '@mui/icons-material';

const drawerWidth = 260;

function AdminDashboard() {
    const [mode, setMode] = useState(localStorage.getItem('theme') || 'dark');
    const [activeTab, setActiveTab] = useState('Zertifikate');
    const [open, setOpen] = useState(false);

    // Daten-States
    const [zertifikate, setZertifikate] = useState([
        { id: 1, titel: "React Master", user: "Max Mustermann", fileName: "zertifikat_max.pdf" },
    ]);
    const [users, setUsers] = useState([
        { id: 1, name: "Max Mustermann", email: "max@beispiel.de", rolle: "User" },
        { id: 2, name: "Erika Muster", email: "erika@web.de", rolle: "Admin" },
        { id: 3, name: "Tech Corp GmbH", email: "hr@techcorp.de", rolle: "Arbeitgeber" },
    ]);
    const filterOptions = createFilterOptions({
        limit: 5, // Hier setzen wir das Limit auf 5
    });
    // Formular-States
    const [certForm, setCertForm] = useState({ titel: '', user: '', pdfFile: null });
    const [userForm, setUserForm] = useState({ name: '', email: '', rolle: 'User' });

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

    // Handlers
    const handleSave = (e) => {
        e.preventDefault();
        if (activeTab === 'Zertifikate') {
            setZertifikate([...zertifikate, {
                id: Date.now(),
                ...certForm,
                fileName: certForm.pdfFile ? certForm.pdfFile.name : 'Keine Datei'
            }]);
            setCertForm({ titel: '', user: '', pdfFile: null });
        } else {
            setUsers([...users, { id: Date.now(), ...userForm }]);
            setUserForm({ name: '', email: '', rolle: 'User' });
        }
        setOpen(false);
    };

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
                        <Avatar sx={{ width: 54, height: 54, mx: 'auto', mb: 1, bgcolor: 'primary.main' }}>AD</Avatar>
                        <Typography variant="subtitle2" fontWeight="bold">Administrator</Typography>
                    </Box>
                    <Divider sx={{ mx: 2, mb: 2 }} />
                    <List sx={{ px: 2 }}>
                        {[
                            { text: 'Zertifikate', icon: <Description /> },
                            { text: 'Benutzer', icon: <People /> },
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
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                            <Typography variant="h4" fontWeight="900">{activeTab} Verwaltung</Typography>
                            <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)} disableElevation>
                                {activeTab === 'Zertifikate' ? 'Zertifikat erstellen' : 'Benutzer anlegen'}
                            </Button>
                        </Box>

                        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
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
                                                <><TableCell sx={{ fontWeight: 500 }}>{row.titel}</TableCell><TableCell>{row.user}</TableCell><TableCell><Chip label={row.fileName} size="small" icon={<PictureAsPdf />} variant="outlined" /></TableCell></>
                                            ) : (
                                                <><TableCell sx={{ fontWeight: 500 }}>{row.name}</TableCell><TableCell>{row.email}</TableCell><TableCell><Chip label={row.rolle} size="small" color={row.rolle === 'Admin' ? 'error' : row.rolle === 'Arbeitgeber' ? 'secondary' : 'primary'} variant="outlined" /></TableCell></>
                                            )}
                                            <TableCell align="right">
                                                <IconButton color="error" size="small" onClick={() => {
                                                    if(activeTab === 'Zertifikate') setZertifikate(zertifikate.filter(c => c.id !== row.id));
                                                    else setUsers(users.filter(u => u.id !== row.id));
                                                }}>
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

                {/* DYNAMISCHER DIALOG */}
                <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
                    <form onSubmit={handleSave}>
                        <DialogTitle sx={{ fontWeight: 'bold' }}>{activeTab === 'Zertifikate' ? 'Neuer Upload' : 'Neuer Benutzer'}</DialogTitle>
                        <DialogContent>
                            <Stack spacing={3} sx={{ mt: 1 }}>
                                {activeTab === 'Zertifikate' ? (
                                    <>
                                        <TextField
                                            label="Zertifikats-Titel"
                                            fullWidth
                                            required
                                            value={certForm.titel}
                                            onChange={(e) => setCertForm({...certForm, titel: e.target.value})}
                                        />

                                        {/* AUTOCOMPLETE FÜR NUTZER-SUCHE */}
                                        <Autocomplete
                                            options={users}
                                            filterOptions={filterOptions} // Die Limit-Funktion anwenden
                                            getOptionLabel={(option) => option.name}
                                            onChange={(event, newValue) => {
                                                setCertForm({...certForm, user: newValue ? newValue.name : ''});
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Empfänger suchen"
                                                    placeholder="Tippe zum Suchen..."
                                                    required
                                                    fullWidth
                                                />
                                            )}
                                            // Optional: Damit man sieht, dass es mehr geben könnte, wenn man tippt
                                            noOptionsText="Kein Nutzer gefunden"
                                        />

                                        <Button variant="outlined" component="label" startIcon={<UploadFile />} sx={{ borderStyle: 'dashed', py: 1.5 }}>
                                            {certForm.pdfFile ? certForm.pdfFile.name : "PDF auswählen"}
                                            <input type="file" hidden accept="application/pdf" onChange={(e) => setCertForm({...certForm, pdfFile: e.target.files[0]})} />
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <TextField label="Vollständiger Name" fullWidth required onChange={(e) => setUserForm({...userForm, name: e.target.value})} />
                                        <TextField label="Email Adresse" type="email" fullWidth required onChange={(e) => setUserForm({...userForm, email: e.target.value})} />
                                        <FormControl fullWidth>
                                            <InputLabel>Rolle</InputLabel>
                                            <Select
                                                value={userForm.rolle}
                                                label="Rolle"
                                                onChange={(e) => setUserForm({...userForm, rolle: e.target.value})}
                                            >
                                                <MenuItem value="Admin">Admin</MenuItem>
                                                <MenuItem value="User">User</MenuItem>
                                                <MenuItem value="Arbeitgeber">Arbeitgeber</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </>
                                )}
                            </Stack>
                        </DialogContent>
                        <DialogActions sx={{ p: 3 }}>
                            <Button onClick={() => setOpen(false)} color="inherit">Abbrechen</Button>
                            <Button type="submit" variant="contained" disableElevation>Speichern</Button>
                        </DialogActions>
                    </form>
                </Dialog>

            </Box>
        </ThemeProvider>
    );
}

export default AdminDashboard;