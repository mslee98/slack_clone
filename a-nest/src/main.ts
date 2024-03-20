import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;

  /** SwaggerUI 연동 */
  const config = new DocumentBuilder()
    .setTitle('Sleact API')
    .setDescription('Sleact 개발을 위한 문서입니다.')
    .setVersion('1.0')
    .addCookieAuth('connect.sid')
    .build()
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
    
  //app.use(cookieParser());
  // app.use(
  //   session({
  //     resave: false,
  //     saveUnitInitialized: false,
  //     secret: process.env.COOKIE_SECRET
  //   })
  // )

  await app.listen(3000);
  console.log(`Listen on PORT : ${port}`);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

}



bootstrap();
