import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Container, Header } from '@pages/Channel/styles';
import ChatList from '@components/ChatList';
import ChatBox from '@components/ChatBox';
import useInput from '@hooks/useInput';
import axios from 'axios';
import { useParams } from 'react-router';
import fetcher from '@utils/fetcher';
import useSWR, { useSWRInfinite } from 'swr';
import makeSection from '@utils/makeSection';
import Scrollbars from 'react-custom-scrollbars';
import { IChannel, IChat, IUser } from '@typings/db';
import useSocket from '@hooks/useSocket';
import InviteChannelModal from '@components/InviteChannelModal';

const Channel = () => {
    const scrollbarRef = useRef<Scrollbars>(null);
    const { workspace, channel } = useParams<{workspace: string, channel: string}>();
    const { data: myData } = useSWR('/api/users', fetcher);
    const { data: channelData } = useSWR<IChannel>(`/api/workspaces/${workspace}/channels/${channel}`, fetcher);
    const { data: chatData, mutate: mutateChat, revalidate, setSize} = useSWRInfinite<IChat[]>(
        (index) => `/api/workspaces/${workspace}/channels/${channel}/chats?perPage=20&page=${index+1}`,
        fetcher
    )

    const { data: channelMembersData } = useSWR<IUser[]>(
        myData? `/api/workspaces/${workspace}/channels/${channel}/members` : null,
        fetcher
    )


    const [chat, onChangeChat, setChat] = useInput('');

    const [socket] = useSocket();
    
    const isEmpty = chatData?.[0]?.length === 0;
    const isReachingEnd = isEmpty || (chatData && chatData[chatData.length - 1]?.length < 20) || false;
    const [showInviteChannelModal, setShowInviteChannelModal] = useState(false);       

    const onSubmitForm = useCallback((e) => {
        e.preventDefault();

        if(chat?.trim() && chatData && channelData) {
            const savedChat = chat;
            mutateChat((prevChatData) => {
                prevChatData?.[0].unshift({
                    id: (chatData[0][0]?.id || 0) + 1,
                    content: savedChat,
                    UserId: myData.id,
                    User: myData,
                    ChannelId: channelData.id,
                    Channel: channelData,
                    createdAt: new Date(),
                })
                return prevChatData;
            }, false).then(() => {
                setChat('');
                scrollbarRef.current?.scrollToBottom();
            });

            axios  
                .post(`/api/workspaces/${workspace}/channels/${channel}/chats`, {
                    content: chat,
                })
                .then(() => {
                    revalidate()
                })
                .catch(console.error)
        }
        
    },[chat, chatData, myData, channelData, workspace, channel]);

    const onMessage = useCallback((data: IChat) => {
        if(data.Channel.name === channel && data.UserId !== Number(myData?.id)) {
            mutateChat((chatData) => {
                chatData?.[0].unshift(data);
                return chatData;
            }, false).then(() => {
                if(scrollbarRef.current) {
                    if(
                        scrollbarRef.current.getScrollHeight() <
                        scrollbarRef.current.getClientHeight() + scrollbarRef.current.getScrollTop() + 150
                    ) {
                        setTimeout(() => {
                            scrollbarRef.current?.scrollToBottom()
                        }, 50);
                    }
                }
            })
        }
    }, [channel, myData]);
    
      useEffect(() => {
        socket?.on('message', onMessage);
        return () => {
          socket?.off('message', onMessage);
        };
      }, [socket, onMessage]);
    
      // 로딩 시 스크롤바 제일 아래로
      useEffect(() => {
        if (chatData?.length === 1) {
          console.log('toBottomWhenLoaded', scrollbarRef.current);
          setTimeout(() => {
            console.log('scrollbar', scrollbarRef.current);
            scrollbarRef.current?.scrollToBottom();
          }, 500);
        }
      }, [chatData]);


    // 재사용성 ㄷㄷ
    const onClickInviteChannel = useCallback(() => {
        setShowInviteChannelModal(true);
    }, []);

    const onCloseModal = useCallback(() => {
        setShowInviteChannelModal(false);
    },[])

    if(!myData) return null;

    const chatSections = makeSection(chatData ? chatData.flat().reverse() : []);

    return (
        //Workspace index내 Switch를 사용함으로써 안 감싸줘도 된다.
        // <Workspace>
        //     <div>login success</div>
        // </Workspace>
        <Container>
            <Header>
                <span>#{channel}</span>
                <div className="header-right">
                <span>{channelMembersData?.length}</span>
                <button
                    onClick={onClickInviteChannel}
                    className="c-button-unstyled p-ia__view_header__button"
                    aria-label="Add people to #react-native"
                    data-sk="tooltip_parent"
                    type="button"
                >
                    <i className="c-icon p-ia__view_header__button_icon c-icon--add-user" aria-hidden="true" />
                </button>
                </div>
            </Header>
            <Header>채널</Header>
            {/* <ChatList /> */}
            <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm}/>
            <InviteChannelModal 
                show={showInviteChannelModal} 
                onCloseModal={onCloseModal}
                setShowInviteChannelModal={setShowInviteChannelModal}                
            />
        </Container>
    );
}

export default Channel;