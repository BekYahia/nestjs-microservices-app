import { IsEmail, IsOptional, IsString, IsStrongPassword } from "class-validator";

export class UpdateUserDto {
	@IsOptional()
	@IsString()
	name?: string

	@IsOptional()
	@IsEmail()
	email: string;

	@IsOptional()
	@IsStrongPassword()
	password: string;

	@IsOptional()
	@IsString()
	role: string;
}