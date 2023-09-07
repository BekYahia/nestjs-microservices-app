import { Field, ObjectType } from "@nestjs/graphql";
import { IsEmail, IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";
@ObjectType()
export class UserDto {
	@IsString()
	@Field(() => Types.ObjectId)
	_id: Types.ObjectId;

	@IsOptional()
	@IsString()
	name?: string;

	@IsEmail()
	email: string;

	@IsString()
	password: string;

	@IsOptional()
	@IsString()
	role?: string;
}