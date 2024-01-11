import React, { useCallback } from 'react';
import { Container, Header } from '@pages/Channel/styles';
import ChatList from '@components/ChatList';
import ChatBox from '@components/ChatBox';
import useInput from '@hooks/useInput';
import axios from 'axios';
import { useParams } from 'react-router';

const Channel = () => {

    const { workspace, id } = useParams<{workspace: string, id: string}>();


    const [chat, onChangeChat, setChat] = useInput('');

    const onSubmitForm = useCallback((e) => {
        e.preventDefault();
        console.log("submit");
        // if(chat?.trim()) {
        //     axios.post(`/api/workspacess/${workspace}/dms/${id}/chats`.)
        // }
        setChat('')
    },[]);

    return (
        //Workspace index내 Switch를 사용함으로써 안 감싸줘도 된다.
        // <Workspace>
        //     <div>login success</div>
        // </Workspace>
        <Container>
            <Header>채널</Header>
            <ChatList />
            <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm}/>
        </Container>
    );
}

export default Channel;