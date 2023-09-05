import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export const GetUser = createParamDecorator(
	(data: string | unknown, ctx: ExecutionContext) => {
		
		//actions depends on the protocol
		if(ctx.getType() === 'http') {
			const request: Express.Request = ctx.switchToHttp().getRequest()

			if(typeof data === 'string') return request.user[data] //So you can select from user obj, ex. @GetUser('email')
			return request.user
		}
	}
)