import { Field, ObjectType } from "@nestjs/graphql";
import { Prop, Schema } from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";

//Since all documents have _id, its better to abstract it
@Schema()
@ObjectType({ isAbstract: true })
export class AbstractDocument {
	@Field(() => String)
	@Prop({ type: SchemaTypes.ObjectId })
	_id: Types.ObjectId
}