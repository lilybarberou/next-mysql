import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

export default function Navigation() {
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState(false);

    // check if user is admin
    useEffect(() => {
        const member = window.localStorage.getItem('user');
        if (member && JSON.parse(member).me_role === 1) setIsAdmin(true);
    }, []);

    // declare navLinks
    const navLinks = [
        { title: 'Accueil', path: '/' },
        { cond: isAdmin, title: 'Utilisateurs', path: '/utilisateurs' },
        { cond: isAdmin, title: 'Ajouter une cotisation', path: '/cotisations/ajouter' },
        { cond: isAdmin, title: 'Ajouter un achat', path: '/achats/ajouter' },
    ];

    const handleLogout = () => {
        window.localStorage.removeItem('access_token');
        window.localStorage.removeItem('user');
        window.location.pathname = '/connexion';
    };

    if (router.pathname === '/connexion') return null;
    return (
        <S.Container>
            {navLinks.map((link) => {
                if (link.hasOwnProperty('cond') && !link.cond) return null;
                return (
                    <Link key={link.path} href={link.path}>
                        {link.title}
                    </Link>
                );
            })}
            <S.Disconnect onClick={handleLogout}>Déconnexion</S.Disconnect>
        </S.Container>
    );
}

const S: any = {};
S.Container = styled.div`
    margin: 20px;
    margin-bottom: 40px;
    padding-bottom: 5px;
    display: flex;
    gap: 20px;
    border-bottom: 1px solid #575757;

    a {
        transition: 0.2s;

        :hover {
            color: ${({ theme }) => theme.primary};
        }
    }
`;

S.Disconnect = styled.span`
    margin-left: auto;
    font-size: 14px;
    cursor: pointer;
    color: ${({ theme }) => theme.primary};
`;
