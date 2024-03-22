import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Workspaces } from "./Workspaces";
import { Users } from "./Users";

@Index("UserId", ["userId"], {})
@Entity("workspacemembers", { schema: "sleact" })
export class Workspacemembers {
  @Column("datetime", { name: "loggedInAt", nullable: true })
  loggedInAt: Date | null;

  @Column("datetime", { name: "createdAt" })
  createdAt: Date;

  @Column("datetime", { name: "updatedAt" })
  updatedAt: Date;

  @Column("int", { primary: true, name: "WorkspaceId" })
  workspaceId: number;

  @Column("int", { primary: true, name: "UserId" })
  userId: number;

  @ManyToOne(() => Workspaces, (workspaces) => workspaces.workspacemembers, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "WorkspaceId", referencedColumnName: "id" }])
  workspace: Workspaces;

  @ManyToOne(() => Users, (users) => users.workspacemembers, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "UserId", referencedColumnName: "id" }])
  user: Users;
}
