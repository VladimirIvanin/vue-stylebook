import { defineConfig } from 'vitest/config'
import { typescriptPaths } from 'rollup-plugin-typescript-paths'

export default defineConfig({
	test: {
		environment: 'happy-dom',
		globals: true,
		setupFiles: './test/setup.ts',
		exclude: ['**/node_modules/**', '**/lib/**', '**/dist/**'],
		deps: {
			optimizer: {
				web: {
					enabled: true
				}
			}
		},
		coverage: {
			reporter: ['lcov'],
			include: ['packages/**/*'],
			exclude: [
				'**/node_modules/**',
				'**/lib/**',
				'**/dist/**',
				'**/*.{test,spec}.{ts,js,tsx,jsx}',
				'packages/vue-inbrowser-compiler-demi/**/*'
			]
		}
	},
	resolve: {
		alias: {
			util: 'node:util'
		}
	},
	plugins: [
		typescriptPaths({
			tsConfigPath: './tsconfig.json'
		})
	]
})
