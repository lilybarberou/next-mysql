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
    ];

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
    border-bottom: 1px solid #919191;

    a {
        transition: 0.2s;

        :hover {
            color: ${({ theme }) => theme.primary};
        }
    }
`;
