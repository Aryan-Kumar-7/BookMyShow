import { Auth0Client } from "@auth0/auth0-spa-js";

const AUTH0_DOMAIN = process.env.NEXT_PUBLIC_AUTH0_DOMAIN;
const AUTH0_CLIENT_ID = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID;
const AUTH0_AUDIENCE = process.env.NEXT_PUBLIC_AUTH0_AUDIENCE;

if (!AUTH0_DOMAIN || !AUTH0_CLIENT_ID || !AUTH0_AUDIENCE) {
  throw new Error("Missing Auth0 configuration in environment variables");
}

export const auth0Client = new Auth0Client({
    domain: AUTH0_DOMAIN,
    clientId: AUTH0_CLIENT_ID,
    authorizationParams: {
        redirect_uri: typeof window !== 'undefined' ? window.location.origin : '',
        audience: AUTH0_AUDIENCE || undefined,
        scope: "openid profile email",
    },
    cacheLocation: "localstorage",
    useRefreshTokens: true,
});

export const getToken = async () => {
    try {
        return await auth0Client.getTokenSilently();
    } catch (error) {
        console.error("Error getting token silently:", error);
        return null;
    }
}