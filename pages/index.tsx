import { useEffect, useState } from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import { fetchApi } from '@lib/api';
import { Contribution, Purchase, User } from '@lib/types';

export default function Home() {
    const [users, setUsers] = useState<User[]>([]);
    const [contributions, setContributions] = useState<any>({});
    const [fund, setFund] = useState();
    const months = ['Jan.', 'Fév.', 'Mars', 'Avril', 'Mai', 'Juin', 'Juill.', 'Août', 'Sep.', 'Oct.', 'Nov.', 'Déc.'];
    const currentYear = new Date().getFullYear();

    useEffect(() => {
        Promise.all([fetchApi('users'), fetchApi('contributions'), fetchApi('fund')]).then((values) => {
            if (values[0].success) setUsers(values[0].data);
            if (values[1].success) {
                const obj: any = {};

                values[1].data.forEach((contribution: Contribution) => {
                    if (!obj.hasOwnProperty(contribution.co_date)) obj[contribution.co_date] = {};
                    obj[contribution.co_date][contribution.co_member] = contribution;
                });

                setContributions(obj);
            }

            if (values[2].success) setFund(values[2].data);
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
                            {months.map((month, index) => {
                                let hasContribution = false;
                                const i = index + 1;
                                const date = `${currentYear}-${i.toString().padStart(2, '0')}`;
                                if (contributions[date]?.hasOwnProperty(user.me_id)) hasContribution = true;
                                return <S.Row valid={hasContribution} key={`${user.me_id}-${i}`}></S.Row>;
                            })}
                        </tr>
                    ))}
                </tbody>
            </S.Table>
            {fund && <S.Fund>Montant dans la caisse : {fund}€</S.Fund>}
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
        grid-template-columns: 150px repeat(12, 70px);
    }
    td,
    th {
        border: 1px solid #575757;
        text-align: left;
        padding: 8px;
    }
    thead tr th:first-of-type {
        border: none;
    }
`;

S.Columns = styled.tr`
    color: ${({ theme }) => theme.primary};
    font-size: 15px;
`;

S.Row = styled.td<{ valid: boolean }>`
    ${({ valid }) => (valid ? 'background-color: #19b719;' : 'background-color: #ac3131;')}
`;

S.Fund = styled.div`
    font-size: 17px;
    margin-top: 40px;
    padding: 8px;
    border: 2px solid ${({ theme }) => theme.primary};
    width: fit-content;
`;
