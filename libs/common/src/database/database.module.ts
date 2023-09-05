import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ModelDefinition, MongooseModule } from "@nestjs/mongoose";

@Module({
	imports: [
		MongooseModule.forRootAsync({
			useFactory: (configService: ConfigService) => ({
				uri: configService.getOrThrow<string>('MONGODB_URI'),
			}),
			inject: [ConfigService],
		}),
	],
})

//Abstract Document, so every microservice implements its own Model schema
export class DatabaseModule {
	static forFeature(models: ModelDefinition[]) {
		return MongooseModule.forFeature(models)
	}
}