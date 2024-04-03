import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ChannelMembers } from '../entities/ChannelMembers';
import { Users } from '../entities/Users';
import { WorkspaceMembers } from '../entities/WorkspaceMembers';
import { UsersService } from './users.service';
import { Connection, DataSource } from 'typeorm';

// Mock은 class로 생성해도 되고 함수로 생성해도 문제는 없음
// 대신 함수로 작성했다면 useClass => useFactory로 변경해줘야한다.
// 대시 일반값으로 작성했다면 useValue로 쓴다던가 주의하셈
class MockUserRepository {
  #data = [
    {id:1, email: 'lms980321@kakao.com'}
  ];
  
  findOne({where: {email}}) {
    const data = this.#data.find((v) => v.email === email);
    if (data) {
      return data;
    }
    return null;
  }
};
class MockWorkspaceMembersRepository {};
class MockChannelMembersRepository {};

/**
 * Nest.js에서 제공하는 *.spec.ts는 보통 유닛 테스틀를 위함
 * E2E테스트는 Test 디렉토리있으니 그 쪽에서 진행하면 됨
 */
describe('UsersService', () => {
  let service: UsersService;


  /**
   * beforeEach는 각각의 it 전에 실행된다.
   * service를 새로 할당
   * 
   * beforEach이나 it 이런것들은 Jest가 지원함
   * 
   */
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      // 실 UsersService를 가지고 오기 때문에 의존성 주입도 해줘야지 에러가 안남.
      providers: [UsersService, // => 이거는 축약형 원래는 아래처럼 적어줘야한다. {provide: UsersService, useClass: UsersService},
        
        // 실제 DB를 쓰지않고 Mocking된 가짜 DB를 사용하기 위한 방법이다.
        {
          provide: getRepositoryToken(Users),
          useClass: MockUserRepository //process.env.NODE_ENV = 'production' ? UsersRepository: MockUserRepository,이런식으로 배포 환경에서는 실 데이터를 가지고 테스트를 할 수 있다.
        },
        {
          provide: getRepositoryToken(WorkspaceMembers),
          useClass: MockWorkspaceMembersRepository,
        },
        {
          provide: getRepositoryToken(ChannelMembers),
          useClass: MockChannelMembersRepository,
        },
        {
          provide: DataSource,
          useClass: class sss {},
        }
      ],

    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  /**
   * toBe는 실행한 서비스 값과 대조해서 나와야 할 값들을 적어준다
   * service.findByEmail('lms980321@kakao.com')
   */
  it('findByEmial은 이메일을 통해 유저를 찾아야 함', () => {
    // 보면 findByEmail은 async/await로 Promise객체가 반환됨, 그러면 resolves붙여줘야 문제가 없음
    //객체끼리 비교할 땐  toBe가 아니라 toStrictEqual사용하라고함
    expect(service.findByEmail('lms980321@kakao.com')).resolves.toStrictEqual({
      email: 'lms980321@kakao.com',
      id: 1,
    });
  });

  // 나중에 해야할 테스트들은 todo()를 붙여줌
  // it.todo('findByEmail은 유저를 못 찾으면 null을 반환해야 함', () => {
  //   expect(service.findByEmail('lms9803211@kakao.com')).toBe(null)
  // })
  
  //아래는 오타가 있다면 null을 반환하는 테스트
  it('findByEmail은 유저를 못 찾으면 null을 반환해야 함', () => {
    expect(service.findByEmail('lms9803211@kakao.com')).resolves.toStrictEqual(null)
  })
});
