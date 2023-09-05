import { Prop, Schema } from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";

//Since all documents have _id, its better to abstract it
@Schema()
export class AbstractDocument {
	@Prop({ type: SchemaTypes.ObjectId })
	_id: Types.ObjectId
}