import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Channels } from "./Channels";
import { Users } from "./Users";

@Index("UserId", ["userId"], {})
@Entity("channelmembers", { schema: "sleact" })
export class Channelmembers {
  @Column("datetime", { name: "createdAt" })
  createdAt: Date;

  @Column("datetime", { name: "updatedAt" })
  updatedAt: Date;

  @Column("int", { primary: true, name: "ChannelId" })
  channelId: number;

  @Column("int", { primary: true, name: "UserId" })
  userId: number;

  @ManyToOne(() => Channels, (channels) => channels.channelmembers, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "ChannelId", referencedColumnName: "id" }])
  channel: Channels;

  @ManyToOne(() => Users, (users) => users.channelmembers, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "UserId", referencedColumnName: "id" }])
  user: Users;
}
