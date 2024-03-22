import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Channels } from "./Channels";
import { Dms } from "./Dms";
import { Mentions } from "./Mentions";
import { Workspacemembers } from "./Workspacemembers";
import { Users } from "./Users";

// @Index("name", ["name"], { unique: true })
// @Index("OwnerId", ["ownerId"], {})
// @Index("url", ["url"], { unique: true })
/**
 * 테이블 명 workspaces / DB명 sleact
 */
@Entity("workspaces", { schema: "sleact" })
export class Workspaces {
  /**
   * PK는 꼭 PrimaryGeneratedColumn 태그 사용
   */
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  /**
   * @Column("varchar", { name: "name", unique: true, length: 30 })
   * workspaceName: string; 
   * 이렇게 사용하면 JS/TS 상에서는 workspaceName으로 값을 기입해도 DB에 알아서 name으로 들어감
   * DB테이블명을 따라가는게 아니라 내 맘대로 바꿔서 사용이 가능
   */
  @Column("varchar", { name: "name", unique: true, length: 30 })
  name: string;

  @Column("varchar", { name: "url", unique: true, length: 30 })
  url: string;

  @Column("datetime", { name: "createdAt" })
  createdAt: Date;

  @Column("datetime", { name: "updatedAt" })
  updatedAt: Date;

  @Column("datetime", { name: "deletedAt", nullable: true })
  deletedAt: Date | null;

  @Column("int", { name: "OwnerId", nullable: true })
  ownerId: number | null;

  @OneToMany(() => Channels, (channels) => channels.workspace)
  channels: Channels[];

  @OneToMany(() => Dms, (dms) => dms.workspace)
  dms: Dms[];

  @OneToMany(() => Mentions, (mentions) => mentions.workspace)
  mentions: Mentions[];

  @OneToMany(
    () => Workspacemembers,
    (workspacemembers) => workspacemembers.workspace
  )
  workspacemembers: Workspacemembers[];

  @ManyToOne(() => Users, (users) => users.workspaces, {
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "OwnerId", referencedColumnName: "id" }])
  owner: Users;
}
