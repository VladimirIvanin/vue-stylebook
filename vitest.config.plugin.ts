import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		globals: true,
		include: ['**/__e2e__/**/*.js'],
		exclude: ['**/node_modules/**', '**/__e2e__/helpers.js'],
		testTimeout: 80000,
		fileParallelism: false,
		setupFiles: './test/setup.plugin.js'
	}
})
