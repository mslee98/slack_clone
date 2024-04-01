import { Controller, Get, Injectable, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ChannelsService } from './channels.service';

@ApiTags('CHANNEL')
@Controller('api/workspaces/:url/channels')
export class ChannelsController {
    constructor(
        private channelsService: ChannelsService
    ) {}

    @Get()
    getALlMembers() {}

    @Post()
    createChannel() {}

    @Get()
    getSpecificChannel(@Param('name') name: string) {}

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
