import { IChat, IDM } from '@typings/db';
import dayjs from 'dayjs';




/** 타입 정의할 때 지금
 * DM메시지와 채널 메시지를 동시에 사용하기 때문에 올 수 있는 타입이 IDM[] | IChat[]
 * 2가지가 존재하는데 보면 (IDM[] | IChat[])으로 나누는게 아니라 (IDM | IChat)[] 이렇게 나눈다
 */
export default function makeSection(chatList: (IDM | IChat)[]) {
    const sections: { [key: string]: (IDM | IChat)[] } = {};

    chatList.forEach((chat) => {
        const monthDate = dayjs(chat.createdAt).format('YYYY-MM-DD');

        if(Array.isArray(sections[monthDate])) {
            sections[monthDate].push(chat);
        } else {
            sections[monthDate] = [chat]
        }
    });

    return sections;
}