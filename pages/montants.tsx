import { FormEvent, useEffect, useState } from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { fetchApi } from '@lib/api';
import { Button, Input, Select } from '@components/StyledComponents';
import { Role } from '@lib/types';

export default function EditerUtilisateur() {
    const [roles, setRoles] = useState<{ [key: number]: Role }>({});
    const [selected, setSelected] = useState<number>(1);
    const [amountValue, setAmountValue] = useState<number>(0);

    useEffect(() => {
        const getRoles = async () => {
            const query = await fetchApi(`roles`);

            const obj: any = {};
            if (query.success) {
                query.data.forEach((role: Role) => {
                    obj[role.ro_id] = role;
                });
                setRoles(obj);
                setAmountValue(query.data[0].ro_amount);
            }
        };
        getRoles();
    }, []);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const query = await fetchApi('roles', { method: 'PUT', body: JSON.stringify({ ro_amount: amountValue, ro_id: selected }) });

        if (query.success) toast('Montant modifié', { type: 'success' });
        toast(query.message, { type: query.success ? 'success' : 'error' });
    };

    const handleSelectChange = (e: any) => {
        setSelected(e.target.value);
        setAmountValue(roles[e.target.value].ro_amount);
    };

    const updateAmountValue = (e: any) => {
        setAmountValue(e.target.value);
    };

    if (Object.keys(roles).length === 0) return null;
    return (
        <S.Container>
            <Head>
                <title>Gérer les montants</title>
            </Head>
            <S.Form id='form' onSubmit={handleSubmit}>
                <h1>Gérer les montants</h1>
                <label htmlFor='ro_id'>Rôle</label>
                <Select name='ro_id' onChange={handleSelectChange}>
                    {Object.values(roles).map((role) => (
                        <option key={role.ro_id} value={role.ro_id}>
                            {role.ro_label}
                        </option>
                    ))}
                </Select>
                <label htmlFor='ro_amount'>Montant</label>
                <Input onChange={updateAmountValue} value={amountValue} type='number' placeholder='Montant' name='ro_amount' required={true} />
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
