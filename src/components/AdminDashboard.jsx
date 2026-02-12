import React, { useState, useMemo, useEffect } from 'react';
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

const USER_ROLES = {
    ADMIN: "ADMIN",
    STUDENT: "STUDENT",
    EMPLOYER: "EMPLOYER",
};

export default function AdminDashboard() {
    const [mode, setMode] = useState(localStorage.getItem('theme') || 'dark');
    const [activeTab, setActiveTab] = useState('Zertifikate');
    const [open, setOpen] = useState(false);

    const [certificates, setCertificates] = useState([]);
    const [users, setUsers] = useState([]);

    const [certForm, setCertForm] = useState({ Institution: '', user: '', pdfFile: null });
    const [userForm, setUserForm] = useState({ name: '', email: '', role: 'Student' });

    useEffect(() => {
        fetch("http://localhost:8081/users")
            .then(res => res.json())
            .then(setUsers);
    }, []);

    useEffect(() => {
        if (activeTab === "Zertifikate") {
            fetchCertificates();
        }
    }, [activeTab]);

    async function createUser(name, password, email, role) {
        const response = await fetch("http://localhost:8081/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({ name, password, email, role}),
        });

        if (!response.ok) {
            throw new Error("User creation failed");
        }

        return await response.json();
    }

    async function deleteUser(email) {
        const response = await fetch("http://localhost:8081/users/delete", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({email}),
        });

        if (!response.ok) {
            throw new Error("User creation failed");
        }

        return await response.json();
    }

    const fetchCertificates = async () => {
        try {
            const res = await fetch("http://localhost:8081/diploma/all");
            const data = await res.json();
            setCertificates(data);
        } catch (err) {
            console.error(err);
        }
    };


    const filterOptions = createFilterOptions({
        limit: 5,
    });

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

    const handleCreateUser = async () => {
        const createdUser = await createUser(
            userForm.name,
            "temporary-password",
            userForm.email,
            userForm.role
        );

        setUsers((prev) => [...prev, createdUser]);
        setOpen(false);
    };

    const handleDeleteUser =  async () => {
        await deleteUser(
            userForm.email,
        );
    };

    const handleCreateCertificate = async () => {
        const selectedUser = users.find(
            (u) => u.name === certForm.user
        );

        const formData = new FormData();
        formData.append("student", selectedUser.walletAddress);
        formData.append("institution", certForm.Institution);
        formData.append("title", certForm.title);
        formData.append("publicationYear", certForm.publicationYear);
        formData.append("file", certForm.pdfFile);

        const response = await fetch(
            "http://localhost:8081/diploma/issue",
            {
                method: "POST",
                body: formData,
            }
        );

        if (!response.ok) {
            throw new Error("Diploma issuance failed");
        }

        await response.text();

        await fetchCertificates();

        setOpen(false);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (activeTab === "Benutzer") {
            await handleCreateUser();
        } else if (activeTab === "Zertifikate") {
            await handleCreateCertificate();
        }

        setOpen(false);
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ display: 'flex' }}>

                <AppBar
                    position="fixed"
                    elevation={0}
                    sx={{ zIndex: (t) => t.zIndex.drawer + 1, bgcolor: 'background.paper', color: 'text.primary', borderBottom: '1px solid', borderColor: 'divider' }}
                >
                    <Toolbar>
                        <Typography
                            variant="h6"
                            sx={{ flexGrow: 1, fontWeight: 'bold' }}
                        >
                            ADMIN
                            <span style={{ color: '#646cff' }}>PORTAL</span>
                        </Typography>
                        <IconButton onClick={toggleTheme} color="inherit">
                            {mode === 'dark' ? <LightMode sx={{color: '#ffb700'}} /> : <DarkMode sx={{color: '#4f46e5'}} />}
                        </IconButton>
                    </Toolbar>
                </AppBar>

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
                                <ListItemText
                                    primary={item.text}
                                    primaryTypographyProps={{ fontWeight: activeTab === item.text ? 700 : 400 }}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Drawer>

                <Box component="main" sx={{ flexGrow: 1, p: 4, width: `calc(100% - ${drawerWidth}px)` }}>
                    <Toolbar />
                    <Container maxWidth="xl">
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                            <Typography variant="h4" fontWeight="900">{activeTab} Verwaltung</Typography>
                            <Button
                                variant="contained"
                                startIcon={<Add />}
                                onClick={() => setOpen(true)}
                                disableElevation
                            >
                                {activeTab === 'Zertifikate' ? 'Zertifikat erstellen' : 'Benutzer anlegen'}
                            </Button>
                        </Box>

                        <TableContainer
                            component={Paper}
                            elevation={0}
                            sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1 }}
                        >
                            <Table>
                                <TableHead sx={{ bgcolor: 'action.hover' }}>
                                    <TableRow>
                                        {activeTab === 'Zertifikate' ? (
                                            <>
                                                <TableCell><b>Ausstellende Institution</b></TableCell>
                                                <TableCell><b>Empfänger</b></TableCell>
                                                <TableCell><b>Dokument</b></TableCell>
                                            </>
                                        ) : (
                                            <>
                                                <TableCell><b>Name</b></TableCell>
                                                <TableCell><b>Email</b></TableCell>
                                                <TableCell><b>Rolle</b></TableCell>
                                            </>
                                        )}
                                        <TableCell align="right"><b>Aktion</b></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {(activeTab === 'Zertifikate' ? certificates : users).map((row) => (
                                        <TableRow key={row.id} hover>
                                            {activeTab === 'Zertifikate' ? (
                                                <>
                                                    <TableCell sx={{ fontWeight: 500 }}>{row.institution}</TableCell>
                                                    <TableCell>{row.studentName}</TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label="PDF anzeigen"
                                                            size="small"
                                                            icon={<PictureAsPdf />}
                                                            variant="outlined"
                                                            component="a"
                                                            href={`http://localhost:8081${row.pdfPath}`}
                                                            clickable
                                                        />
                                                    </TableCell>
                                                </>
                                            ) : (
                                                <>
                                                    <TableCell sx={{ fontWeight: 500 }}>{row.name}</TableCell>
                                                    <TableCell>{row.email}</TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={row.role}
                                                            size="small"
                                                            color={row.role === 'Admin' ? 'error' : row.role === 'Employer' ? 'secondary' : 'primary'}
                                                            variant="outlined" />
                                                    </TableCell>
                                                </>
                                            )}
                                            <TableCell align="right">
                                                <IconButton color="error" size="small" onClick={() => {
                                                    if (activeTab === 'Zertifikate') {
                                                        setCertificates(certificates.filter(c => c.id !== row.id));
                                                    } else {
                                                        deleteUser(row.email)
                                                        setUsers(users.filter(u => u.id !== row.id));
                                                    }}}>
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

                <Dialog
                    open={open}
                    onClose={() => setOpen(false)}
                    fullWidth
                    maxWidth="xs"
                >
                    <form onSubmit={handleSubmit}>
                        <DialogTitle sx={{ fontWeight: 'bold' }}>
                            {activeTab === 'Zertifikate' ? 'Neuer Upload' : 'Neuer Benutzer'}
                        </DialogTitle>
                        <DialogContent>
                            <Stack
                                spacing={3}
                                sx={{ mt: 1 }}
                            >
                                {activeTab === 'Zertifikate' ? (
                                    <>
                                        <TextField
                                            label="Ausstellende Institution"
                                            fullWidth
                                            required
                                            onChange={(e) => setCertForm({...certForm, Institution: e.target.value})}
                                        />
                                        <TextField
                                            label="Titel des Zertifikates"
                                            fullWidth
                                            required
                                            onChange={(e) => setCertForm({...certForm, title: e.target.value})}
                                        />
                                        <TextField
                                            label="Erstellungsjahr"
                                            fullWidth
                                            required
                                            onChange={(e) => setCertForm({...certForm, publicationYear: e.target.value})}
                                        />
                                             <Autocomplete
                                            options={users.filter((user) => user.role === USER_ROLES.STUDENT)}
                                            filterOptions={filterOptions}
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
                                            noOptionsText="Kein Nutzer gefunden"
                                        />
                                        <Button
                                            variant="outlined"
                                            component="label"
                                            startIcon={<UploadFile />}
                                            sx={{ borderStyle: 'dashed', py: 1.5 }}
                                        >
                                        {certForm.pdfFile ? certForm.pdfFile.name : "PDF auswählen"}
                                        <input
                                            type="file"
                                            hidden
                                            accept="application/pdf"
                                            onChange={(e) => setCertForm({...certForm, pdfFile: e.target.files[0]})}
                                        />
                                    </Button>
                                    </>
                                ) : (
                                    <>
                                        <TextField
                                            label="Vollständiger Name"
                                            fullWidth
                                            required
                                            onChange={(e) => setUserForm({...userForm, name: e.target.value})}
                                        />
                                        <TextField
                                            label="Email Adresse"
                                            type="email"
                                            fullWidth
                                            required
                                            onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                                        />
                                        <FormControl fullWidth>
                                            <InputLabel>Rolle</InputLabel>
                                            <Select
                                                value={userForm.role}
                                                label="Rolle"
                                                onChange={(e) => setUserForm({...userForm, role: e.target.value})}
                                            >
                                                <MenuItem value={USER_ROLES.ADMIN}>Admin</MenuItem>
                                                <MenuItem value={USER_ROLES.STUDENT}>Student</MenuItem>
                                                <MenuItem value={USER_ROLES.EMPLOYER}>Employer</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </>
                                )}
                            </Stack>
                        </DialogContent>
                        <DialogActions sx={{ p: 3 }}>
                            <Button
                                onClick={() => setOpen(false)}
                                color="inherit"
                            >
                                Abbrechen
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                disableElevation
                            >
                                Speichern
                            </Button>
                        </DialogActions>
                    </form>
                </Dialog>
            </Box>
        </ThemeProvider>
    );
}
