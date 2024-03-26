import { Body, Controller, Get, Post, Req, Res, UseInterceptors } from '@nestjs/common';
import { JoinRequestDto } from './dto/join.request.dto';
import { UsersService } from './users.service';
import { ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserDTO } from 'src/common/dto/users.dto';
import { User } from 'src/common/decorators/user.decorator';
import { UndefinedToNullInterceptor } from 'src/common/interceptors/undefinedToNull.interceptor';

@UseInterceptors(UndefinedToNullInterceptor) // 인터셉터 장착
@ApiTags('USERS') // SwaggerUI 그룹화
@Controller('api/users')
export class UsersController {
    constructor(private usersService: UsersService) {

    }
   
    @ApiOkResponse({
        description: '성공',
        type: UserDTO,
    })
    @ApiOperation({ summary: '내 정보 조회'})
    @Get()
    getUsers(@User() user) { // Request에 대한 정보는 @Req/@Request 를 통해 가져올 수 있음 | Response 데이터는 @Res/@Response
        return user;    
    }

    @ApiOperation({ summary: '회원가입'})
    @Post('')
    async join(@Body() body: JoinRequestDto) {
        await this.usersService.postUsers(body.email, body.nickname, body.password);

    }

    @ApiOkResponse({
        description: '성공',
        type: UserDTO,        
    })
    @ApiResponse({
        status: 500,
        description: '서버 에러'
    })
    @ApiOperation({ summary: '로그인'})
    @Post('login')
    login(@Req() req) {
        return req.user;
    }

    @ApiOperation({ summary: '로그아웃'})
    @Post('logout') 
    logOut(@Req() req, @Res() res) {
        req.logOut();
        res.clearCookie('connect.sid', { httpOnly: true });
        res.send('ok')
    }
    
}
