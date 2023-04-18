import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { env } from './env';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });
  await app.listen(env.PORT);

  const logger = new Logger(AppModule.name);
  logger.log(`Server is running on ${await app.getUrl()}`);
}

bootstrap();
