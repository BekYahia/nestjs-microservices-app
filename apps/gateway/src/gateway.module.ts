import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from '@app/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { IntrospectAndCompose, RemoteGraphQLDataSource } from '@apollo/gateway'

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
				// context: //attach this func to every req to the downstream service 
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
					return new RemoteGraphQLDataSource({
						url,
						willSendRequest({ request, context }) { //set the response you get from authContext as header prop
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
  ],
  controllers: [],
  providers: [],
})
export class GatewayModule {}
