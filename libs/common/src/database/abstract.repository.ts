import { FilterQuery, Model, Types, UpdateQuery } from "mongoose";
import { AbstractDocument } from "./abstract.schema";
import { Logger } from "nestjs-pino";
import { NotFoundException } from "@nestjs/common";


export abstract class AbstractRepository<TDocument extends AbstractDocument> {

	constructor(protected readonly model: Model<TDocument>) {}

	async create(document: Omit<TDocument, "_id">) { //omit _id since its created locally
		const createDocument = new this.model({
			_id: new Types.ObjectId(),
			...document
		})
		return await createDocument.save()
	}

	async findAll(filterQuery: FilterQuery<TDocument>) {
		return await this.model.find(filterQuery, {}, {lean: true})
	}

	async findOne(filterQuery: FilterQuery<TDocument>, throwException = true) {
		const document = await this.model.findOne(filterQuery, {}, { lean: true })
		if(!document && throwException) throw new NotFoundException()
		return document
	}

	async update(filterQuery: FilterQuery<TDocument>, updateQuery: UpdateQuery<TDocument>, throwException = true) {
		const document = await this.model.findOneAndUpdate(filterQuery, updateQuery, {lean: true, new: true})
		if(!document && throwException) throw new NotFoundException()
		return document
	}

	async delete(filterQuery: FilterQuery<TDocument>,  throwException = true) {
		const document = await this.model.findByIdAndDelete(filterQuery, {lean: true })
		if(!document && throwException) throw new NotFoundException()
		return document
	}

}