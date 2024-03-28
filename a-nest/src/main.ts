import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import session from 'express-session';
import { HttpExceptionFilter } from './http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
declare const module: any;

/**
 * Nest.js Request Lift Cycle
 * Http Request -> Middlewaer -> Guard -> Interceptors(pre, post) -> Pipe -> Controller
 * 크게 위에 과정이며 이 과정중에서 middleware를 제외한 전 과정에서 Exception Filter가 작용한다.
 * 
 * Middleware: Nest에 전역적으로 바인딩 된 미들웨어 + app.use를 실행한 다음 경로에서 결정되는 모듈 바인딩 미들웨어를 실행
 * Guard: 보통은 Permission체크로 많이 사용함
 * Interceptors: 컨트롤러 전/후(pre/post)로 많이 사용
 * Pipe: 요청하는 바디를 변환하는 작업 (벨리데이션 / 변환) 
 * Controller: Routing처리 및 비즈니스 로직 실행
 */

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  app.useGlobalPipes(new ValidationPipe())

  /**
   * HttpExceptionFilter
   * 모든 컨트롤러에서 발생하는 HttpException을 아래에서 걸러준다.
   */
  app.useGlobalFilters(new HttpExceptionFilter())

  /** SwaggerUI 연동 */
  const config = new DocumentBuilder()
    .setTitle('Sleact API')
    .setDescription('Sleact 개발을 위한 문서입니다.')
    .setVersion('1.0')
    .addCookieAuth('connect.sid')
    .build()
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  /**
   * 미들웨어을 아래와 같이 기존 express.js처럼 app.use로 연결을 해도 상관은 없음
   * express는 DI 구조를 안 갖춰줬기 때문에 따로 DI 관련 라이브러리를 사용해야 한다.
   */
  app.use(cookieParser());
  app.use(
    session({
      resave: false,
      saveUninitialized: false,
      secret: process.env.COOKIE_SECRET,
      cookie: {
        httpOnly: true,
      },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  const PORT = process.env.PORT || 3095;

  await app.listen(PORT);
  console.log(`Listen on PORT : ${PORT}`);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

}

bootstrap();
