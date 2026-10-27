import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';

import { map } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {

    console.log("before login");
    const now = Date.now()
    return next.handle().pipe(
      map((data) => {
        console.log("after login");
        return {
          data,
          statusCode: 201, 
          request_Time: Date.now() - now
          
        }

      })
    )

  }
}
