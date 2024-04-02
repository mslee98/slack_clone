import { Module } from '@nestjs/common';
import { ChannelsController } from './channels.controller';
import { ChannelsService } from './channels.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channels } from 'src/entities/Channels';
import { ChannelMembers } from 'src/entities/ChannelMembers';
import { Workspaces } from 'src/entities/Workspaces';
import { ChannelChats } from 'src/entities/ChannelChats';
import { Users } from 'src/entities/Users';
import { EventsModule } from 'src/events/events.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Channels, 
      ChannelMembers, 
      Workspaces, 
      ChannelChats, 
      Users]), 
    EventsModule,
  ],
  controllers: [ChannelsController],
  providers: [ChannelsService]
  /**
   * WebSocketGateway는 Provider라고 공식문서에 나와있는데
   * Provider에 넣으면 안됨
   * 그리고 EventGateway는 EventMoudle이 담고 있기 때문에 EventModule을 Import하는게 맞다
   * 만약 EventGateway를 Provider에 넣어버리면 "new"가 됨
   * 즉 새로운 웹소켓서버가 생김, 만약 channel뿐만 아니라 dm에도 쓴다면 서버가 2개 생기는거니 주의해야한다.
   * 
   * 또한 Module을 임포트했는데 Module내부 gateway를 쓰고 싶다면 Module내부에 gateway를 export해줘야한다.
   * @Module({
   *   providers: [EventsGateway],
   *   exports: [EventsGateway]
   * })
   */
})
export class ChannelsModule {}
