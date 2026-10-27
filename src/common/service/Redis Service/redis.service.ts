import { createClient } from "@redis/client";
import { RedisClientType } from "redis";
import { Types } from "mongoose";
import { env } from "../../../configuration/env.service.js";
import { Injectable } from "@nestjs/common";

@Injectable()
export class RedisService {

    private client: RedisClientType;

    constructor() {

        this.client = createClient({
            url: env.redisURL as string
        });

        this.handleConnection();
    }

    handleConnection() {

        this.client.on("error", (error) => {
            console.log("redis connection error", error);
        });

        this.client.on("ready", () => {
            console.log("redis connected successfully");
        });
    }

    async connect() {
        await this.client.connect();
    }

    async set({
        key,
        value,
        ttl
    }: {
        key: string;
        value: any;
        ttl?: number;
    }) {

        if (typeof value === "object") {
            value = JSON.stringify(value);
        }

        if (ttl) {

            return await this.client.set(
                key,
                value,
                { EX: ttl }
            );

        } else {

            return await this.client.set(
                key,
                value
            );

        }
    }

    async get(key: string) {
        return await this.client.get(key);
    }

    async ttl(key: string) {
        return await this.client.ttl(key);
    }

    async exists(key: string) {
        return await this.client.exists(key);
    }

    async redis_delete(key: string) {
        return await this.client.del(key);
    }

    async mGet(...keys: string[]) {
        return await this.client.mGet(keys);
    }

    key(userId: Types.ObjectId) {
        return `user:sockets:${userId}`;
    }

    async addSocket(userId: Types.ObjectId, socketId: string) {
        return await this.client.sAdd(
            this.key(userId),
            socketId
        );
    }

    async removeSocket(userId: Types.ObjectId, socketId: string) {
        return await this.client.sRem(
            this.key(userId),
            socketId
        );
    }

    async getSockets(userId: Types.ObjectId) {
        return await this.client.sMembers(
            this.key(userId)
        );
    }

    async hasSockets(userId: Types.ObjectId) {
        return await this.client.sCard(
            this.key(userId))
    }

    async removeUser(userId: Types.ObjectId) {
        return await this.client.del(
            this.key(userId))
    }

    // sRem  → يحذف عنصر من Set
    // del   → يحذف الـ Key كله
    // sCard → يعد العناصر
    // sMembers → يجيب العناصر كلها
    // sAdd → يضيف عنصر

    createRevokeToken({
        userId,
        token
    }: {
        userId: any;
        token: string;
    }): string {

        return `revokeToken:${userId}:${token}`;
    }
}

export const redis = new RedisService();