import { useState } from "react";
import {
    Box,
    Card,
    Typography,
    TextField,
    Button,
    Stack
} from "@mui/material";

export default function Login({onLogin}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:8081/users/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: new URLSearchParams({ email, password })
            });

            if (!response.ok) {
                throw new Error("Login failed");
            }

            const user = await response.json();

            // user must contain role
            onLogin(user);

        } catch (err) {
            alert("Invalid credentials");
            console.error(err);
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background: "radial-gradient(circle at top, #1c1f26, #0e0f13)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}
        >
            <Card
                elevation={0}
                sx={{
                    width: 380,
                    p: 4,
                    borderRadius: 4,
                    background: "rgba(255,255,255,0.05)",
                    backdropFilter: "blur(12px)",
                    color: "white",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.6)"
                }}
            >
                <Stack spacing={1} mb={3}>
                    <Typography variant="h5" fontWeight={600}>
                        Bachelor4All
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#a0a0a0" }}>
                        Sign in to verify certificates
                    </Typography>
                </Stack>

                <Box component="form" onSubmit={handleSubmit}>
                    <Stack spacing={2}>
                        <TextField
                            label="Email"
                            type="email"
                            fullWidth
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            InputLabelProps={{ style: { color: "#b5b5b5" } }}
                            InputProps={{
                                sx: {
                                    backgroundColor: "#12141a",
                                    borderRadius: 2,
                                    color: "white"
                                }
                            }}
                        />

                        <TextField
                            label="Password"
                            type="password"
                            fullWidth
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            InputLabelProps={{ style: { color: "#b5b5b5" } }}
                            InputProps={{
                                sx: {
                                    backgroundColor: "#12141a",
                                    borderRadius: 2,
                                    color: "white"
                                }
                            }}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            sx={{
                                mt: 1,
                                py: 1.2,
                                borderRadius: 3,
                                textTransform: "none",
                                fontWeight: 600,
                                background: "#6c7cff",
                                color: "white",
                                "&:hover": {
                                    background: "#5b6cff"
                                }
                            }}
                        >
                            Sign In
                        </Button>
                    </Stack>
                </Box>


            </Card>
        </Box>
    );
}
