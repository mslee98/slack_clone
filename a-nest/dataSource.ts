import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { ChannelChats } from './src/entities/Channelchats';
import { ChannelMembers } from './src/entities/Channelmembers';
import { Channels } from './src/entities/Channels';
import { DMs } from './src/entities/Dms';
import { Mentions } from './src/entities/Mentions';
import { Users } from './src/entities/Users';
import { WorkspaceMembers } from './src/entities/Workspacemembers';
import { Workspaces } from './src/entities/Workspaces';
//import { DataSource } from 'typeorm/data-source';

dotenv.config();

const dataSource = new DataSource({
  type: 'mysql',
  host: '127.0.0.1',
  port: 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [
    ChannelChats,
    ChannelMembers,
    Channels,
    DMs,
    Mentions,
    Users,
    WorkspaceMembers,
    Workspaces,
  ],
  migrations: [__dirname + '/migrations/*.ts'],
  //migrationsRun: true, 
  synchronize: false,
  logging: true,
});

export default dataSource;