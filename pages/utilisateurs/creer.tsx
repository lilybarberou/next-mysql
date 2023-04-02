import { FormEvent } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { fetchApi } from '@lib/api';
import { getFormData } from '@contexts/Utils';
import { Button, Input, Select } from '@components/StyledComponents';

export default function EditerUtilisateur() {
    const router = useRouter();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const data = getFormData('#form');
        const query = await fetchApi('users', { method: 'POST', body: JSON.stringify(data) });

        if (query.success) router.push('/utilisateurs');
        else toast(query.message, { type: 'error' });
    };

    return (
        <S.Container>
            <Head>
                <title>Créer un utilisateur</title>
            </Head>
            <S.Form id="form" onSubmit={handleSubmit}>
                <h1>Créer un utilisateur</h1>
                <label htmlFor="name">Rôle</label>
                <Select name="me_role" defaultValue="2">
                    <option value="1">Administrateur</option>
                    <option value="2">Utilisateur</option>
                </Select>
                <label htmlFor="email">Email</label>
                <Input type="email" placeholder="Email" name="me_email" required={true} autoComplete="off" />
                <label htmlFor="firstname">Prénom</label>
                <Input placeholder="Prénom" name="me_firstname" required={true} autoComplete="off" />
                <label htmlFor="name">Nom</label>
                <Input placeholder="Nom" name="me_name" required={true} autoComplete="off" />
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
