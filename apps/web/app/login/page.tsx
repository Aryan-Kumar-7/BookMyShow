'use client';

import { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useSearchParams, useRouter } from "next/navigation";


export default function LoginPage() {
    const { login, isLoading, auth0User } = useAuth();
    const searchParams = useSearchParams();
    const router = useRouter();

    // Redirect if already logged in
    useEffect(() => {
        if (!isLoading && auth0User) {
            const returnTo = searchParams.get('returnTo') || '/';
            router.push(returnTo);
        }
    }, [auth0User, isLoading, router, searchParams]);

    const handleLogin = async () => {
        await login();
    };

    return (
        <div>
            <h1>Login Page</h1>
            {isLoading ? (
                <p>Loading...</p>
            ) : auth0User ? (
                <p>You are already logged in as {auth0User.email}</p>
            ) : (
                <button onClick={handleLogin}>Login with Auth0</button>
            )}
        </div>
    )
}