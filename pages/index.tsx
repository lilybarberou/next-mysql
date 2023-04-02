import { useEffect, useState } from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import { fetchApi } from '@lib/api';
import { User } from '@lib/types';

export default function Home() {
    const [users, setUsers] = useState([]);
    const [purchases, setPurchases] = useState([]);
    const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

    useEffect(() => {
        const getData = async () => {
            const query = await fetchApi('users');
            if (query.success) setUsers(query.data);
        };

        getData();
    }, []);

    return (
        <S.Container>
            <Head>
                <title>Home</title>
            </Head>
            <h1>Accueil</h1>
            <S.Table>
                <thead>
                    <S.Columns>
                        <th></th>
                        {months.map((month) => (
                            <th key={month}>{month}</th>
                        ))}
                    </S.Columns>
                </thead>
                <tbody>
                    {users.map((user: User) => (
                        <tr key={user.id}>
                            <td>
                                {user.firstname} {user.name}
                            </td>
                        </tr>
                    ))}
                    {purchases.map((purchase) => (
                        <tr key={purchase.id}>
                            <td></td>
                        </tr>
                    ))}
                </tbody>
            </S.Table>
        </S.Container>
    );
}

const S: any = {};
S.Container = styled.div`
    margin: 20px;
`;

S.Table = styled.table`
    margin-top: 30px;
    font-size: 14px;
    display: flex;
    flex-direction: column;
    border-collapse: collapse;

    tr {
        display: grid;
        grid-template-columns: 150px repeat(12, 1fr);
    }
    td,
    th {
        border: 1px solid #575757;
        text-align: left;
        padding: 8px;
    }
`;

S.Columns = styled.tr`
    color: ${({ theme }) => theme.primary};
    font-size: 15px;
`;
