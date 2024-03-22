import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import session from 'express-session';
declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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


console.log(process.env.DB_USERNAME+"@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
bootstrap();
