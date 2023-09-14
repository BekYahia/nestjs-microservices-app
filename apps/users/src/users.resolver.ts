import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UserDocument } from "./models/user.schema";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginDto } from "./dto/login.dto";
import { LoginSchema } from "./models/login.graphql.schema";
import { UpdateUserDto } from "./dto/update-use.dto";

@Resolver(() => UserDocument)
export class UsersResolver { 
    constructor(private readonly userService: UsersService) {}

    @Query(() => [UserDocument], { name: 'users', nullable: 'items' })
    findAll() {
        return this.userService.findAll({})
    }

	@Query(() => UserDocument, { name: 'user' })
	findOne(@Args('id', { type: () => String }) _id: string) {
		return this.userService.findOne({_id})
	}
	
	@Query(() => LoginSchema)
	async login(@Args('loginInput') loginDto: LoginDto) {
		const user = await this.userService.verifyUser(loginDto)
		const access_token = await this.userService.getJwtToken(user)
		return { user, access_token }
	}

	@Mutation(() => UserDocument)
	createUser(@Args('createUserInput') createUserDto: CreateUserDto) {
		return this.userService.create(createUserDto)
	}

	@Mutation(() => UserDocument)
	updateUser(
		@Args('id', {type: () => String}) id: string,
		@Args('updateUserInput') updateUserDto: UpdateUserDto
	) {
		return this.userService.update(id, updateUserDto)
	}

	@Mutation(() => UserDocument)
	deleteUser(@Args('id', {type: () => String}) id: string) {
		return this.userService.delete(id)
	}

}