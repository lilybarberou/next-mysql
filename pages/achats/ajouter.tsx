import { FormEvent, useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { fetchApi } from '@lib/api';
import { getFormData } from '@contexts/Utils';
import { Button, Input, Select } from '@components/StyledComponents';
import { User } from '@lib/types';

export default function CreerAchat() {
    const router = useRouter();
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const getUsers = async () => {
            const query = await fetchApi('users');
            if (query.success) setUsers(query.data);
        };
        getUsers();
    }, []);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const data = getFormData('#form');

        if (data.co_member === '0') return toast('Veuillez choisir un membre', { type: 'error' });

        const query = await fetchApi('purchases', { method: 'POST', body: JSON.stringify(data) });

        if (query.success) router.push('/');
        else toast(query.message, { type: 'error' });
    };

    return (
        <S.Container>
            <Head>
                <title>Ajouter un achat</title>
            </Head>
            <S.Form id="form" onSubmit={handleSubmit}>
                <h1>Ajouter un achat</h1>
                <label htmlFor="pu_member">Membre</label>
                <Select name="pu_member" defaultValue="0">
                    <option value="0">Choisir un membre...</option>
                    {users.map((user: User) => (
                        <option key={user.me_id} value={user.me_id}>
                            {user.me_firstname} {user.me_name}
                        </option>
                    ))}
                </Select>
                <label htmlFor="pu_date">Mois</label>
                <Input type="month" name="pu_date" required={true} />
                <label htmlFor="pu_label">Label</label>
                <Input name="pu_label" required={true} />
                <label htmlFor="pu_amount">Montant</label>
                <Input type="number" name="pu_amount" required={true} />
                <Button>Créer</Button>
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
