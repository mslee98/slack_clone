import { ExecutionContext, createParamDecorator } from "@nestjs/common";

/**
 * ExecutionContext는 JS context와는 다르며,
 * 실행 컨텍스트를 통해 http서버, WebSocket서버와 통신을 통해 데이터를 주고 받을 수 있으며,
 * 커스텀 데코레이터를 만들어 중복을 제거할 수 있음
 */
export const Token = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const response = ctx.switchToHttp().getResponse();
        return response.locals.jwt;
    }
)