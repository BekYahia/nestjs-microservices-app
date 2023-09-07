import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import { setApp } from './app';

async function bootstrap() {
	const app = await NestFactory.create(GatewayModule);
	const config = app.get(ConfigService)

	app.useLogger(app.get(Logger))
	await app.listen(config.getOrThrow<string>('PORT'));

	setApp(app)
}
bootstrap();
