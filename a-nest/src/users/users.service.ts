import { BadRequestException, HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import { HttpExceptionFilter } from 'src/http-exception.filter';

@Injectable()
export class UsersService {
  constructor(
    
    //Repository를 Injection하려면 user.module에서 사전에 import해야함
    @InjectRepository(Users)
    private usersRepository: Repository<Users>
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

      const user = await this.usersRepository.findOne({where: {email}})

      if(user) {
        //throw는 return 기능도 수행함 
        throw new UnauthorizedException('이미 존재하는 User입니다.');
      } else {
        // user 없다면 password를 암호화해서 DB에 넣어줘야 함
        const hashedPassword = await bcrypt.hash(password, 12);
        await this.usersRepository.save({
          email,
          nickname,
          password: hashedPassword
        });
      }
  }
}
