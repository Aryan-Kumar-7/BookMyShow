export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
    meta?: Record<string, unknown>;
    timestamp: string;
    path?: string;
    error?: {
        code: string;
        details?: string;
    };
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
}

export interface ErrorResponse {
    success: false;
    message: string;
    error: {
        code: string;
        details?: string;
    };
    timestamp: string;
    path?: string;
}