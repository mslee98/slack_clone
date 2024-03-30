import { BadRequestException, HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';
import { DataSource, Repository } from 'typeorm';
import bcrypt from 'bcrypt';
//import { HttpExceptionFilter } from 'src/http-exception.filter';
import { WorkspaceMembers } from 'src/entities/WorkspaceMembers';
import { ChannelMembers } from 'src/entities/ChannelMembers';

@Injectable()
export class UsersService {
  constructor(
    
    //Repository를 Injection하려면 user.module에서 사전에 import해야함
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,

    @InjectRepository(WorkspaceMembers)
    private workspaceMembersRepository: Repository<WorkspaceMembers>,

    @InjectRepository(ChannelMembers)
    private channelMembersRepository: Repository<ChannelMembers>,

    private dataSource: DataSource
  ) {}


  getUsers() {
    throw new Error('Method not implemented.');
  }

  async postUsers(email: string, nickname: string, password: string) {

      // Front에서도 체크하겠지만 서버쪽에서도 체크해줘야함 
      // 아래와 같은 벨리데이션 체크를 DTO단 에서 체크할 수 있음.

      /**
       * main.ts에서 useGlobalFilter로 연결했기 때문에
       * 아래 Exception들이 걸림
       * 
       * BadRequestException은 400 을 의미
       * UnauthorizedException은 401을 의미
       * Exception을 상속받아 더 세부적으로도 나누어져있음
       */


      //이 부분은 Entities에서 처리하기 때문에 필요 없어짐!
      // if(!email) {
      //   throw new HttpException('이메일이 없습니다.', 400);
      // }
      
      // if(!nickname) {
      //   throw new HttpException('닉네임이 없습니다.', 400);
      // }
      
      // if(!password) {
      //   throw new BadRequestException('비밀번호가 없습니다.');
      // }

      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const user = await queryRunner.manager.getRepository(Users).findOne({where: {email}})

      if(user) {
        //throw는 return 기능도 수행함 
        throw new UnauthorizedException('이미 존재하는 User입니다.');
      } 
      
      const hashedPassword = await bcrypt.hash(password, 12);
      
      try {
        const returned = await queryRunner.manager.getRepository(Users).save({
          email,
          nickname,
          password: hashedPassword
        });

        // 롤백 테스트
        //throw new Error("롤백 되는지 테스트 진행중임!!!");
        
        const workspaceMember = queryRunner.manager.getRepository(WorkspaceMembers).create();
        workspaceMember.UserId = returned.id;
        workspaceMember.WorkspaceId = 1;
        
        await queryRunner.manager.getRepository(WorkspaceMembers).save(workspaceMember)
        
        await queryRunner.manager.getRepository(ChannelMembers).save({
          UserId: returned.id,
          ChannelId: 1,
        })

        await queryRunner.commitTransaction();
        return true;

      } catch(error) {
        queryRunner.rollbackTransaction();
      } finally {
        queryRunner.release();
      }
  }
}
