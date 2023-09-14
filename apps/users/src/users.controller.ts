import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Res, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-use.dto';
import { FilterQuery } from 'mongoose';
import { JwtAuthGuard, LocalAuthGuard } from './guards';
import { GetUser, UserDto } from '@app/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import * as client from 'prom-client'
@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  	@UseGuards(JwtAuthGuard)
	@Get()
	findAll(@Query() query: FilterQuery<CreateUserDto>) {
		return this.usersService.findAll(query)
	}

	@Get('metrics')
	index(@Res({ passthrough: true }) response: any): Promise<string> {
		response.header("Content-Type", client.register.contentType);
		return client.register.metrics(); 
	}

	@UseGuards(JwtAuthGuard)
	@Get(':id')
	findOne(@Param('id') _id: string) {
		return this.usersService.findOne({_id})
	}

	@UseGuards(JwtAuthGuard)
	@Post()
	create(@Body() createUserDto: CreateUserDto) {
		return this.usersService.create(createUserDto)
	}

	@HttpCode(HttpStatus.OK)
	@UseGuards(LocalAuthGuard)
	@Post('login')
	async login(@GetUser() user: UserDto) {
		const access_token = await this.usersService.getJwtToken(user)
		return {user, access_token}
	}

	@UseGuards(JwtAuthGuard)
	@Patch(':id')
	update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
		return this.usersService.update(id, updateUserDto)
	}

	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	delete(@Param('id') id: string) {
		return this.usersService.delete(id)
	}
	
	@UseGuards(JwtAuthGuard)
	@MessagePattern('authenticate')
	authenticate(@Payload() { user }:{ user: UserDto }) {
		return user
	}
}
