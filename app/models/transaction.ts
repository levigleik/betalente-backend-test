import { TransactionSchema } from "#database/schema";

import { belongsTo, hasMany } from "@adonisjs/lucid/orm";
import type { BelongsTo, HasMany } from "@adonisjs/lucid/types/relations";
import Client from "./client.ts";
import Gateway from "./gateway.ts";
import TransactionProduct from "./transaction_product.ts";

export default class Transaction extends TransactionSchema {
	@belongsTo(() => Client)
	declare client: BelongsTo<typeof Client>;

	@belongsTo(() => Gateway)
	declare gateway: BelongsTo<typeof Gateway>;

	@hasMany(() => TransactionProduct)
	declare transactionProducts: HasMany<typeof TransactionProduct>;
}
