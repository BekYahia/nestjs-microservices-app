import { AbstractRepository } from "@app/common";
import { Injectable } from "@nestjs/common";
import { UserDocument } from "./models/user.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class UserRepository extends AbstractRepository<UserDocument> {
	
	constructor(
		@InjectModel(UserDocument.name) userModel: Model<UserDocument>,
	) {
		super(userModel)
	}
}