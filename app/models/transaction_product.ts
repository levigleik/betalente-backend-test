import { TransactionProductSchema } from "#database/schema";
import { belongsTo } from "@adonisjs/lucid/orm";
import type { BelongsTo } from "@adonisjs/lucid/types/relations";
import Product from "./product.ts";
import Transaction from "./transaction.ts";

export default class TransactionProduct extends TransactionProductSchema {
	@belongsTo(() => Transaction)
	declare transaction: BelongsTo<typeof Transaction>;

	@belongsTo(() => Product)
	declare product: BelongsTo<typeof Product>;
}
