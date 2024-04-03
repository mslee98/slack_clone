import { ApiProperty, PickType } from "@nestjs/swagger";
import { Users } from "../../entities/Users";

export class JoinRequestDto extends PickType(Users, ['email', 'nickname', 'password'] as const) {

    /**
     * 아래는 Entities 사용안할 때 임
     * Entities/Users보면 다 정의되어 있어서 가져오기만 하면 된다.
     * 
     * PickType은 swaggerUI 
     *  */
    
    
    // @ApiProperty({
    //     example: 'mslee@kakao.com',
    //     description: '이메일',
    //     required: true,
    // })
    // public email: string;

    // @ApiProperty({
    //     example: 'mslee',
    //     description: 'nickname',
    //     required: true,
    // })
    // public nickname: string;

    // @ApiProperty({
    //     example: '1234',
    //     description: 'password',
    //     required: true,
    // })
    // public password: string;
}