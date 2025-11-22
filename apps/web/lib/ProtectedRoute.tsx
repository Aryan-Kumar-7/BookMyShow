"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, auth0User, isLoading } = useAuth();
  const router = useRouter();

  // User is authenticated if either user or auth0User is available
  const isAuthenticated = !!user || !!auth0User;

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
        router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if(isLoading) {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
                <div className="border-primary mx-auto h-8 w-8 animate-spin rounded-full border-b-2"></div>
                <p className="text-muted-foreground mt-2">Loading...</p>
            </div>
        </div>
    )
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

    return <>{children}</>;
}
