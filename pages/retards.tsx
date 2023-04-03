import { useEffect, useState } from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import { fetchApi } from '@lib/api';
import { Contribution, User } from '@lib/types';
import { toast } from 'react-toastify';

export default function Retards() {
    const [users, setUsers] = useState<User[]>([]);
    const [contributions, setContributions] = useState<any>({});
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const currentMonthLabel = new Date().toLocaleString('default', { month: 'long' });
    const co_date = `${currentYear}-${currentMonth.toString().padStart(2, '0')}`;

    useEffect(() => {
        Promise.all([fetchApi('users'), fetchApi(`contributions?co_date=${co_date}`)]).then((values) => {
            if (values[0].success) setUsers(values[0].data);
            if (values[1].success) {
                const obj: any = {};

                values[1].data.forEach((contribution: Contribution) => {
                    obj[contribution.co_member] = contribution;
                });

                setContributions(obj);
            }
        });
    }, []);

    const handleEmail = async () => {
        toast('Email de rappel envoyé !', { type: 'success' });
    };

    return (
        <S.Container>
            <Head>
                <title>Retards</title>
            </Head>
            <h1>Retards</h1>
            <h2>
                En {currentMonthLabel} {currentYear}
            </h2>
            <S.Columns>
                <span>Nom</span>
                <span>Email</span>
            </S.Columns>
            {users
                .filter((user) => !contributions.hasOwnProperty(user.me_id))
                .map((user) => (
                    <S.User key={user.me_id}>
                        <span>
                            {user.me_firstname} {user.me_name}
                        </span>
                        <span>{user.me_email}</span>
                        <div>
                            <svg onClick={handleEmail} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'>
                                <path d='M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480V396.4c0-4 1.5-7.8 4.2-10.7L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z' />
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

    h1 {
        margin-bottom: 20px;
    }

    h2 {
        margin-bottom: 10px;
    }
`;

S.Columns = styled.div`
    display: grid;
    grid-template-columns: 250px 300px 22px;
    width: fit-content;
    color: ${({ theme }) => theme.primary};
    margin-bottom: 15px;
    padding-bottom: 5px;
    border-bottom: 1px solid #575757;
`;

S.User = styled.div`
    display: grid;
    grid-template-columns: 250px 300px 22px;
    margin-bottom: 7px;
    border-bottom: 1px solid #575757;
    padding-bottom: 3px;
    width: fit-content;

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
