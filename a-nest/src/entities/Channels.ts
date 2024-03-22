import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Channelchats } from "./Channelchats";
import { Channelmembers } from "./Channelmembers";
import { Workspaces } from "./Workspaces";

@Index("WorkspaceId", ["workspaceId"], {})
@Entity("channels", { schema: "sleact" })
export class Channels {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", length: 30 })
  name: string;

  @Column("tinyint", {
    name: "private",
    nullable: true,
    width: 1,
    default: () => "'0'",
  })
  private: boolean | null;

  @Column("datetime", { name: "createdAt" })
  createdAt: Date;

  @Column("datetime", { name: "updatedAt" })
  updatedAt: Date;

  @Column("int", { name: "WorkspaceId", nullable: true })
  workspaceId: number | null;

  @OneToMany(() => Channelchats, (channelchats) => channelchats.channel)
  channelchats: Channelchats[];

  @OneToMany(() => Channelmembers, (channelmembers) => channelmembers.channel)
  channelmembers: Channelmembers[];

  @ManyToOne(() => Workspaces, (workspaces) => workspaces.channels, {
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "WorkspaceId", referencedColumnName: "id" }])
  workspace: Workspaces;
}
