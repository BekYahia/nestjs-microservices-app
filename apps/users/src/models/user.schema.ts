import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { AbstractDocument } from "@app/common";

@Schema({ versionKey: false, timestamps: true })
export class UserDocument extends AbstractDocument {
	@Prop()
	name?: string;

	@Prop()
	email: string;

	@Prop()
	password: string;

	@Prop()
	role?: string;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument)