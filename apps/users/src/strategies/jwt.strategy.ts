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
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
		})
	}

	async validate(payload: JwtStrategyPayload) { //The Payload you pass @JWT signing
		const user = await this.userService.findOne({ _id: payload._id })
		return stripPassword(user)
	}
}