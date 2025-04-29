export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        limit: number;
        offset: number;
        total: number;
    };
    error?: string;
    statusCode?: number;
}

export function createApiResponse<T>(
    items: T[],
    limit: number,
    offset: number,
    total: number,
    error?: string,
    statusCode: number = 200
): PaginatedResponse<T> {
    return {
        data: items,
        pagination: {
            limit,
            offset,
            total
        },
        error,
        statusCode
    };
}
