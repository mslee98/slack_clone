import { Body, Controller, Get, Post, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { JoinRequestDto } from './dto/join.request.dto';
import { UsersService } from './users.service';
import { ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserDTO } from '../common/dto/users.dto'//'src/common/dto/users.dto';
import { User } from 'src/common/decorators/user.decorator';
import { UndefinedToNullInterceptor } from 'src/common/interceptors/undefinedToNull.interceptor';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { LoggedInGuard } from 'src/auth/logged-in.guard';
import { NotloggedInGuard } from 'src/auth/not-logged-in.guard';

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
        return user || false;    
    }

    @UseGuards(new NotloggedInGuard())
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
    @UseGuards(new LocalAuthGuard())
    login(@User() user) {
        return user;
    }

    @UseGuards(new LoggedInGuard())
    @ApiOperation({ summary: '로그아웃'})
    @Post('logout') 
    logOut(@Req() req, @Res() res) {
        req.logOut();
        res.clearCookie('connect.sid', { httpOnly: true });
        res.send('ok')
    }
    
}
