import React, { useState } from 'react';
import './index.css';
import Login from "./components/Login.jsx";
import AdminDashboard from "./components/AdminDashboard.jsx";
import UserDashboard from "./components/UserDashboard.jsx";
import EmployerDashboard from "./components/EmployerDashboard.jsx";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: { main: '#646cff' },
        background: {
            default: '#121212',
            paper: '#1e1e1e',
        },
    },
});

export default function App() {

    const [currentUser, setCurrentUser] = useState(null);

    const renderDashboard = () => {
        if (!currentUser) return <Login onLogin={setCurrentUser} />;

        switch (currentUser) {
            case "ADMIN":
                return <AdminDashboard onLogout={() => setCurrentUser(null)} />;
            case "STUDENT":
                return <UserDashboard onLogout={() =>setCurrentUser(null)}/>;
            case "EMPLOYER":
                return <EmployerDashboard onLogout={() =>setCurrentUser(null)}/>;
            default:
                return <Login onLogin={setCurrentUser} />;
        }
    };


    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            {renderDashboard()}
        </ThemeProvider>
    );
}
