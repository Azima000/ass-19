import { Body, Controller, Get, HttpCode, HttpStatus, Post, Put, UnsupportedMediaTypeException, UploadedFile, UseGuards, UseInterceptors, } from '@nestjs/common'
import { AuthService } from './auth.service.js';
import { CustomValidationPipe } from '../../pipe/validation.pipe.js';
import { LoggingInterceptor } from '../../logging/logging.interceptor.js';
import { registerSchema } from './auth.validation.js';
import { AuthGuardGuard } from '../../common/guard/auth-guard/auth-guard.guard.js';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('auth')
@UseInterceptors(LoggingInterceptor)
export class AuthController {
    constructor(
        private readonly authservice: AuthService,
    ) { }

   
    @HttpCode(HttpStatus.OK)
    @Get('/login')
    login(@Body() body:any) {
        let data= this.authservice.login(body);
        return data
    }
    ////////////////////////////////////////////////////////////////////////////
    // Register: لا يحتاج Token مسبقًا
    @HttpCode(HttpStatus.CREATED)
    @Post('/register')

    @UseInterceptors(
        FileInterceptor('Image', {
            dest: './Uploads',
            fileFilter: (rea, file, callback) => {
                if (!file.mimetype.match(/^Image\/(jpeg|png)$/)) {
                    return callback(
                        new UnsupportedMediaTypeException('only png and jpeg accepted'),
                        false,
                    );
                }
                callback(null, true)
            },
            limits: {

                fieldSize: 5 * 1024 * 1024
            }
        }),
    )
    singup(
        @UploadedFile() file: any,
        @Body(new CustomValidationPipe(registerSchema)) body: any,
    ) {
        // console.log(file);

        return this.authservice.signup(body);
    }
    ////////////////////////////////////////////////////////////////////////////

    // مثال على Route محمية تحتاج Token
    @Get('/profile')
    @UseGuards(AuthGuardGuard)
    getProfile() {
        return 'Authenticated successfully';
    }
    ////////////////////////////////////////////////////////////////////////////
@Put('/verify')
    async verify(@Body() body: any) {
        let data = await this.authservice.verify(body);
        return { message: "Success", data };
    }
}
