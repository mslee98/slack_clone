import React, { useCallback, useEffect, useRef } from 'react';
import { Container, Header } from '@pages/DirectMessage/styles';
import useSWR, { mutate, useSWRInfinite } from 'swr';
import fetcher from '@utils/fetcher';
import gravatar from 'gravatar';
import { useParams } from 'react-router';
import ChatBox from '@components/ChatBox';
import useInput from '@hooks/useInput';
import axios from 'axios';
import { IDM } from '@typings/db';
import ChatList from '@components/ChatList';
import makeSection from '@utils/makeSection';
import Scrollbars from 'react-custom-scrollbars';
import useSocket from '@hooks/useSocket';

const DirectMessage = () => {
    const scrollbarRef = useRef<Scrollbars>(null);
    const { workspace, id } = useParams<{workspace: string, id: string}>();

    const { data: userData} = useSWR(`/api/workspaces/${workspace}/users/${id}`, fetcher);
    const { data: myData} = useSWR(`/api/users`, fetcher);
    const [chat, onChangeChat, setChat] = useInput('');

    // 채팅을 받아오는 api - useSWRInfinite 미적용
    // const { data: chatData, mutate: mutateChat, revalidate} = useSWR<IDM[]>(
    //     `/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=1`,
    //     fetcher
    // )

    // 채팅을 받아오는 api - useSWRInfinite 적용
    // index는 페이지 수를 의미함, setSize는 페이지 수를 바꿔
    const { data: chatData, mutate: mutateChat, revalidate, setSize} = useSWRInfinite<IDM[]>(
        (index) => `/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=${index+1}`,
        fetcher
    )

    const [socket] = useSocket(workspace);

    // 인피니티 스크롤링을 진행할 때 아래 2개 변수를 사용해주는게 매우 유용함
    // isEmpty는 가져온 데이터가 0개인 경우 페이지 내 데이터가 40개인 경우 처음 20 두번 째 20 이면 더 이상 가져올 데이터가 없으니 isEmpty는 true
    const isEmpty = chatData?.[0]?.length === 0;

    // 만약 데이터가 45개라면 20 + 20 + 5로 가져올텐데 isEmpty는 아니지만 isReachingEnd는 true가 되는걸 알 수 있
    const isReachingEnd = isEmpty || (chatData && chatData[chatData.length - 1]?.length < 20) || false



    const onSubmitForm = useCallback((e) => {
        e.preventDefault();

        if(chat?.trim() && chatData) {
            const savedChat = chat;
            mutateChat((prevChatData) => {
                prevChatData?.[0].unshift({
                    id: (chatData[0][0]?.id || 0) + 1,
                    content: savedChat,
                    SenderId: myData.id,
                    Sender: myData,
                    ReceiverId: userData.id,
                    Receiver: userData,
                    createdAt: new Date(),
                  });

                return prevChatData;
            }, false)// 옵티미스틱 UI를 사용할 땐 shouldRevaliddate를 false로
                .then(() => {
                    setChat('');
                    scrollbarRef.current?.scrollToBottom();
                })
            axios.post(`/api/workspaces/${workspace}/dms/${id}/chats`, {
                content: chat,
            })
            .then(() => {
                //이 과정을 보면 0.1초? 그 쯤이지만 딜레이가 있음
                revalidate(); 
                })
                .catch(console.error);
        }

    }, [chat, chatData, myData, userData, workspace, id]);


    /** 로딩 시 스크롤 바 제일 아래로 */
    useEffect(() => {
        if(chatData?.length === 1) {
            scrollbarRef.current?.scrollToBottom()
        }
    },[chatData])

    const onMessage = useCallback((data: IDM) => {
        if(data.SenderId === Number(id) && myData.id !== Number(id))
        mutateChat((chatData) => {
            chatData?.[0].unshift(data);
            return chatData;
        }, false)
            .then(() => {
                /** 
                 * 내가 채팅창 위로 올릴 때 남이 채팅해서 계속 내려가면 문제잖슴?
                 * 그걸 방지
                 */
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
    }, [])

    useEffect(() => {
        socket?.on('dm', onMessage)
        return () => {

        }
    }, [socket, onMessage])

    if(!userData || !myData) {
        return null;
    }

    //flat() 2차원 배열을 1차원 배열로 바꿈.
    const chatSections = makeSection(chatData ? chatData.flat().reverse() : []);
    
    return (
        <Container>
            <Header>
                <img src={gravatar.url(userData.email, {s:'24px', d:'retro'})} alt={userData.nickname} />
                <span>{userData.nickname}</span>
            </Header>
            <ChatList chatSections={chatSections} scrollRef={scrollbarRef} setSize={setSize} isReachingEnd={isReachingEnd}/>
            <ChatBox chat={chat} onSubmitForm={onSubmitForm} onChangeChat={onChangeChat}/>
        </Container>
    )
}

export default DirectMessage;