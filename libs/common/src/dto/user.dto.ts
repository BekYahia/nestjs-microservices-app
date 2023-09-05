import { IsEmail, IsOptional, IsString } from "class-validator";

export class UserDto {
	@IsOptional()
	@IsString()
	name?: string

	@IsEmail()
	email: string;

	@IsString()
	password: string;

	@IsOptional()
	@IsString()
	role?: string;
}