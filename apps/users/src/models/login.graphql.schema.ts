import { Field, ObjectType } from "@nestjs/graphql";
import { UserDocument } from "./user.schema";

@ObjectType()
export class LoginSchema {

	@Field(() => UserDocument)
	user: UserDocument;

	@Field()
	access_token: string;
} 