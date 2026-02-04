import React, { useState, useEffect } from 'react';
import './Dashboard.css';

function Dashboard() {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

    const [user] = useState({
        name: "Max Mustermann",
        email: "max.mustermann@example.com",
        adresse: "Musterstraße 42, 12345 Berlin",
        herkunft: "Deutschland",
        beruf: "Fullstack Entwickler"
    });

    const [zertifikate] = useState([
        { id: 1, titel: "React Professional", aussteller: "Udemy", datum: "2023-10-12", url: "#" },
        { id: 2, titel: "AWS Practitioner", aussteller: "Amazon", datum: "2024-01-05", url: "#" },
        { id: 3, titel: "UI/UX Design", aussteller: "Coursera", datum: "2023-05-20", url: "#" }
    ]);

    useEffect(() => {
        document.body.className = theme + "-mode";
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

    return (
        <div className="dashboard-wrapper">
            {/* TOPBAR */}
            <nav className="topbar">
                <div className="topbar-brand">Bachelor4All</div>
                <div className="theme-toggle" onClick={toggleTheme}>
                    {theme === 'dark' ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffb700" strokeWidth="2">
                            <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                        </svg>
                    ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                        </svg>
                    )}
                </div>
            </nav>

            <div className="dashboard-content-layout">
                {/* SIDEBAR LINKS */}
                <aside className="user-sidebar">
                    <div className="avatar-large">{user.name.charAt(0)}</div>
                    <h2 className="user-name">{user.name}</h2>
                    <p className="user-job">{user.beruf}</p>
                    <div className="user-info-stack">
                        <div className="info-box">
                            <label>Email</label>
                            <p>{user.email}</p>
                        </div>
                        <div className="info-box">
                            <label>Wohnort</label>
                            <p>{user.adresse}</p>
                        </div>
                    </div>
                </aside>

                {/* MAIN RECHTS */}
                <main className="cert-main">
                    <h1>Zertifikats-Übersicht</h1>
                    <div className="cert-grid">
                        {zertifikate.map(cert => (
                            <div key={cert.id} className="cert-card">
                                <div className="cert-icon">📜</div>
                                <div className="cert-details">
                                    <h3>{cert.titel}</h3>
                                    <p>{cert.aussteller}</p>
                                    <small>{new Date(cert.datum).getFullYear()}</small>
                                </div>
                                <a href={cert.url} download className="download-btn">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <polyline points="7 10 12 15 17 10" />
                                        <line x1="12" y1="15" x2="12" y2="3" />
                                    </svg>
                                </a>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Dashboard;