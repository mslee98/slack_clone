import io from 'socket.io-client'

import { VFC, useCallback } from 'react'
import axios from 'axios';

const backUrl = 'http://localhost:3095';
//socket은 여러 워크스페이스를 관리할 수 있게 하려고 만든 변수
const sockets: { [key: string]: SocketIOClient.Socket } = {};
const useSocket = (workspace?: string): [SocketIOClient.Socket | undefined, () => void ] => {
    console.log('rerender', workspace);
    const disconnect = useCallback(() => {
        if(workspace) {
            sockets[workspace].disconnect();
            delete sockets[workspace];
        } 
    }, [workspace])

    if(!workspace) {
        return [undefined, disconnect]
    } 

    /**
     * 아래 처럼 연결하면 되는데 슬랙과 같은 서비스에서 http://localhost:3095로 해버리면
     * 모든 접속자들이 소켓 연결을 공유하기 때문에
     * http://localhost:3095/워크스페이스명/채널명 이런식으로 구분할 수 있게 작업 해야함.
     */


    // if로 감싸주는 이유는 rerender가 계속 진행 이미 있다면 sockets객체를 더 이상 만들필요가 없기 때문
    if(!sockets[workspace]) {
        sockets[workspace] = io.connect(`${backUrl}/ws-${workspace}`, {
            // IE9 이런 브라우저에서는 우선 http요청으로 보내 브라우저 인증을 하고 후에 socket으로 보내는 그런 변환 작업들이 있음.
            // 그런거 필요없이 바로 socket으로 연결할거면 밑에 옵션 transparents: ["websocket"] 명시
            transports: ['websocket']
        });
    }


    /**
     * socket은 간단하게 저렇게 연결할 수 있음 설치시에 버전 잘 맞추는게 중요
     * socket은 간단하게 설명하자면 emit()으로 서버에게 요청, on()으로 서버로 부터 데이터를 받는다고 생각하면 된다.
     * 
     * ## socket.emit() ####
     * socket.emit('hello', 'world');
     * emit()을 사용하면 정의해 둔 hello라는 이벤트 명에게  "world"라는 데이터를 전달한다.
     * 
     * ## socket.on() ####
     * socket.on('message', (data) => { callback() });
     */

    sockets[workspace].emit('hello', 'world');

    // sockets[workspace].on('message', (data) => {
    //     console.log(data)
    // })

    // sockets[workspace].on('data', (data) => {
    //     console.log(data);
    // })

    // sockets[workspace].on('onlineList', (data) => {
    //     console.log(data);
    // })

    return [sockets[workspace], disconnect]

}

export default useSocket;