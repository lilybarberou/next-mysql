import { FormEvent, useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { fetchApi } from '@lib/api';
import { getFormData } from '@contexts/Utils';
import { Button, Input, Select } from '@components/StyledComponents';
import { User } from '@lib/types';

export default function EditerUtilisateur() {
    const router = useRouter();
    const { id } = router.query;

    const [user, setUser] = useState<User>();

    useEffect(() => {
        const getUsers = async () => {
            const query = await fetchApi(`users?me_id=${id}`);
            if (query.success && query.data.length) setUser(query.data[0]);
        };
        if (id) getUsers();
    }, [id]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const data = getFormData('#form');
        const query = await fetchApi('users', { method: 'PUT', body: JSON.stringify({ ...data, me_id: id }) });

        if (query.success) router.push('/utilisateurs');
        else toast(query.message, { type: 'error' });
    };

    if (!user) return null;
    return (
        <S.Container>
            <Head>
                <title>Editer un utilisateur</title>
            </Head>
            <S.Form id='form' onSubmit={handleSubmit}>
                <h1>Editer un utilisateur</h1>
                <label htmlFor='name'>Rôle</label>
                <Select name='me_role' defaultValue={user.me_role}>
                    <option value='1'>Administrateur</option>
                    <option value='2'>Utilisateur</option>
                </Select>
                <label htmlFor='email'>Email</label>
                <Input defaultValue={user.me_email} disabled={true} />
                <label htmlFor='firstname'>Prénom</label>
                <Input defaultValue={user.me_firstname} placeholder='Prénom' name='me_firstname' required={true} autoComplete='off' />
                <label htmlFor='name'>Nom</label>
                <Input defaultValue={user.me_name} placeholder='Nom' name='me_name' required={true} autoComplete='off' />
                <Button>Modifier</Button>
            </S.Form>
        </S.Container>
    );
}

const S: any = {};
S.Container = styled.div`
    padding: 0 20px;
    display: flex;

    h1 {
        margin-bottom: 10px;
    }
`;

S.Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 10px;

    button {
        margin-top: 10px;
        margin-left: auto;
        width: 150px;
    }
`;
