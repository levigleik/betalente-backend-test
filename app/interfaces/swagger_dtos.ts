import type { DateTime } from "luxon";

export interface AuthenticatedUserDto {
	id: number;
	fullName?: string;
	email: string;
	createdAt: DateTime;
	updatedAt?: DateTime;
	initials: string;
}

export interface AuthSuccessResponseDto {
	user: AuthenticatedUserDto;
	token: string;
}

export interface LogoutResponseDto {
	message: string;
}
