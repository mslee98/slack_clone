import Chat from '@components/Chat';
import { ChatZone, Section, StickyHeader } from '@components/ChatList/styles';
import { Button } from '@pages/SignUp/styles';
import { IDM } from '@typings/db';
import React, { ForwardedRef, RefObject, VFC, forwardRef, useCallback, useRef } from 'react';
import Scrollbars from 'react-custom-scrollbars';

interface Props {
    //IDM은 DM타입임

    chatSections: { [key: string]: IDM[]}
    // chatData?: IDM[]
    setSize: (f: (size: number) => number) => Promise<IDM[][] | undefined>
    isReachingEnd: boolean;
    scrollRef: RefObject<Scrollbars>;
}

const ChatList: VFC<Props> = (({chatSections,setSize, isReachingEnd, scrollRef}) => {

    const scrollbarRef = useRef(null);
    
    /**
     *  onScrollFrame에 의해서 스크롤을 내릴 때 이벤트가 호출 됨
     */
    const onScroll = useCallback((values) => {
        // 스크롤이 가장 위에있을 때
        if(values.scrollTop === 0 && !isReachingEnd) { //isReachingEnd가 false라는건 더이상 데이터가 없는것
            setSize((prevSize) => prevSize+1)
                .then(() => {
                    //스크롤 위치 유지
                    console.log("올라가는건가?")
                    if(scrollRef?.current){
                        scrollRef.current?.scrollTop(scrollRef.current?.getScrollHeight() - values.scrollHeight);
                    }
                })
        }
    }, [])

    return (
        <ChatZone>
            <Scrollbars autoHide ref={scrollRef} onScrollFrame={onScroll}>
                {Object.entries(chatSections).map(([date, chats]) => {
                return (
                    <Section className={`section-${date}`} key={date}>
                        <StickyHeader>
                            <button>{date}</button>
                        </StickyHeader>
                        {chats.map((chat) => (
                            <Chat key={chat.id} data={chat} />
                        ))}
                    </Section>
                    );
                })}
            </Scrollbars>
            </ChatZone>
    )
})

export default ChatList;