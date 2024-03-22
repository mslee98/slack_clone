import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { Channelchats } from './src/entities/Channelchats';
import { Channelmembers } from './src/entities/Channelmembers';
import { Channels } from './src/entities/Channels';
import { Dms } from './src/entities/Dms';
import { Mentions } from './src/entities/Mentions';
import { Users } from './src/entities/Users';
import { Workspacemembers } from './src/entities/Workspacemembers';
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
    Channelchats,
    Channelmembers,
    Channels,
    Dms,
    Mentions,
    Users,
    Workspacemembers,
    Workspaces,
  ],
  migrations: [__dirname + '/migrations/*.ts'],
  synchronize: false,
  logging: true,
});

export default dataSource;