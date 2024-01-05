import React, { useCallback } from 'react';
import { Container, Header } from '@pages/DirectMessage/styles';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import gravatar from 'gravatar';
import { useParams } from 'react-router';
import ChatBox from '@components/ChatBox';
import useInput from '@hooks/useInput';

const DirectMessage = () => {
    const { workspace, id } = useParams<{workspace: string, id: string}>();

    const { data: userData} = useSWR(`/api/workspaces/${workspace}/users/${id}`, fetcher);
    const { data: myData} = useSWR(`/api/users`, fetcher);
    const [chat, onChangeChat, setChat] = useInput('');

    const onSubmitForm = useCallback(() => {

    }, []);

    if(!userData || !myData) {
        return null;
    }
    


    return (
        <Container>
            <Header>
                <img src={gravatar.url(userData.email, {s:'24px', d:'retro'})} alt={userData.nickname} />
            </Header>
            <ChatBox chat={chat} onSubmitForm={onSubmitForm} onChangeChat={onChangeChat}/>
        </Container>
    )
}

export default DirectMessage;