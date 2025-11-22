'use client';

import React from "react";
import { useAuth } from "../contexts/AuthContext";
import Link from "next/link";

const Header: React.FC = () => {
    const { user, auth0User, logout } = useAuth();

    const isAuthenticated = user || auth0User;
    const userEmail = user?.email || auth0User?.email;

    return (
        <header style={styles.header}>
            <div style={styles.brand}>Movie Booking</div>
            <nav style={styles.nav}>
                <Link href="/" style={styles.link}>Home</Link>
                <Link href="/movies" style={styles.link}>Movies</Link>
                <Link href="/bookings" style={styles.link}>My Bookings</Link>
            </nav>
            <div style={styles.auth}>
                {isAuthenticated ? (
                    <>
                        <span style={styles.userText}>Hello, {userEmail}</span>
                        <button style={styles.button} onClick={logout}>Logout</button>
                    </>
                ) : (
                    <Link href="/login" style={styles.button}>Login</Link>
                )}
            </div>
        </header>
    );
};

const styles: Record<string, React.CSSProperties> = {
    header: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 20px",
        borderBottom: "1px solid #e5e7eb",
        background: "#fff",
    },
    brand: {
        fontWeight: 700,
        fontSize: 18,
    },
    nav: {
        display: "flex",
        alignItems: "center",
        gap: 16,
    },
    link: {
        color: "#111827",
        textDecoration: "none",
        fontSize: 14,
    },
    toggleRow: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginLeft: 8,
    },
    toggleLabel: {
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        fontSize: 13,
        cursor: "pointer",
    },
    checkbox: {
        width: 16,
        height: 16,
    },
    status: {
        fontSize: 13,
        color: "#6b7280",
    },
    auth: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginLeft: 12,
    },
    userText: {
        fontSize: 13,
        color: "#111827",
    },
    button: {
        padding: "6px 10px",
        borderRadius: 6,
        border: "1px solid #d1d5db",
        background: "#f9fafb",
        cursor: "pointer",
        fontSize: 13,
    },
};

export default Header;