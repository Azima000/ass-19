
import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './module/auth/auth.module.js';
import { UserModule } from './module/user/user.module.js';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './common/service/Redis Service/redis.module.js';
import { MongooseModule } from '@nestjs/mongoose';
import { env } from './configuration/env.service.js';

@Module({
    controllers: [AppController],

    providers: [AppService],

    imports: [
        ConfigModule.forRoot({
            envFilePath: ['.env.dev', '.env.prod'],
            isGlobal: true,
        }),
        MongooseModule.forRoot(
            env.databaseURL
        ),

        AuthModule,
        UserModule,
        RedisModule,
    ],
})
export class AppModule { }
