import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import passport from 'passport';
import session from 'express-session';
import { AppModule } from './../src/app.module';
   
/**
 * e2e 테스트는 소스 코드와는 무관하다.
 * 소스코드를 테스트하기 보다는 요청에 대한 응답(결과)을 테스트 하는것임.
 * 
 * 대신 실제 DB에 요청하니 테스트용 DB를 생성하고 진행하는걸 추천.
 * DB연결하는 부분에
 * database: process.env.NODE_ENV === 'TEST' ? TEST_DB : process.env.database 이런식으로 써주는게 좋겠지?
 *  
 */
describe('AppController (e2e)', () => {
  let app: INestApplication;

  // let request = new supertest.
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    
    app = moduleFixture.createNestApplication();
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
      await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('mslee');
  });

  it('/users/login (POST)', () => {
    return request(app.getHttpServer())
      .post('/api/users/login')
      .send({
        email: "e2e@mail.com",
        password: "1234"
      })
      .expect(201)
  });
});

