import { MiddlewareConsumer, Module, NestMiddleware, NestModule } from '@nestjs/common';
/**
 * ConfigModule
 * 기존 express사용하던 dotenv와 같은 것들을 감싸놓은 패키지
 * dotenv를 그냥 사용하려면 따로 설정해줘야하기 때문에 사
 */
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './middlewares/logger.middleware';

/**
 * forRoot(), forFeature(), register() => 위에 3개를 사용하는 이유는 따로 설정을 하기 위해서 필요
 * forRoot(컨트롤러),  forRoot(특정주소)에만 미들웨어 적용
 * 
 * ConfigModule 패키지를 설치하고 .env 파일을 생성후 변수를 넣어두면 dotenv처럼 process.env.변수로 접근이 가능함
 * 즉, ConfigModule을 사용함으로써 dotenv와 온전히 같게 사용할 수 있으며
 * 추가로 파일을 .env.product / .env.development 이런식으로 하면 환경설정별로 파일을 불러올 수 있다는데, 이거는 dotenv는 안되고 조금 더 확장된 패키지 설치 필요
 * nest는 그냥 들어가 있고, CRA도 들어가있는데 react-script이런 비슷한거였음
 * ------------------------------------------------------------------------------------
 * isGlobal: true로 하면 Config Service를 사용할 수 있는데, providers: [ConfigService]
 * process.env.NAME 이런게 아니라 내가 설정한 변수명으로 호출할수도 있음
 * private readonly configService: ConfigService
 * process.env.NAME === configService.get('NAME') 처럼 사용이 가능하다. 
 * ------------------------------------------------------------------------------------
 * load: 함수를 뺴두고 작업하는건데, 함수를 뺴두면 async/await사용을 할 수 있음,
 * 비동기 작업으로 통해 외부로 부터 얻어온 값들을 내부 프로젝트 env로 사용할 수 있음
 * 예로, AWS, Google, Git Secrets에 외부에 숨겨둔 변수들을 가져와서 프로젝트 .env에 있던것처럼 사용이 가능
 * 
 * */
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [AppController],
  providers: [AppService, ConfigService],
})

/**
 * 미들웨어는 consumer에만 연결
 */
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware).forRoutes('*') // 직접 만들었던 모듈 연결
  }
}
