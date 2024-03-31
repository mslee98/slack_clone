import { Body, Controller, Delete, Get, Injectable, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WorkspacesService } from './workspaces.service';
import { User } from 'src/common/decorators/user.decorator';
import { Users } from 'src/entities/Users';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';

@ApiTags('WORKSPACE')
@Controller('api/workspaces')
export class WorkspacesController {
    constructor(
        private workspacesService: WorkspacesService
    ) {}

    @Get()
    getMyWorkspaces(
        @User() user: Users
    ) {
        return this.workspacesService.findByWorkspaces(user.id);
    }

    @Post()
    createWorkspace(
        @User() user: Users,
        @Body() body: CreateWorkspaceDto 
    ) {
        return this.workspacesService.createWorkspace(body.url, body.workspace, user.id)
    }

    @Get(':url/mambers')
    getAllMembersFromWorkspace() {}

    @Post(':url/members')
    inviteMembersToWorkspace() {}

    @Delete(':url/members/:id')
    kickMemberFromWorkspace() {}
 
    @Get(':url/members/:id')
    getMemberInfoInWorkspace() {}

    @Get(':url/users/:id')
    DEPRECATED_getMemberInfoInWorkspace() {
        this.DEPRECATED_getMemberInfoInWorkspace();
    }


}
