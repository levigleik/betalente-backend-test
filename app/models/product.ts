import { ProductSchema } from "#database/schema";

import { hasMany } from "@adonisjs/lucid/orm";
import type { HasMany } from "@adonisjs/lucid/types/relations";
import TransactionProduct from "./transaction_product.ts";

export default class Product extends ProductSchema {
	@hasMany(() => TransactionProduct)
	declare transactionProducts: HasMany<typeof TransactionProduct>;
}
