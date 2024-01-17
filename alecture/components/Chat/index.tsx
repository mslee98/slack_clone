import { IChat, IDM } from '@typings/db';
import React, { VFC, memo, useMemo } from 'react';
import { ChatWrapper } from '@components/Chat/styles';
import gravatar from 'gravatar';
import dayjs from 'dayjs'
import regexifyString from 'regexify-string';
import { Link, useParams } from 'react-router-dom';


/**
 * 문법 명칭?이런건 잘 알아두라고 함
 * a?.b; => optional chaining
 * a??b; => nullish coalescing
 */

interface Props {
    data: IDM | IChat;
}

//말단 컴포넌트들은 가능하면 memo 사용
// memo는 props가 똑같으면 부모가 바뀌어도 자식을 리렌더링하지 않음
const Chat: VFC<Props> = memo(({ data }) => {
    const {workspace} = useParams<{workspace: string; channel: string}>();

    // 이런 걸 타입 가드라고 함 2개 이상 타입이 있을 때 타입을 구분해주는것
    const user = 'Sender' in data ? data.Sender : data.User;


    /**
     * 정규 표현식 라이브러리 regexify-string
     * pattern 부분은 정규 표현식을 기입해야하며
     * 현재
     * //g => /표현식 패턴을 정의/ 이렇게 "//" 슬래쉬 안에 적어주면 됨
     * "\"는 escape라고 하는데 특수문자를 포함 문자로 해석(특수문자 무력화)
     * 보면 [.+\] "." 점은 모든 글자를 나타냄
     * "?"는 앞의 표현식이 0회나 1회 포함해야하는건데 지금 하는건 . . 모든 글자기 때문에 한글자라도 포함 해야한다는거고 "+"는 앞의 문자가 1회 이상 반복인데 마찬가지로 . . 모든글자기 때문에 모든글자 적어주는거임
     * \d\는 숫자를 의미 함
     */

    /**
     * useMemo는 Hooks 안에서 개별 값을 캐싱하고 싶을 때 사용
     */
    const result = useMemo(() => regexifyString({
        input: data.content,
        pattern: /@\[(.+?)]\((\d+?)\)|\n]/g,
        decorator(match, index) {
            //decorator에 매칭된 것들이 걸림
            const arr: string[] | null = match.match(/@\[(.+?)\]\((\d+?)\)/)!;

            if(arr) {
                return (
                    <Link key={match+index}to={`/workspace/${workspace}/dm/${arr[2]}`}>
                        @{arr[1]}
                    </Link>
                )
            }
            return <br key={index}/>;
        }
    }), [data.content])
    return (
        <ChatWrapper>
            <div className='chat-img'>
                <img src={gravatar.url(user.email, {s: '36px', d: 'retro'})} alt={user.nickname} />
            </div>
            <div className='chat-text'>
                <div className='chat-user'>
                    <b>{user.nickname}</b>
                    <span> {dayjs(data.createdAt).format('h:mm A')}</span>
                </div>
                <p>{result}</p>
            </div>
        </ChatWrapper>
    )
})

export default memo(Chat);