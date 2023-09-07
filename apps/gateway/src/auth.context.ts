import { UnauthorizedException } from "@nestjs/common"
import { app } from "./app"
import { ClientProxy } from "@nestjs/microservices"
import { USERS_SERVICE, UserDto } from "@app/common"
import { lastValueFrom } from "rxjs"

/**
 ** This function used to send a JWT token to users microservice for verifications.
 ** return a user object
**/
export const authContext = async ({ req }) => {
   
	try {

		const authClient = app.get<ClientProxy>(USERS_SERVICE)
		const user : UserDto = await lastValueFrom(
			authClient.send('authenticate', {authorization : req.headers?.authorization as string})
		);

		return {user} 

	} catch(err) {
		throw new UnauthorizedException('Invalid Token', err)
	}

}