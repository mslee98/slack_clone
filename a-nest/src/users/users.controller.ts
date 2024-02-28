import { Controller, Get, Post, Req, Res } from '@nestjs/common';

@Controller('users')
export class UsersController {
    @Get()
    getUsers(@Req() req) { // Request에 대한 정보는 @Req/@Request 를 통해 가져올 수 있음 | Response 데이터는 @Res/@Response
        return req.user;
    }

    @Post()
    postUsers() {

    }

    @Post('login')
    login() {
        
    }

    @Post('logout') 
    logOut(@Req() req, @Res() res) {
        req.logOut();
        res.clearCookie('connect.sid', { httpOnly: true });
        res.send('ok')
    }
    
}
