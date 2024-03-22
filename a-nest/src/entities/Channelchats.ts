import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Channels } from "./Channels";
import { Users } from "./Users";

@Index("ChannelId", ["channelId"], {})
@Index("UserId", ["userId"], {})
@Entity("channelchats", { schema: "sleact" })
export class Channelchats {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("text", { name: "content" })
  content: string;

  @Column("datetime", { name: "createdAt" })
  createdAt: Date;

  @Column("datetime", { name: "updatedAt" })
  updatedAt: Date;

  @Column("int", { name: "ChannelId", nullable: true })
  channelId: number | null;

  @Column("int", { name: "UserId", nullable: true })
  userId: number | null;

  @ManyToOne(() => Channels, (channels) => channels.channelchats, {
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "ChannelId", referencedColumnName: "id" }])
  channel: Channels;

  @ManyToOne(() => Users, (users) => users.channelchats, {
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "UserId", referencedColumnName: "id" }])
  user: Users;
}
