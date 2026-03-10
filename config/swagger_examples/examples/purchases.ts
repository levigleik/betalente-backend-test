import { transactionExample } from "./transactions.ts"

export const createPurchaseExample = {
	name: "tester",
	email: "tester@email.com",
	amount: 1000,
	cardNumber: "5569000000006063",
	cvv: "010",
}

export const purchaseSuccessExample = {
	message: "Pagamento realizado com sucesso",
	data: transactionExample,
}

export const purchaseFailExample = {
	message: "Não foi possível processar o pagamento",
}
