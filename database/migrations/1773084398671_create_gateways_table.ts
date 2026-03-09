import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "gateways";

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments("id");

			table.string("name", 100).notNullable().unique();
			table.boolean("is_active").notNullable().defaultTo(true);
			table.integer("priority").notNullable().defaultTo(1);

			table.timestamp("created_at");
			table.timestamp("updated_at");

			table.index(["is_active"]);
			table.index(["priority"]);
		});
	}

	async down() {
		this.schema.dropTable(this.tableName);
	}
}
