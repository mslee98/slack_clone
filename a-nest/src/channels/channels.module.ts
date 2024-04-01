import { Module } from '@nestjs/common';
import { ChannelsController } from './channels.controller';
import { ChannelsService } from './channels.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channels } from 'src/entities/Channels';
import { ChannelMembers } from 'src/entities/ChannelMembers';
import { Workspaces } from 'src/entities/Workspaces';
import { ChannelChats } from 'src/entities/ChannelChats';
import { Users } from 'src/entities/Users';

@Module({
  imports: [TypeOrmModule.forFeature([Channels, ChannelMembers, Workspaces, ChannelChats, Users])],
  controllers: [ChannelsController],
  providers: [ChannelsService]
})
export class ChannelsModule {}
