import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "src/users/users.module";
import { AuthService } from "./auth.service";
import { LocalStrategy } from "./local.strategy";
import { LocalSerializer } from "./local.serializer";
import { Users } from "src/entities/Users";

@Module({
    imports: [
        PassportModule.register({session: true}),
        TypeOrmModule.forFeature([Users]),
        // UsersModule
    ],
    providers: [AuthService, LocalStrategy, LocalSerializer],
    exports: [AuthModule]
})

export class AuthModule {}