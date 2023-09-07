import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsOptional, IsString, IsStrongPassword } from "class-validator";
@InputType()
export class UpdateUserDto {
	@IsOptional()
	@IsString()
	@Field({ nullable: true })
	name?: string

	@IsOptional()
	@IsEmail()
	@Field({ nullable: true })
	email: string;

	@IsOptional()
	@IsStrongPassword()
	password: string;

	@IsOptional()
	@IsString()
	@Field({ nullable: true })
	role?: string;
}