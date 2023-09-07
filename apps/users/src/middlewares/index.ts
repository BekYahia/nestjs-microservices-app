import { ForbiddenException, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class GatewayMiddleware implements NestMiddleware {
	
	/**
	 * Invalidate direct access to the users subgraph
	 *  @var req.header.user: you get it from the gateway microservice, see gateway.module 
	 */
	use(req: Request, res: Response, next: NextFunction) {
		if(!req.headers.user) return res.status(403).send(new ForbiddenException('use API Gateway instead'))
		next()
	}
}