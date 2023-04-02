import { useEffect, useState } from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import { fetchApi } from '@lib/api';
import { User } from '@lib/types';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { Button } from '@components/StyledComponents';
import Link from 'next/link';

export default function Home() {
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const getUsers = async () => {
            const query = await fetchApi('users');
            if (query.success) setUsers(query.data);
        };
        getUsers();
    }, []);

    const handleEdit = (id: number) => {
        router.push(`/utilisateurs/editer/${id}`);
    };

    const handleDelete = async (id: number) => {
        const query = await fetchApi('users', { method: 'PUT', body: JSON.stringify({ me_deleted: 1, me_id: id }) });
        if (query.success) toast('Utilisateur supprimé', { type: 'success' });

        // update state
        const newUsers = users.filter((user) => user.me_id !== id);
        setUsers(newUsers);
    };

    return (
        <S.Container>
            <Head>
                <title>Utilisateurs</title>
            </Head>
            <S.Header>
                <h1>Utilisateurs</h1>
                <Button as={Link} href="/utilisateurs/creer">
                    Créer un utilisateur
                </Button>
            </S.Header>
            <S.Columns>
                <span>Nom</span>
                <span>Email</span>
            </S.Columns>
            {users.map((user) => (
                <S.User key={user.me_id}>
                    <span>
                        {user.me_firstname} {user.me_name}
                    </span>
                    <span>{user.me_email}</span>
                    <div>
                        <svg onClick={() => handleEdit(user.me_id)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z" />
                        </svg>
                        <svg onClick={() => handleDelete(user.me_id)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                            <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                        </svg>
                    </div>
                </S.User>
            ))}
        </S.Container>
    );
}

const S: any = {};
S.Container = styled.div`
    margin: 20px;
    display: flex;
    flex-direction: column;
`;

S.Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;
`;

S.Columns = styled.div`
    display: grid;
    grid-template-columns: 250px 300px 70px;
    color: ${({ theme }) => theme.primary};
    margin-bottom: 15px;
    padding-bottom: 5px;
    border-bottom: 1px solid #575757;
`;

S.User = styled.div`
    display: grid;
    grid-template-columns: 250px 300px 70px;

    svg {
        cursor: pointer;
        width: 20px;
        height: 20px;
        fill: ${({ theme }) => theme.primary};

        :first-of-type {
            margin-right: 15px;
        }
    }
`;
