import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../entities/Users';
import { AuthService } from './auth.service';

@Injectable()
export class LocalSerializer extends PassportSerializer {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(Users) private usersRepository: Repository<Users>,
  ) {
    super();
  }

  serializeUser(user: Users, done: CallableFunction) {
    console.log(user);
    done(null, user.id);
  }

  /**
   * TypeORM에서 Join을 쓰는 방법은 크게 2가지임 join을 사용하거나 relations를 사용하는 방식인데,
   * join: ['Workspaces'] / relactions: ['Workspaces']
   * Users Entities보면 ManyToMany로 관계 설정을 해놓기 때문에 가능하다.
   * 
   */
  async deserializeUser(userId: string, done: CallableFunction) {
    return await this.usersRepository
      .findOneOrFail({
        where: { id: +userId },
        select: ['id', 'email', 'nickname'],
        relations: ['Workspaces'],
      })
      .then((user) => {
        console.log('user', user);
        done(null, user);
      })
      .catch((error) => done(error));
  }
}
