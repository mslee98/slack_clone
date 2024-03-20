import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
    getUsers() {
      throw new Error('Method not implemented.');
    }
    postUsers(email: string, nickname: string, password: string) {
        // throw new Error('Method not implemented.');
    }
}
