import { UserDto } from "../dto"

export function stripPassword(user: UserDto) {
	const {password, ...rest} = user
	return rest
}