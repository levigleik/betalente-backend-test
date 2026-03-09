import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "transactions";

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments("id");

			table
				.integer("client_id")
				.unsigned()
				.notNullable()
				.references("id")
				.inTable("clients")
				.onDelete("CASCADE");

			table
				.integer("gateway_id")
				.unsigned()
				.nullable()
				.references("id")
				.inTable("gateways")
				.onDelete("SET NULL");

			table.string("external_id", 255).nullable();
			table.string("status", 50).notNullable().defaultTo("pending");
			table.integer("amount").notNullable(); // centavos
			table.string("card_last_numbers", 4).notNullable();

			table.timestamp("created_at");
			table.timestamp("updated_at");

			table.index(["client_id"]);
			table.index(["gateway_id"]);
			table.index(["status"]);
		});
	}

	async down() {
		this.schema.dropTable(this.tableName);
	}
}
