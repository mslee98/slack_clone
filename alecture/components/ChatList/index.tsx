import Chat from '@components/Chat';
import { ChatZone } from '@components/ChatList/styles';
import { IDM } from '@typings/db';
import React, { VFC } from 'react';

interface Props {
    //IDM은 DM타입임
    chatData?: IDM[]
}

const ChatList: VFC<Props> = ({chatData}) => {
    return (
        <ChatZone>
            {chatData?.map((chat) => (
                <Chat key={chat.id} data={chat}/>
            ))}
        </ChatZone>
    )
}

export default ChatList;