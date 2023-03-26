import { useEffect, useState } from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import { fetchApi } from '@lib/api';
import { User } from '@lib/types';

export default function Home() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const getData = async () => {
            const query = await fetchApi('test');
            if (query.success) setUsers(query.data);
        };

        getData();
    }, []);

    return (
        <S.Container>
            <Head>
                <title>Home</title>
            </Head>
            {users.map((user: User) => (
                <div key={user.id}>
                    <p>
                        {user.firstname} {user.name}
                    </p>
                </div>
            ))}
        </S.Container>
    );
}

const S: any = {};
S.Container = styled.div``;
