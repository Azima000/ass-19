import { NestFactory } from '@nestjs/core';
import { AppModule, } from './app.module.js';
import { env } from 'process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {

  });
  const port =env.Port
  await app.listen(process.env.PORT ?? 3000, () => {
    console.log(`server is running on port ${port}`);

  });
}
await bootstrap();
