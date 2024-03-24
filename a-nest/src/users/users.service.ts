import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';

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
      if(!email) {
        throw new Error('이메일이 없습니다.');
      }
      
      if(!nickname) {
        throw new Error('닉네임이 없습니다.');
      }
      
      if(!password) {
        throw new Error('비밀번호가 없습니다.');
      }

      const user = await this.usersRepository.findOne({where: {email}})

      if(user) {
        //throw는 return 기능도 수행함 
        throw new Error('이미 존재하는 User입니다.');
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
