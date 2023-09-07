import { NestFactory } from '@nestjs/core';
import { UsersModule } from './users.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { USERS_QUEUE } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(UsersModule);
  const config = app.get(ConfigService)

  app.connectMicroservice<MicroserviceOptions>({
	transport: Transport.RMQ,
	options: {
		urls: [
			config.getOrThrow<string>('RABBITMQ_URL'),
		],
		queue: USERS_QUEUE,
	},
  });

  //validation
  app.useGlobalPipes(new ValidationPipe({
	whitelist: true,
  }))

  //logger
  app.useLogger(app.get(Logger))

  //boot up
  await app.startAllMicroservices()
  await app.listen(config.getOrThrow<string>('PORT'));
}
bootstrap();
