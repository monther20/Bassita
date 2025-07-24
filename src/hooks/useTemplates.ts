import { useState, useEffect } from 'react';
import { FirestoreTemplate } from '@/types/firestore';
import { FirestoreService } from '@/lib/firestore';

interface UseTemplatesReturn {
    templates: FirestoreTemplate[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export function useTemplates(): UseTemplatesReturn {
    const [templates, setTemplates] = useState<FirestoreTemplate[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTemplates = async () => {
        try {
            setLoading(true);
            setError(null);
            const fetchedTemplates = await FirestoreService.getTemplates();
            setTemplates(fetchedTemplates);
        } catch (err) {
            console.error('Error fetching templates:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch templates');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTemplates();
    }, []);

    return {
        templates,
        loading,
        error,
        refetch: fetchTemplates
    };
}