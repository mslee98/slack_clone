import { VFC, useCallback, useEffect, useRef } from "react";
import { ChatArea, EachMention, Form, MentionsTextarea, SendButton, Toolbox } from "@components/ChatBox/styles";
import React from "react";
import autosize from "autosize";
import { Mention, SuggestionDataItem } from 'react-mentions';
import { IUser } from "@typings/db";
import fetcher from "@utils/fetcher";
import useSWR from "swr";
import { useParams } from "react-router";
import gravatar from 'gravatar';

interface Props {
    chat: string;
    onSubmitForm: (e:any) => void;
    onChangeChat: (e:any) => void;
    placeholder?: string;
}
const ChatBox: VFC<Props> = ({chat, onSubmitForm, onChangeChat, placeholder}) => {

    const {workspace} = useParams<{workspace: string}>()
    /**
     * 보면 useSWR<IUser | false> / IUser 는 /alecture/typings/db.ts로 DB별 타입이 정의된 파일임
     * 제네릭으로 IUser를 적어주면 되는데 문제는 로그인 정보가 없을 때는 false로 mutate(false)이 부분에서 에러가 나기 때문에
        * <IUser | false>로 정의함
        * 
        * useSWR 버전 업그레이드 인해 revalidate => mutate()로 변경되었다고 함..
    */
    const { data : userData, error, mutate } = useSWR<IUser | false>('/api/users', fetcher, {
        dedupingInterval: 2000,
    });

    const { data: memberData} = useSWR<IUser[]>(userData? `/api/workspaces/${workspace}/members` : null, fetcher);

    /** useRef사용할 때 null넣는 이유는 타입스크립트 에러 때문에 그럼 */
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    useEffect(() => {
        if(textareaRef.current) {
            autosize(textareaRef.current)
        }
    }, [])

    const onKeydownChat = useCallback((e) => {
        if(e.key === 'Enter') {
            if(!e.shiftKey) {
                console.log("4444");
                onSubmitForm(e)
            } 
        }
    }, [onSubmitForm])

    const renderSuggestion = useCallback((
        suggestion: SuggestionDataItem,
        search: string,
        highlightedDisplay: React.ReactNode,
        index: number,
        focus: boolean, 
    ): React.ReactNode => {
        if(!memberData) return;
        return (
            <EachMention focus={focus}>
                <img src={gravatar.url(memberData[index].email, {s: '20px', d: 'retro'})} alt={memberData[index].nickname}/>
                <span>{highlightedDisplay}</span>
            </EachMention>
        );
    },[memberData])

    return (
        <ChatArea>
            <Form onSubmit={onSubmitForm}>
            <MentionsTextarea
                id="editor-chat"
                value={chat}
                onChange={onChangeChat}
                onKeyDown={onKeydownChat}
                placeholder={placeholder}
                inputRef={textareaRef}
                allowSuggestionsAboveCursor
            >   
                {/* 
                    appendSpaceOnAdd => 붙어있으면 한 칸 뛰어주는 기능
                    trigger => @ 때만 작용
                 */}
                <Mention 
                    appendSpaceOnAdd 
                    trigger="@" 
                    data={memberData?.map((v) =>({id: v.id, display: v.nickname})) || []}
                    renderSuggestion={renderSuggestion}
                />
                {/* <textarea value={chat} onChange={onChangeChat} onKeyDown={onkeydownChat}></textarea> */}
            </MentionsTextarea>
            <Toolbox>
                <SendButton
                    className={
                        'c-button-unstyled c-icon_button c-icon_button--light c-icon_button--size_medium c-texty_input__button c-texty_input__button--send' +
                        (chat?.trim() ? '' : ' c-texty_input__button--disabled')
                    }
                    data-qa="texty_send_button"
                    aria-label="Send message"
                    data-sk="tooltip_parent"
                    type="submit"
                    disabled={!chat?.trim()}
                >
                <i className="c-icon c-icon--paperplane-filled" aria-hidden="true" />
                </SendButton>
            </Toolbox>
            </Form>
        </ChatArea>
    );
}

export default ChatBox