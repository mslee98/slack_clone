import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';
import { AuthModule } from 'src/auth/auth.module';
import { WorkspaceMembers } from 'src/entities/WorkspaceMembers';
import { ChannelMembers } from 'src/entities/ChannelMembers';

/**
 * 모듈 생성 가이드 
 * npx @nestjs/cli generate module users | nest generate module users
 * 위에 명령어를 통해 모듈 / 컨트롤러/ 서비스 생성이 가능함 명령어는 풀네임으로 적어도 되고 네스트 공식문서에 있는 약어를 사용해도 문제 없음
 * npx @nestjs/cli g mo users => mo - module
 * npx @nestjs/cli g s users => s - service
 * npx @nestjs/cli g co users => co - controller
 * */ 


@Module({
  imports: [TypeOrmModule.forFeature([Users, WorkspaceMembers, ChannelMembers]), AuthModule],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService]
})
export class UsersModule {}
