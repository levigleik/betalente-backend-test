import { BaseCommand } from "@adonisjs/core/ace"
import type { CommandOptions } from "@adonisjs/core/types/ace"
import { generateSwaggerSpec, writeSwaggerSpec } from "#config/swagger_util"

export default class DocsGenerate extends BaseCommand {
	static commandName = "docs:generate"

	static options: CommandOptions = {
		startApp: false,
		allowUnknownFlags: false,
		staysAlive: false,
	}

	async run() {
		writeSwaggerSpec(generateSwaggerSpec())
	}
}
