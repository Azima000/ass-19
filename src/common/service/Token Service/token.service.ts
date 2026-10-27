
import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "../../../configuration/env.service.js";
import { BadRequestException, Injectable } from "@nestjs/common";


@Injectable()
export class TokenService {
    constructor() { }

    generateToken(user: any) {

        let signature: string;
        let audience: string;
        let refreshSignature: string;

        switch (user.role) {

            case 0:
                signature = env.jwtUserSecret;
                audience = "User";
                refreshSignature = env.userRefreshToken;
                break;

            default:
                signature = env.jwtAdminSecret;
                audience = "Admin";
                refreshSignature = env.adminRefreshToken;
                break;
        }

        const accessToken = jwt.sign(
            { id: user._id },
            signature,
            {
                audience,
                expiresIn: "30m"
            }
        );

        const refreshToken = jwt.sign(
            { id: user._id },
            refreshSignature,
            {
                audience,
                expiresIn: "1y"
            }
        );

        return { accessToken, refreshToken };
    }

    decodeToken(token: string) {

        const decoded = jwt.decode(token) as JwtPayload | null;

        if (!decoded || typeof decoded === "string") {
            throw new BadRequestException("Token not valid");
        }

        let signature: string;

        switch (decoded.aud) {

            case "Admin":
                signature = env.jwtAdminSecret;
                break;

            case "User":
                signature = env.jwtUserSecret;
                break;

            default:
                throw new BadRequestException("Invalid audience");
        }

        try {

            return jwt.verify(token, signature);

        } catch {

            throw new BadRequestException("Token not valid");
        }
    }

    decodeRefreshToken(refreshToken: string) {

        const decoded = jwt.decode(refreshToken) as JwtPayload | null;

        if (!decoded || typeof decoded === "string") {
            throw new BadRequestException("Refresh Token not valid");
        }

        let signature: string;

        switch (decoded.aud) {

            case "Admin":
                signature = env.adminRefreshToken;
                break;

            case "User":
                signature = env.userRefreshToken;
                break;

            default:
                throw new BadRequestException("Invalid audience");
        }

        try {

            return jwt.verify(refreshToken, signature);

        } catch {

            throw new BadRequestException("Refresh Token not valid");
        }
    }
}
