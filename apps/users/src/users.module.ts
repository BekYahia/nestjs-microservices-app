import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule, LoggerModule } from '@app/common';
import { UserDocument, UserSchema } from './models/user.schema';
import { UserRepository } from './users.repository';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies';
import { JwtStrategy } from './strategies';

@Module({
  imports: [
	ConfigModule.forRoot({
		isGlobal: true,
	}),
	DatabaseModule,
	DatabaseModule.forFeature([
		{ name: UserDocument.name, schema: UserSchema },
	]),
	LoggerModule,
	JwtModule.registerAsync({
		useFactory: (configService: ConfigService) => ({
			secret: configService.getOrThrow<string>('JWT_SECRET'),
			signOptions: {
				expiresIn: configService.getOrThrow<string>('JWT_EXPIRES_IN'),
			}
		}),
		inject: [ConfigService],
	}),
  ],
  controllers: [UsersController],
  providers: [UsersService, UserRepository, LocalStrategy, JwtStrategy],
})
export class UsersModule {}
