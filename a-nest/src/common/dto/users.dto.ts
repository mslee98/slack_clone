import { ApiProperty } from "@nestjs/swagger";
import { JoinRequestDto } from '../../users/dto/join.request.dto'   //"src/users/dto/join.request.dto";

// JoinRequestDto에서 쓰는것들과 범용적으로 확장가능하네
// 보면 JoinRequestDto에서 이메일을 사용하기 때문에 굳이 쓸 필요 없어짐!
export class UserDTO extends JoinRequestDto {
    @ApiProperty({
        required: true,
        example: 1,
        description: '아이디' 
    })
    id: number

    // @ApiProperty({
    //     required: true,
    //     example: 'lms980321@kakao.com',
    //     description: '이메일' 
    // })
    // email: string
}
