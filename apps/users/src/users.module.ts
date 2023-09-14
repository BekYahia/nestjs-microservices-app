import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule, LoggerModule } from '@app/common';
import { UserDocument, UserSchema } from './models/user.schema';
import { UserRepository } from './users.repository';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies';
import { JwtStrategy } from './strategies';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { UsersResolver } from './users.resolver';
import { GatewayMiddleware } from './middlewares';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

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
	GraphQLModule.forRoot<ApolloFederationDriverConfig>({
		driver: ApolloFederationDriver,
		autoSchemaFile: {	//auto generate the schema on-the-fly in memory
			federation: 2,
		},
	}),
	PrometheusModule.register(),
  ],
  controllers: [UsersController],
  providers: [UsersService, UserRepository, LocalStrategy, JwtStrategy, UsersResolver],
})

export class UsersModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(GatewayMiddleware).forRoutes('/graphql')
	}
}
