"use client";

import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

const publicRoutes = ["/login"];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { auth0User, isLoading } = useAuth();

  useEffect(() => {
    // Check if the current route is public
    const isPublicRoute = publicRoutes.some((route) =>
      pathname.startsWith(route)
    );

    // If not loading and user is not authenticated, redirect to login
    if (!isLoading && !auth0User && !isPublicRoute) {
      router.push(`/login?returnTo=${encodeURIComponent(pathname)}`);
    }
  }, [auth0User, isLoading, pathname, router]);

  // Show a loading state while checking authentication
  if (isLoading) {
    return (
      <>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-foreground">Loading...</div>
        </div>
      </>
    );
  }

  // Check if the current route is public
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // If not authenticated and not a public route, don't render children
  if (!auth0User && !isPublicRoute) {
    return null;
  }

  return <>{children}</>;
}
