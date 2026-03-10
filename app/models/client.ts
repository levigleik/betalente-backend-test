import { ClientSchema } from "#database/schema";
import type { HasMany } from "@adonisjs/lucid/types/relations";
import Transaction from "./transaction.ts";
import { hasMany } from "@adonisjs/lucid/orm";

export default class Client extends ClientSchema {
	@hasMany(() => Transaction)
	declare transactions: HasMany<typeof Transaction>;
}
