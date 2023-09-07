import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsOptional, IsString, IsStrongPassword } from "class-validator";
@InputType()
export class CreateUserDto {
	@IsOptional()
	@IsString()
	@Field({ nullable: true })
	name?: string

	@IsEmail()
	@Field()
	email: string;

	@IsStrongPassword()
	@Field()
	password: string;

	@IsOptional()
	@IsString()
	@Field({ nullable: true })
	role?: string;
}