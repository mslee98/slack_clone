import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('CHANNEL')
@Controller('api/workspaces/:url/channels')
export class ChannelsController {
    constructor() {}

    @Get()
    getALlMembers() {}

    @Post()
    createChannel() {}

    @Get()
    getSpecificChannel() {}

    @Get(':name/chats')
    getChats(@Query() query, @Param() param) {

    }

    @Post(':name/chats')
    postChat() {}

    @Get(':name/members')
    getAllMembers() {}

    @Get('name:/members')
    inviteMembers() {}


}
