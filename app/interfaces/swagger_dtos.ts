import type { DateTime } from "luxon"

export interface AuthenticatedUserDto {
	id: number
	fullName?: string
	email: string
	createdAt: DateTime
	updatedAt?: DateTime
	initials: string
}

export interface AuthSuccessResponseDto {
	user: AuthenticatedUserDto
	token: string
}

export interface LogoutResponseDto {
	message: string
}

// ─── Entity DTOs ─────────────────────────────────────────────────────────────

export interface GatewayDto {
	id: number
	name: string
	isActive: boolean
	priority: number
	createdAt: string
	updatedAt: string
}

export interface ProductDto {
	id: number
	name: string
	amount: number
	createdAt: string
	updatedAt: string
}

export interface ClientDto {
	id: number
	name: string
	email: string
	createdAt: string
	updatedAt: string
}

export interface TransactionDto {
	id: number
	clientId: number
	gatewayId: number
	externalId: string
	status: string
	amount: number
	cardLastNumbers: string
	createdAt: string
	updatedAt: string
	client: ClientDto
	gateway: GatewayDto
}

export interface TransactionProductDto {
	id: number
	transactionId: number
	productId: number
	quantity: number
	createdAt: string
	updatedAt: string
	product: ProductDto
}

export interface TransactionDetailDto {
	id: number
	clientId: number
	gatewayId: number
	externalId: string
	status: string
	amount: number
	cardLastNumbers: string
	createdAt: string
	updatedAt: string
	client: ClientDto
	gateway: GatewayDto
	transactionProducts: TransactionProductDto[]
}

export interface ClientWithTransactionsDto {
	id: number
	name: string
	email: string
	createdAt: string
	updatedAt: string
	transactions: TransactionDto[]
}

// ─── Request DTOs ─────────────────────────────────────────────────────────────

export interface CreatePurchaseDto {
	name: string
	email: string
	amount: number
	cardNumber: string
	cvv: string
}

export interface CreateProductDto {
	name: string
	amount: number
}

export interface UpdateGatewayPriorityDto {
	priority: number
}

// ─── Response DTOs ────────────────────────────────────────────────────────────

export interface ClientListResponseDto {
	data: ClientDto[]
}

export interface ClientDetailResponseDto {
	data: ClientWithTransactionsDto
}

export interface TransactionListResponseDto {
	data: TransactionDto[]
}

export interface TransactionDetailResponseDto {
	data: TransactionDetailDto
}

export interface TransactionMessageDataResponseDto {
	message: string
	data: TransactionDto
}

export interface ProductListResponseDto {
	data: ProductDto[]
}

export interface ProductDetailResponseDto {
	data: ProductDto
}

export interface ProductMessageDataResponseDto {
	message: string
	data: ProductDto
}

export interface MessageResponseDto {
	message: string
}

export interface GatewayListResponseDto {
	data: GatewayDto[]
}

export interface GatewayMessageDataResponseDto {
	message: string
	data: GatewayDto
}

export interface PurchaseSuccessResponseDto {
	message: string
	data: TransactionDto
}
