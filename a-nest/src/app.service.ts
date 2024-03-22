import { Injectable } from '@nestjs/common';
import { UsersService } from './users/users.service';

@Injectable()
export class AppService {
  constructor(private userService: UsersService) {

  }
  
  async getHello() {
    return process.env.SECRET;
  }
}
