import { ForbiddenException, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { UsersService } from "../users.service";
import { LoginDto } from "../dto/login.dto";
import { UserDto, stripPassword } from "@app/common";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
	constructor(private readonly userService: UsersService) {
		/** 
		 * By default Nestjs uses username and password to validate
		 * They can be overridden with usernameField, passwordField
		 */
		super({ usernameField: 'email' })
	}

	async validate(email: string, password: string) {
		const user = await this.userService.verifyUser({email, password})
		return stripPassword(user)
	}
}