/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from "./client";

export const getUser = async () => {
    const response = await apiClient.get<{ data?: { user?: any } }>(`/auth/me`, {
        returnApiResponse: true,
    });

    const user = response.data?.user;

    return {
        ...user,
    };
}