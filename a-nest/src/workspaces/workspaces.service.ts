import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelMembers } from 'src/entities/ChannelMembers';
import { Channels } from 'src/entities/Channels';
import { Users } from 'src/entities/Users';
import { WorkspaceMembers } from 'src/entities/WorkspaceMembers';
import { Workspaces } from 'src/entities/Workspaces';
import { Repository, DataSource } from 'typeorm';

@Injectable()
export class WorkspacesService {
    constructor(
        @InjectRepository(Workspaces) 
        private workspacesRepository: Repository<Workspaces>,

        @InjectRepository(WorkspaceMembers)
        private workspaceMembersRepository: Repository<WorkspaceMembers>,

        @InjectRepository(ChannelMembers)
        private channelMembersRepository: Repository<ChannelMembers>,

        @InjectRepository(Channels)
        private channelsRepository: Repository<Channels>,

        @InjectRepository(Users)
        private usersRepository: Repository<Users>,

        private dataSource: DataSource
    ) {}
    
    async findById(id: number) {
        
        // MySQL Offset/Limit 문법은 TypeORM에서 skip / take이다.
        // return this.workspacesRepository.find({where: {id}, take: 1}) 이런식으로 사용할수도 있고
        // findOne은 take: 1 포함되어있다고 생각하면 된다.
        // 
        return this.workspacesRepository.findByIds([id]);
    }

    async findByWorkspaces(myId: number) {
        return this.workspacesRepository.find({
            where: {
                WorkspaceMembers: [{ UserId: myId }]
            }
        })
    }

    async createWorkspace(name: string, url: string, myId: number) {
        
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {

            const workspace = this.workspacesRepository.create({
                name,
                url,
                OwnerId: myId,
            })
            const returned = await queryRunner.manager.getRepository(Workspaces).save(workspace);
            
            const workspaceMembers = this.workspaceMembersRepository.create({
                UserId: myId,
                WorkspaceId: returned.id,
            })

            const workspaceMembersReturned = await queryRunner.manager.getRepository(WorkspaceMembers).save(workspaceMembers)

            /** 시스템 구조상 workspace는 우선적으로 생성되야하는게 맞지만
             *  ChannelMembers와 Channel은 굳이 순차적일 필요가 없음 동시 작업해도 문제가 안생긴다는 소리!
             * 그럴때는 너무 await신경쓰지말고 PromiseAll로 접근해도 좋을듯 그래도 병렬처리니까 순서는 존재하지않나? 싱글 스레드 한계인가?
             * 검색해보면 Promise.all은 여러개의 Promise들을 동시에 처리한다고 나와있긴한데 뭐 크게보면 동시적이고 상세하게 보면 병렬적이니 관점에 따라 다른
             */
            const channel = this.channelsRepository.create({
                name: '일반',
                WorkspaceId: returned.id
            })

            // ","를 적어주며 queryRunner.manager.getRepository(WorkspaceMembers).save(workspaceMembers) 반환 값은 무시!
            // 뒤에 실행된 queryRunner.manager.getRepository(Channels).save(channel) 이 값만 사용  
            const [, channelReturned] = await Promise.all([
                queryRunner.manager.getRepository(WorkspaceMembers).save(workspaceMembers),
                queryRunner.manager.getRepository(Channels).save(channel)
            ])

            const channelMembers = this.channelMembersRepository.create({
                UserId: myId,
                ChannelId: channelReturned.id
            })

            await queryRunner.manager.getRepository(ChannelMembers).save(channelMembers);

            await queryRunner.commitTransaction();
        } catch(error) {
            console.log("@@@@@@@@@@@@에러 발생----롤백!!!@@@@@@@@@@@@@@@")
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }

    }

    /**
     * 
     * @QueryBuilder
     * 
     */
    async getWowkspaceMembers(url: string) {
        this.usersRepository
            .createQueryBuilder('user')
            // 위에 alias를 통해 아래 join문에서 user를 쓸 수 있는거임!
            // 대신 조인할거면 Entities에 관계를 다 설정해주어야 함
            // @OneToMany(
            //     () => WorkspaceMembers,
            //     (workspacemembers) => workspacemembers.User,
            //   )
            //   WorkspaceMembers: WorkspaceMembers[];
            // 이런식으로 정의했기 때문에 가능함
            // OneToMany형식으로 연결지어서 할거면 아래처럼 작성 하지만 ManyToMany면 하나만 적어도 상관없잖슴
            .innerJoin('user.WorkspaceMembers', 'members')
            .innerJoin(
                'members.Workspace', // 1, join할 컬럼 
                'workspace',         // 2. join alias 설정
                'w.url= :url',       // 3. 4번째 변수가 url로 들어가려면 4번째에 url변수 넣어줘야함 'w.url= ${url}' 이것도 가능한데 SQLInjection에 위험
                {url: url}           // 4. 이런식으로 변수를 선언해두면
            )
            // getRawMany() -> | ID | NAME | PASSWORD | Workspace.NAME | Workspace.URL | MySQL에서 Join문 결과를 그대로 가져다줌()
            // getMany() -> Workspacae를 객체로 인식해서 객체로 만들어줌
            // 단점으로는 getMany는 좀 느리긴 함 JS객체로 한번 더 가공해주기 떄문에 
            // 
            .getMany();
    }


}
