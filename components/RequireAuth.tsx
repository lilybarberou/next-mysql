import { PropsWithChildren, ReactNode, useEffect, useState } from 'react';
import { fetchApi } from '@lib/api';
import { useRouter } from 'next/router';

export default function RequireAuth(props: PropsWithChildren) {
    const { children } = props;
    const router = useRouter();
    const pageAllowed = ['/connexion'].includes(router.pathname);
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const access_token = localStorage.getItem('access_token');
        if (!access_token) router.push('/connexion');

        const checkAuth = async () => {
            const query = await fetchApi('authenticate', { method: 'POST', body: access_token });

            if (query.success && query.data) {
                localStorage.setItem('user', JSON.stringify(query.data));
                setAuthenticated(true);
            } else {
                localStorage.removeItem('access_token');
                localStorage.removeItem('user');
            }
            setLoading(false);
        };

        !pageAllowed && checkAuth();
    }, [router.pathname]);

    if (pageAllowed) return children;
    if (loading) return <div>Chargement...</div>;
    if (!authenticated) router.push('/connexion');
    return children;
}
