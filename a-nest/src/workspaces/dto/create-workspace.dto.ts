import { ApiProperty, PickType } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";



export class CreateWorkspaceDto {
    
    @IsString() // validation check
    @IsNotEmpty() // validation check
    @ApiProperty({
        example: '슬리액트',
        description: '워크스페이스 명'
    })
    public workspace: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: 'sleact',
        description: 'url 주소'
    })
    public url: string
}