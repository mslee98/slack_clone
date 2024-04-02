import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import session from 'express-session';
import { HttpExceptionFilter } from './http-exception.filter';
import { ValidationPipe } from '@nestjs/common';

import passportConfig from 'passport';
import { NestExpressApplication } from '@nestjs/platform-express';
import path from 'path';
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
  
  // Nest를 Festify로도 만들 수 있어서NestExpressApplication이런 제네릭 추가해주면 좋음
  // 명시를 안해주면 기본 내장된 모듈이 다를수도있기 떄문임
  // useStaticAssets같은것들은 Festify에는 없어서 에러나지만 Express로 제네릭 해주면 추론이 가능하다.
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  //passportConfig();


  app.useGlobalPipes(new ValidationPipe())

  /**
   * HttpExceptionFilter
   * 모든 컨트롤러에서 발생하는 HttpException을 아래에서 걸러준다.
   */
  app.useGlobalFilters(new HttpExceptionFilter())

  // cors
  if(process.env.NODE_ENV !== 'production') {
    app.enableCors({
      origin: ['https://host주소'],
      credentials: true,
    })
  } else {
    app.enableCors({
      origin: true,
      credentials: true,
    })
  }

  //image static
  app.useStaticAssets(path.join(__dirname, '..', 'uploads'), {
    prefix: '/uploads' 
  })

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

  /**
   * Passport아래와 같이 initalize(), session() 호출해야 정상적으로 세션에 반영한다.
   * 만약 JWT토큰으로 session을 사용하지 않는 경우 passport.session()사용 안해도 문제는 없음
   */
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
