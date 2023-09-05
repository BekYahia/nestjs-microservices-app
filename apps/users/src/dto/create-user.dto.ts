import { IsEmail, IsNotEmpty, IsOptional, IsString, IsStrongPassword } from "class-validator";

export class CreateUserDto {
	@IsOptional()
	@IsString()
	name?: string

	@IsEmail()
	email: string;

	@IsStrongPassword()
	password: string;

	@IsOptional()
	@IsString()
	role?: string;
}