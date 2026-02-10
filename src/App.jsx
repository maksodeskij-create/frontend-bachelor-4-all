import React from 'react';
import './index.css';
import Login from "./components/Login.jsx"
import AdminDashboard from "./components/AdminDashboard.jsx";
import Dashboard from './components/Dashboard.jsx';
import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import EmployerDashboard from "./components/EmployerDashboard.jsx";

const darkTheme = createTheme({
    palette: {
        mode: 'dark', // oder 'light'
        primary: {
            main: '#646cff',
        },
        background: {
            default: '#121212',
            paper: '#1e1e1e',
        },
    },
});

function App() {
    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline /> {/* Das hier löscht alle restlichen Browser-Standard-Styles */}
            <Login/>
        </ThemeProvider>
    );
}

export default App;