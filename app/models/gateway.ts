import { GatewaySchema } from "#database/schema";
import { hasMany } from "@adonisjs/lucid/orm";
import Transaction from "./transaction.ts";
import type { HasMany } from "@adonisjs/lucid/types/relations";

export default class Gateway extends GatewaySchema {
	@hasMany(() => Transaction)
	declare transactions: HasMany<typeof Transaction>;
}
