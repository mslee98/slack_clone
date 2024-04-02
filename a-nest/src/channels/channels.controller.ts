import { Body, Controller, Get, Param, Post, Query, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ChannelsService } from './channels.service';
import { User } from 'src/common/decorators/user.decorator';
import { PostChatDto } from './dto/post-chat.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import multer, { Multer } from 'multer';
import path from 'path';
import fs from 'fs';

try {
    fs.readdirSync('uploads');
} catch (error) {
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
    fs.mkdirSync('uploads')
}

@ApiTags('CHANNEL')
@Controller('api/workspaces/:url/channels')
export class ChannelsController {
    constructor(
        private channelsService: ChannelsService
    ) {}


    @Get()
    async getWorkspaceChannels(@Param('url') url, @User() user) {
        return this.channelsService.getWorkspaceChannels(url, user.id);
      }

    @Post()
    createChannel() {}

    @Get()
    getSpecificChannel() {}

    @Get(':name/chats')
    getChats(
        @Param('url') url: string,
        @Param('name') name: string,
        @Query() query, 
        @Param() param) {
            return this.channelsService.getWorkspaceChannelChats(
                url,
                name,
                query.perPage,
                query.page
            );
    }

    @Post(':name/chats')
    postChat(
        @Param('url') url: string,
        @Param('name') name: string,
        @Body() body: PostChatDto,
        @User() user,
        ) {
        return this.channelsService.postChat({
            url, 
            name, 
            content: body.content, 
            myId: user.myId
        })
    }



    // 단일/멀티 파일업로드 변수 약간 다르니 주의하셈!!
    // SingleFileupload => FileInterceptor - UploadFile() file: Express.Multer.File
    // MultiFileUpload => FilesInterceptor - UploadedFiles() files: Express.Multer.File[]
    // FilesInterceptor('이미지키값', {})을 가로채서 @UploadedFile에 DI 됨 {}에는 express에서 사용하던 Multer설정 그대로 적어주면 됨
    @UseInterceptors(FilesInterceptor('image', 10, {
        storage: multer.diskStorage({
            destination(req, file, cb) {
                cb(null, 'uploads/');
            },
            filename(req, file, cb) {
                const ext = path.extname(file.originalname);
                cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
            },
        }),
        limits: { fileSize: 5 * 1024 * 1024 } // 5MB
    }))
    @Post(':name/images')
    postImages(
        @UploadedFiles() files: Express.Multer.File[],
        @Param('url') url: string,
        @Param('name') name: string,
        @User() user
    ) {
        /**
         * exporess에서 사용하던 방식을 어떻게 바뀌는지 잘 파악
         * 
         */
        return this.channelsService.createWorkspaceChannelImages(url, name, files, user.id)
    }

    @Get(':name/unreads')
    getUnreads(
        @Param('url') url: string,
        @Param('name') name: string,
        @Query('after') after: number,
    ) {
        return this.channelsService.getChannelUnreadsCount(url, name, after)
    }
    

    @Get(':name/members')
    getAllMembers(@Param('url') url: string, @Param('name') name: string) {
        return this.channelsService.getWorkspaceChannelMembers(url, name);
    }

    @Get('name:/members')
    inviteMembers() {}


}
