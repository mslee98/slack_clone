import { Module } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { WorkspacesController } from './workspaces.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workspaces } from 'src/entities/Workspaces';
import { Channels } from 'src/entities/Channels';
import { ChannelMembers } from 'src/entities/ChannelMembers';
import { WorkspaceMembers } from 'src/entities/WorkspaceMembers';
import { Users } from 'src/entities/Users';

@Module({
  imports: [TypeOrmModule.forFeature([Workspaces, WorkspaceMembers, Channels, ChannelMembers, Users])],
  providers: [WorkspacesService],
  controllers: [WorkspacesController]
})
export class WorkspacesModule {}
