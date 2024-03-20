import { ApiProperty } from "@nestjs/swagger";

export class JoinRequestDto {

    @ApiProperty({
        example: 'mslee@kakao.com',
        description: '이메일',
        required: true,
    })
    public email: string;

    @ApiProperty({
        example: 'mslee',
        description: 'nickname',
        required: true,
    })
    public nickname: string;

    @ApiProperty({
        example: '1234',
        description: 'password',
        required: true,
    })
    public password: string;
}