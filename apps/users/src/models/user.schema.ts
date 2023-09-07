import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { AbstractDocument } from "@app/common";
import { Field, ObjectType } from "@nestjs/graphql";

@Schema({ versionKey: false, timestamps: true })
@ObjectType()
export class UserDocument extends AbstractDocument {
	
	@Prop()
	@Field({ nullable: true })
	name?: string;

	@Prop()
	@Field()
	email: string;

	@Prop()
	password: string;

	@Prop()
	@Field({ nullable: true })
	role?: string;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument)