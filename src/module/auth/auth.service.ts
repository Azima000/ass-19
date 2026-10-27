import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RedisService } from '../../common/service/Redis Service/redis.service.js';
import { TokenService } from '../../common/service/Token Service/token.service.js';
import { User } from '../../database/model/model.user.js';
import { IUser } from '../../common/interfaces/user.interface.js';
import { compareHash, generateHash } from '../../common/security/security.js';
import { Send_Email } from '../../common/email/sendemail.js';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<IUser>,
        private readonly tokenService: TokenService,
        private readonly redisService: RedisService,
    ) { }
    //////////////////////////////////////////////////////////////////////////////////////////////
    async login(body: any) {

        let { password, email } = body
        let userData = await this.userModel.findOne({ email })
        if (!userData) {
            throw new NotFoundException("email not found")
        }

        let matchPassword = await compareHash({ password, hashedPassword: userData.password })
        if (!matchPassword) {
            throw new BadRequestException("invalid password")
        }

        let { accessToken, refreshToken } = await this.tokenService.generateToken({ userData });
        return { message: 'user login', accessToken, refreshToken };
    }
    //////////////////////////////////////////////////////////////////////////////////////////////
    async signup(data: any) {
        let { name, email, password, phone } = data;

        // 1. التأكد هل الإيميل مسجل مسبقاً مع الانتظار
        const existsUser = await this.userModel.findOne({ email });
        if (existsUser) {
            throw new ConflictException("User Already Exist");
        }

        // 2. تشفير كلمة المرور
        const hashedPassword = await generateHash({ password });
        if (!hashedPassword) {
            throw new BadRequestException("Invalid Password");
        }

        // 3. توليد كود الـ OTP
        const otp = Math.floor(1000 + Math.random() * 9000);

        // 4. الحفظ الفعلي وانتظار النتيجة لتعود بالبيانات كاملة
        const user = await this.userModel.create({
            name,
            phone,
            email,
            password: hashedPassword,
            provider: 'System', // تلافي أي مشكلة لو مش مبعوثة من الـ DTO
            // لو محتاج تخزن الـ otp في الداتابيز للمستخدم، ممكن تضيف حقل ليه في الـ Schema وتضيفه هنا
        });

        console.log(user);

        // 5. إرسال الإيميل للمستخدم بكود الـ OTP
        try {
            await Send_Email({
                to: email,
                subject: 'Verify Your Email - E-commerce App',
                html: `<h2>Welcome to our store, ${name}!</h2><p>Your verification OTP code is: <b>${otp}</b></p>`
            });
        } catch (error) {
            console.log("Error sending email:", error);
            // ممكن ترمي إيرور أو تكمل عادي حسب رغبتك لو الإيميل فشل
        }
        await this.redisService.set({
            key: `otp::${user._id}`,
            value: otp,
            ttl: 60,
        });

        return { message: "user added successfully, please check your email for OTP", user };
    }
    ////////////////////////////////////////////////////////////////////////////
    async verify(body: any) {
        let { email, otp } = body;
        let userData = await this.userModel.findOne({ email });

        if (!userData) {
            throw new NotFoundException('email not found');
        }

        let redisOtp = await this.redisService.get(`otp::${userData._id}`);
        if (redisOtp != otp) {
            throw new BadRequestException('invalid otp');
        }

        userData.isVerified = true;
        await userData.save();

        return { message: "user verified successfully" };
    }
}