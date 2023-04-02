import { useEffect, useState } from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import { fetchApi } from '@lib/api';
import { Purchase, User } from '@lib/types';

export default function Home() {
    const [users, setUsers] = useState<User[]>([]);
    const [purchases, setPurchases] = useState<Purchase[]>([]);
    const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

    useEffect(() => {
        Promise.all([fetchApi('users'), fetchApi('purchases')]).then((values) => {
            if (values[0].success) setUsers(values[0].data);
            if (values[1].success) setPurchases(values[1].data);
        });
    }, []);

    return (
        <S.Container>
            <Head>
                <title>Accueil</title>
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
                        <tr key={user.me_id}>
                            <td>
                                {user.me_firstname} {user.me_name}
                            </td>
                        </tr>
                    ))}
                    {purchases.map((purchase) => (
                        <tr key={purchase.pu_id}>
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
