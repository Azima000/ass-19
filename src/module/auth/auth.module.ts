import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller.js";
import { TokenService } from "../../common/service/Token Service/token.service.js";
import { AuthService } from "./auth.service.js";
import { userModel } from "../../database/model/model.user.js";
import { RedisService } from "../../common/service/Redis Service/redis.service.js";



@Module({

    imports: [
        userModel
    ],

    controllers: [AuthController],
    providers : [AuthService,TokenService,RedisService],
})
export class AuthModule { }