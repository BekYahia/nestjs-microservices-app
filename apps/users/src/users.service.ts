import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterQuery } from 'mongoose';
import { UserDocument } from './models/user.schema';
import { UpdateUserDto } from './dto/update-use.dto';
import { compare, hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';
import { UserDto } from '@app/common';

@Injectable()
export class UsersService {

	constructor(
		private readonly userRepo: UserRepository,
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
	) {}

	async create(createUserDto: CreateUserDto) : Promise<UserDocument> {

		const user = await this.userRepo.findOne({ email: createUserDto.email }, false)
		if(user) throw new BadRequestException()

		return this.userRepo.create({
			...createUserDto,
			password: await hash(createUserDto.password, 10)
		})
	}

	findOne(filterQuery: FilterQuery<UserDocument>): Promise<UserDocument> {
		return this.userRepo.findOne(filterQuery)
	}

	findAll(filterQuery: FilterQuery<UserDocument>) : Promise<UserDocument[]> {
		return this.userRepo.findAll(filterQuery)
	}

	async update(id: string, updateUserDto: UpdateUserDto) : Promise<UserDocument> {
		const isEmailTaken = await this.userRepo.findOne({ email: updateUserDto.email, $nor: [{ _id: id }] }, false)
		if(isEmailTaken) throw new BadRequestException()

		return this.userRepo.update({_id: id}, updateUserDto)
	}
	
	delete(id: string) : Promise<UserDocument> {
		return this.userRepo.delete({_id: id})
	}

	async verifyUser(loginDto: LoginDto) : Promise<UserDocument> {
		const user = await this.userRepo.findOne({ email: loginDto.email }, false)
		if(!user) throw new UnauthorizedException('invalid login')
		
		const isValidPass = await compare(loginDto.password, user?.password)
		if(!isValidPass) throw new UnauthorizedException('invalid login')

		return user
	}

	async getJwtToken(user: UserDto) {
		return await this.jwtService.signAsync(user)
	}
}
