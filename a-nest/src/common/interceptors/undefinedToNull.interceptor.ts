/**
 * src/middlewares/logger.middleware.ts도 보면 AOP 관점으로 동작 함 실행 전/후로 로깅을 진행
 * 
 * express.js에서 인터셉터 부분이 애매했었는데 Nest.js에서 따로 만듬 
 */

import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, map } from "rxjs";

/**
 * Undefined를 Null로 바꿔주는 이유는 JSON객체를 가지고 요청/응답을 하는데
 * JSON은 Undefined를 모름/ Null만 취급하기 때문임
 * 
 * 거의 알아서 Rxjs까지 배우는거네 ㄷㄷ.
 */
@Injectable()
export class UndefinedToNullInterceptor implements NestInterceptor {
    intercept(
        context: ExecutionContext, 
        next: CallHandler<any>
    ): Observable<any> | Promise<Observable<any>> {
        // 컨트롤러 요청 전 부분
        // 로깅같은거 적으면 됨, 컨트롤러가 몇 초 걸렸나 등 ...


        //컨트롤러 요청 후 부분은 nest.handle()에 적어주면 된다. 아래는 예시임
        //return next.handle().pipe(map((data) => ({data, code: 'SUCCESS'})));// data는 컨트롤러에서 리턴 해주는 값
        
        return next
            .handle()
            .pipe(map((data) => data === undefined ? null : data))
    }
}

/**
 * Rxjs란 관찰 가능한 시퀀스를 사용하여 비동기 및 이벤트 기반 프로그램을 구성하기 위한 라이브러리,
 * 쉽게 이벤트나 비동기, 시간을 마치 Array처럼 다룰 수 있게 만들어 주는 라이브러리
 * Rx도 공부하긴해야하는데 너무 상세하게 파지는 말고 함수 같은것만 문법 느낌을 공부하면 좋을것 같다고 함
 * https://yozm.wishket.com/magazine/detail/1753/
 * 
 * pipe(...fns) => 함수 여러개 들어있으면 순서대로 실행 시켜주는 역할 
 * 
 * -----------------------------------------------------------------------------------------
 * 
 * Rxjs 에러 처리
 * ====================
 * catchError
 * ====================
 * return  next.handle().pipe(catchError) 이런식으로 사용하며 보통
 * Error 구문 만드는 형식이 
 * new Error('error')
 * Error.name = 'sss'
 * Error.message = 'xxx'
 * 이런식으로 나오면 응답할 때 이상해짐 그거를 catchError를 사용하면 Json객체 같은 걸로 응답해 줌
 * 제로쵸형은 이거 안쓰고 exception filter에서 처리한다고 하니 그거할 때 보자
 */