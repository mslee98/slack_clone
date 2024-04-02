import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ChannelsService } from './channels.service';
import { User } from 'src/common/decorators/user.decorator';
import { Users } from 'src/entities/Users';
import { PostChatDto } from './dto/post-chat.dto';

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


    
    @Post(':name/images')
    postImages(@Body() body) {
        /**
         * exporess에서 사용하던 방식을 어떻게 바뀌는지 잘 파악
         */
        //return this.channelsService
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
