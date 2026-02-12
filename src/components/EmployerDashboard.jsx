import React, { useState, useMemo } from 'react';
import {
    Box, AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem,
    ListItemIcon, ListItemText, Divider, Container, Paper, Button,
    Chip, Avatar, createTheme, ThemeProvider, CssBaseline, Stack,
    CircularProgress, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, TextField
} from '@mui/material';
import {
    DarkMode, LightMode, Business, VerifiedUser,
    CheckCircle, ErrorOutline,
    Search, AccountCircle
} from '@mui/icons-material';

const drawerWidth = 260;

export default function EmployerDashboard() {
    const [mode, setMode] = useState(localStorage.getItem('theme') || 'dark');
    const [isVerifying, setIsVerifying] = useState(false);
    const [result, setResult] = useState(null);
    const [history, setHistory] = useState([]);
    const [userEmail, setUserEmail] = useState("");

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

    const handleVerifyUpload = async (e) => {
        const file = e.target.files[0];
        if (!file || !userEmail) return;

        setIsVerifying(true);
        setResult(null);

        try {
            const formData = new FormData();
            formData.append("userEmail", userEmail);
            formData.append("file", file);

            const response = await fetch(
                "http://localhost:8081/diploma/verify",
                {
                    method: "POST",
                    body: formData
                }
            );

            if (!response.ok) {
                throw new Error("Verification failed");
            }

            const isValid = await response.json();

            const verificationResult = {
                status: isValid ? "valid" : "invalid",
                studentName: userEmail
            };

            setResult(verificationResult);

            setHistory(prev => [{
                id: Date.now(),
                fileName: file.name,
                student: userEmail,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                status: isValid ? 'valid' : 'invalid'
            }, ...prev]);

        } catch (err) {
            console.error(err);
            setResult({ status: "invalid" });
        }

        setIsVerifying(false);
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

                <AppBar
                    position="fixed"
                    elevation={0}
                    sx={{ zIndex: (t) => t.zIndex.drawer + 1, bgcolor: 'background.paper', color: 'text.primary', borderBottom: '1px solid', borderColor: 'divider' }}
                >
                    <Toolbar>
                        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 800 }}>Bachelor4All</Typography>
                        <IconButton onClick={toggleTheme} color="inherit">
                            {mode === 'dark' ?
                                <LightMode sx={{color: '#ffb700'}} />
                                :
                                <DarkMode sx={{color: '#4f46e5'}} />
                            }
                        </IconButton>
                    </Toolbar>
                </AppBar>

                <Drawer
                    variant="permanent"
                    sx={{ width: drawerWidth, flexShrink: 0, [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' } }}
                >
                    <Toolbar />
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Avatar sx={{ width: 54, height: 54, mx: 'auto', mb: 1, bgcolor: '#646cff' }} variant="rounded">
                            <Business />
                        </Avatar>
                        <Typography variant="subtitle2" fontWeight="bold">Employer Panel</Typography>
                    </Box>
                    <Divider sx={{ mx: 2, mb: 2 }} />
                    <List sx={{ px: 2 }}>
                        <ListItem button sx={{ borderRadius: 2, bgcolor: 'rgba(100, 108, 255, 0.1)', color: '#646cff', mb: 1 }}>
                            <ListItemIcon sx={{ color: '#646cff' }}><VerifiedUser /></ListItemIcon>
                            <ListItemText primary="Echtheits-Check" />
                        </ListItem>
                    </List>
                </Drawer>

                <Box
                    component="main"
                    sx={{ flexGrow: 1, p: 4, minHeight: '100vh' }}
                >
                    <Toolbar />
                    <Container maxWidth="md">

                        <Box sx={{ textAlign: 'center', mb: 5 }}>
                            <Typography
                                variant="h4"
                                fontWeight="900"
                            >
                                Zertifikat prüfen
                            </Typography>
                            <Typography
                                variant="body1"
                                color="text.secondary"
                            >
                                Laden Sie ein Dokument hoch, um die Blockchain-Signatur zu validieren.
                            </Typography>
                        </Box>

                        <Paper
                            variant="outlined"
                            sx={{ p: 6, mb: 6, textAlign: 'center', borderStyle: 'dashed', borderWidth: 2, bgcolor: 'background.paper' }}
                        >
                            {!isVerifying && !result && (
                                <Stack spacing={2} alignItems="center">
                                    <Search sx={{ fontSize: 60, color: 'text.disabled' }} />

                                    <TextField
                                        label="Student Email"
                                        value={userEmail}
                                        onChange={(e) => setUserEmail(e.target.value)}
                                        fullWidth
                                    />

                                    <Typography variant="h6">PDF zur Prüfung hochladen</Typography>

                                    <Button
                                        variant="contained"
                                        component="label"
                                        disableElevation
                                        sx={{ bgcolor: '#646cff' }}
                                    >
                                        Datei auswählen
                                        <input
                                            type="file"
                                            hidden
                                            accept="application/pdf"
                                            onChange={handleVerifyUpload}
                                        />
                                    </Button>
                                </Stack>
                            )}

                            {isVerifying && (
                                <Stack spacing={3} alignItems="center">
                                    <CircularProgress size={50} sx={{ color: '#646cff' }} />
                                    <Typography>Blockchain-Abgleich läuft...</Typography>
                                </Stack>
                            )}

                            {result && (
                                <Stack spacing={3} alignItems="center">
                                    {result.status === 'valid' ? (
                                        <>
                                            <CheckCircle sx={{ fontSize: 70, color: 'success.main' }} />
                                            <Typography variant="h5" fontWeight="bold">Gültiges Zertifikat</Typography>

                                            <Paper sx={{ p: 3, width: '100%', maxWidth: 450, textAlign: 'left', bgcolor: 'action.hover', border: '1px solid', borderColor: 'success.main' }}>
                                                <Stack spacing={1}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                                        <AccountCircle color="success" />
                                                        <Typography variant="h6">{result.studentName}</Typography>
                                                    </Box>
                                                </Stack>
                                            </Paper>
                                        </>
                                    ) : (
                                        <>
                                            <ErrorOutline sx={{ fontSize: 70, color: 'error.main' }} />
                                            <Typography variant="h5" fontWeight="bold">Prüfung fehlgeschlagen</Typography>
                                            <Typography variant="body2" color="text.secondary">Dokument nicht im Register gefunden.</Typography>
                                        </>
                                    )}
                                    <Button onClick={() => setResult(null)} variant="outlined">Nächster Check</Button>
                                </Stack>
                            )}
                        </Paper>

                        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Letzte Ergebnisse</Typography>
                        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1 }}>
                            <Table size="small">
                                <TableHead sx={{ bgcolor: 'action.hover' }}>
                                    <TableRow>
                                        <TableCell><b>Zeit</b></TableCell>
                                        <TableCell><b>Student</b></TableCell>
                                        <TableCell><b>Datei</b></TableCell>
                                        <TableCell align="right"><b>Status</b></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {history.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} align="center" sx={{ py: 4, color: 'text.disabled' }}>
                                                Noch keine Prüfungen durchgeführt.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        history.map((item) => (
                                            <TableRow key={item.id} hover>
                                                <TableCell sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>{item.time}</TableCell>
                                                <TableCell sx={{ fontWeight: 600 }}>{item.student}</TableCell>
                                                <TableCell sx={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {item.fileName}
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Chip
                                                        label={item.status === 'valid' ? 'Echt' : 'Ungültig'}
                                                        color={item.status === 'valid' ? 'success' : 'error'}
                                                        size="small"
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>

                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
}
