import { PickType } from "@nestjs/swagger";
import { ChannelChats } from "src/entities/ChannelChats";

//이런 DTO는 Entitiy 컬럼명을 끌어오기 때문에 벨리데이션체크는 Entities쪽에 적어줘야함
export class PostChatDto extends PickType(ChannelChats, ['content']) {
    
}