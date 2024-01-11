import { VFC, useCallback, useEffect, useRef } from "react";
import { ChatArea, Form, MentionsTextarea, SendButton, Toolbox } from "@components/ChatBox/styles";
import React from "react";
import autosize from "autosize";

interface Props {
    chat: string;
    onSubmitForm: (e:any) => void;
    onChangeChat: (e:any) => void;
    placeholder?: string;
}
const ChatBox: VFC<Props> = ({chat, onSubmitForm, onChangeChat, placeholder}) => {

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
                onSubmitForm(e)
            } 
        }
    }, [onSubmitForm])

    return (
        <ChatArea>
            <Form onSubmit={onSubmitForm}>
            <MentionsTextarea
                id="editor-chat"
                value={chat}
                onChange={onChangeChat}
                onKeyDown={onKeydownChat}
                placeholder={placeholder}
                ref={textareaRef}
            >
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