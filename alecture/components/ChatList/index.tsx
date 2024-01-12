import Chat from '@components/Chat';
import { ChatZone } from '@components/ChatList/styles';
import { IDM } from '@typings/db';
import React, { VFC, useCallback, useRef } from 'react';
import Scrollbars from 'react-custom-scrollbars';

interface Props {
    //IDM은 DM타입임
    chatData?: IDM[]
}

const ChatList: VFC<Props> = ({chatData}) => {

    const scrollbarRef = useRef(null);
    
    /**
     *  onScrollFrame에 의해서 스크롤을 내릴 때 이벤트가 호출 됨
     */
    const onScroll = useCallback(() => {

    }, [])

    return (
        <ChatZone>
            <Scrollbars autoHide ref={scrollbarRef} onScrollFrame={onScroll} >
                {chatData?.map((chat) => (
                    <Chat key={chat.id} data={chat}/>
                ))}
            </Scrollbars>
        </ChatZone>
    )
}

export default ChatList;