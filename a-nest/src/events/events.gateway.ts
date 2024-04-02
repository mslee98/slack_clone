import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { onlineMap } from './onlineMap';
// npx @nestjs/cli g ga events
/**
 * 
 * 몰랐던것으로 WebSocket과 socket.io는 다른거였다..
 * WebSocket => HTML5에서 정의된 통신 프로토콜
 * Socket.io => WebSocket을 기반으로 한 JS 라이브러리로, WebSocket을 지원하지 않는 브라우저 대안으로 풀백기능 제공 
 * 
 * web socket구조는
 * namespace안에 room들이 여러개있는 구조이다.
 * namespace는 workspace
 * room은 channel/dm 단위로 사용할예정
 */


/**
 * OnlineMap은 Socket정보를 담을 워크스페이스 참가자 목록을 담고있는 실시간 객체
 * 원래 Radis같은걸로 따로 빼둬야 서버가 종료되도 이어서 사용할 수 있음
 */
// export const onlineMap = {}; 따로 파일 빼둠

@WebSocketGateway({namespace: /\/ws-.+/})
// implements를 붙여주면 OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect 각각 가지고 있는 메서드를 필수적으로 정의해줘야한다.
// JAVA로 따지면 뭐 오버라이딩이
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{

  /**
   * @WebSocketServer 를 통해 의존성을 주입하고 emit을 할 수 있음
   */
  @WebSocketServer() public server: Server;

  /**
   * @SubscribeMessage('message')
   * handleMessage(client: any, payload: any): string {
   * return 'Hello world!';}
  */

  @SubscribeMessage('test')
  handleTest(@MessageBody() data: string) {
    console.log('test', data)
  }

  @SubscribeMessage('login')
  handleLogin(
    @MessageBody() data: {id: number, channels: number[]},
    @ConnectedSocket() socket: Socket
    ) {
      const newNamespace = socket.nsp;
      console.log('login', newNamespace);
      onlineMap[socket.nsp.name][socket.id] = data.id;
      newNamespace.emit('onlineList', Object.values(onlineMap[socket.nsp.name]))
      
      console.log("?????????????????????")

      data.channels.forEach((channel) => {
        console.log('join', socket.nsp.name, channel);
        socket.join(`${socket.nsp.name}-${channel}`);
      })
  }

  // OnGatewayInit
  afterInit(server: Server) {
    console.log('WebSocket Server Init.....')
  }


  // OnGatewayConnection
  handleConnection(@ConnectedSocket() socket: Socket): any {
    console.log('connected', socket.nsp.name);

    if(!onlineMap[socket.nsp.name]) {
      onlineMap[socket.nsp.name] = {};
    }
    socket.emit('hello', socket.nsp.name);
  }

  // OnGatewayDisconnect
  handleDisconnect(@ConnectedSocket() socket: Socket): any {
    console.log('disconnected', socket.nsp.name);
    const newNamespace = socket.nsp;
    delete onlineMap[socket.nsp.name][socket.id];
    newNamespace.emit('onlineList', Object.values(onlineMap[socket.nsp.name]))
    
  }
}
