import { NestFactory } from '@nestjs/core';
import { UsersModule } from './users.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(UsersModule);
  const config = app.get(ConfigService)

  //validation
  app.useGlobalPipes(new ValidationPipe({
	whitelist: true,
  }))

  //logger
  app.useLogger(app.get(Logger))

  //boot up
  await app.listen(config.getOrThrow<string>('PORT'));
}
bootstrap();
