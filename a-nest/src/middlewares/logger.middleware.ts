import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";


/**
 * loggerMiddleware로 morgan()처럼 로깅
 * morgan보다 기능은 적지만, 이렇게 직접적으로 미들웨어를 만들어서 사용할수도 있음
 * Context가 나온 개념으로 서로 다른 파일에서 Console이 너무 많이 나오면 로그 추적이 매우 힘듬
 * 그래서 나온 개념이 debug패키지를 설치해서 console-a 내용 console-b 내용 이런식으로 출력했었음
 * 
 * 보면 private logger = new Logger('HTTP')는 HTTP Context를 지정하므로 HTTP요청에 관해 다르게 보여주는거임
 */

@Injectable()
export class LoggerMiddleware implements NestMiddleware  {
    private logger = new Logger('HTTP');

    use(request: Request, response: Response, next: NextFunction): void {
        const { ip, method, originalUrl } = request;
        const userAgent = request.get('user-agent') || '';


        /**
         * response.on
         * 미들웨어 자체는 라우터보다 먼저 실행되는데 모건은 자체적으로 
         * request먼저 기록하고
         * 라우터 응답이 끝나면 로깅을 실행하는 방식임 커스텀 모건?으로 따라만든거지
         * 실제로는 nest morgan있으니 그걸 사용하
         */
        response.on('finish', () => {
            const { statusCode } = response;
            const contentLength = response.get('content-length');
            this.logger.log(`${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip}`);
        });

        next();
    }
}
/**
 * 아래와 같이 나옴
 * [Nest] 22780  - 2024. 02. 25. 오후 9:37:13     LOG [HTTP] GET / 200 12 - Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 ::1
 * [Nest] 22780  - 2024. 02. 25. 오후 9:37:13     LOG [HTTP] GET /favicon.ico 404 74 - Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 ::1
 */