import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule, USERS_QUEUE, USERS_SERVICE } from '@app/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { IntrospectAndCompose, RemoteGraphQLDataSource } from '@apollo/gateway'
import { ClientsModule, Transport } from '@nestjs/microservices';
import { authContext } from './auth.context';

@Module({
  imports: [
	ConfigModule.forRoot({
		isGlobal: true,
	}),
	LoggerModule,
	GraphQLModule.forRootAsync<ApolloGatewayDriverConfig>({
		driver: ApolloGatewayDriver,
		useFactory: (configService: ConfigService) => ({
			server: {
				/** 1)
				 * 	Attach this func to every req to the downstream service,
				 */
				context: authContext,
			},
			gateway: {
				supergraphSdl: new IntrospectAndCompose({
					subgraphs: [
						{
							name: 'users',
							url: configService.getOrThrow<string>('USERS_GRAPHQL_URL'),
						},
					],
				}),
				buildService({ url }) {
					/**	2)
					 *	After you get the user object using authContext
					 * 	set it as header props at every request to the subgraphs
					 * 	so, they can access via using req.header.user
					 */
					return new RemoteGraphQLDataSource({
						url,
						willSendRequest({ request, context }) {					
							request.http.headers.set(
								'user',
								context.user ? JSON.stringify(context.user) : null
							)
						}
					});
				},
			},
		}),
		inject: [ConfigService],
	}),
	ClientsModule.registerAsync([
		{
			name: USERS_SERVICE,
			useFactory: (configService: ConfigService) => ({
				transport: Transport.RMQ,
				options: {
					urls: [
						configService.getOrThrow<string>('RABBITMQ_URL'),
					],
					queue: USERS_QUEUE,
				},
			}),
			inject: [ConfigService],
		},
	]),
  ],
  controllers: [],
  providers: [],
})
export class GatewayModule {}
