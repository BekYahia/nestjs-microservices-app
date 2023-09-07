import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from "../users.service";
import { ConfigService } from "@nestjs/config";
import { JwtStrategyPayload } from "../interfaces";
import { stripPassword } from "@app/common";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor(
		configService: ConfigService,
		private readonly userService: UsersService,
	) {
		super({
			/**
			 * on http, the auth header is added to headers, unlike other protocols
			 *  auth is added directly to the the request.
			 */
			jwtFromRequest: ExtractJwt.fromExtractors([
				request => {
					return (request.headers || request)?.['authorization']?.split(' ')[1]
				}
			]),
			secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
		})
	}

	async validate(payload: JwtStrategyPayload) { //The Payload you pass @JWT signing
		const user = await this.userService.findOne({ _id: payload._id })
		return stripPassword(user)
	}
}