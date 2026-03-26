import { defineConfig } from '@ivaninvladimir/vue-stylebook-engine'

declare const plugin: {
	(api: any, options: any): void
	defineConfig: typeof defineConfig
}

export = plugin
