import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';

@Controller('api/workspaces/:url/dms')
export class DmsController {

    /**
     * @Query
     * @Query() 를 통해 쿼리파라미터를 받을 수 있으며
     * 인자를 넣으면 특정 쿼리 Key 값에 있는 값만 가져오고 아무것도 넣지 않으면 전체 쿼리스트링 값들을 가져옴
     * 
     * 예로 @Query('perPage) perPage => perPage에 대한 쿼리 스트링 값만
     * @Query() query => query.perPage 이런식으로 받아 올 수 있음
     * ==================================================================================================
     * @Param
     * workspace/:url | :id/chats 등 이런걸 라우터 파라미터라고 하는데 이런것들은 @Param() 으로 가져올 수 있음
     * 지금 밑에 보면 Get(":id/chats") 으로 받아오면
     * @Param() param => param.id 이런식으로 받아오기 가능
     */
    @Get(':id/chats')
    getChat(@Query() query, @Param() param) {
        console.log(query, query.perPage, param.id);
    }

    /**
     * 
     * @param body 
     * body로 들어오는 데이터가 무슨 타입인지 모르기 때문에 DTO 타입을 정해줄 때 인터페이스가 아닌 클래스로 작성한다**
     */
    @Post(':id/chats')
    postChat(@Body() body) {}
}
