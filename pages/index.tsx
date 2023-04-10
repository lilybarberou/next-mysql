import { useEffect, useState } from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import { fetchApi } from '@lib/api';
import { Contribution, User } from '@lib/types';
import { useRouter } from 'next/router';

export default function Home() {
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [contributions, setContributions] = useState<any>({});
    const [fund, setFund] = useState(0);
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [yearsList, setYearsList] = useState<number[]>([currentYear]);
    const months = ['Jan.', 'Fév.', 'Mars', 'Avril', 'Mai', 'Juin', 'Juill.', 'Août', 'Sep.', 'Oct.', 'Nov.', 'Déc.'];

    useEffect(() => {
        const initPage = () => {
            let promisedArray = [fetchApi('contributions'), fetchApi('fund')];
            const localUser = localStorage.getItem('user');
            if (!localUser) return router.push('/connexion');
            const user = JSON.parse(localUser);
            if (user.me_role === 1) promisedArray.push(fetchApi('users'));

            Promise.all(promisedArray).then((values) => {
                if (values[0].success) {
                    const obj: any = {};

                    values[0].data.forEach((contribution: Contribution) => {
                        if (!obj.hasOwnProperty(contribution.co_date)) obj[contribution.co_date] = {};
                        obj[contribution.co_date][contribution.co_member] = contribution;
                    });

                    let list: number[] = [];
                    Object.keys(obj).forEach((key) => {
                        const year = key.split('-')[0];
                        if (!yearsList.includes(Number(year))) yearsList.push(Number(year));
                    });
                    list = yearsList.sort((a, b) => b - a);
                    setYearsList(list);

                    setContributions(obj);
                }

                if (values[1].success) setFund(values[1].data);

                // users
                if (user.me_role === 1 && values[2].success) setUsers(values[2].data);
                else setUsers([user]);
            });
        };

        initPage();
    }, []);

    const changeYear = (year: number) => {
        setSelectedYear(year);
    };

    return (
        <S.Container>
            <Head>
                <title>Accueil</title>
            </Head>
            <h1>Accueil</h1>
            <S.Years>
                {yearsList.length > 0 &&
                    yearsList.map((year) => (
                        <span onClick={() => changeYear(year)} className={selectedYear === year ? 'active' : ''} key={year}>
                            {year}
                        </span>
                    ))}
            </S.Years>
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
                                const date = `${selectedYear}-${i.toString().padStart(2, '0')}`;
                                if (contributions[date]?.hasOwnProperty(user.me_id)) hasContribution = true;
                                return <S.Row valid={hasContribution} key={`${user.me_id}-${i}`}></S.Row>;
                            })}
                        </tr>
                    ))}
                </tbody>
            </S.Table>
            <S.Fund>Montant dans la caisse : {fund}€</S.Fund>
        </S.Container>
    );
}

const S: any = {};
S.Container = styled.div`
    margin: 20px;
`;

S.Years = styled.div`
    display: flex;
    gap: 10px;
    margin-top: 25px;

    span {
        cursor: pointer;
        color: ${({ theme }) => theme.primary};

        &.active {
            text-decoration: underline;
        }
    }
`;

S.Table = styled.table`
    margin-top: 10px;
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
