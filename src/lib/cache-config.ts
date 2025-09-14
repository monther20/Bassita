export const queryOptions = {
    // Cache boards for 5 minutes
    boards: {
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
    },

    // Cache tasks for 2 minutes (they change more frequently)
    tasks: {
        staleTime: 2 * 60 * 1000,
        cacheTime: 5 * 60 * 1000,
    }
};
