"use client";
import Header from "../component/header";
import { useAuth } from "../contexts/AuthContext";
import ProtectedRoute from "../lib/ProtectedRoute";

export default function Home() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <Header />
      <div>
        <h1>Welcome to the Movie Booking App</h1>
        {user && <p>Logged in as: {user.email}</p>}
      </div>
    </ProtectedRoute>
  );
}
