import hash from 'hash-sum'
import { parse, type SFCDescriptor } from '@vue/compiler-sfc'
import LRUCache from 'lru-cache'

const cache = new LRUCache({ max: 100 })

export default function parseVue(source: string): SFCDescriptor {
	const cacheKey = hash(source)
	// source-map cache busting for hot-reloaded modules
	const output = (cache as LRUCache<string, SFCDescriptor>).get(cacheKey)
	if (output) {
		return output
	}

	const { descriptor } = parse(source)
	cache.set(cacheKey, descriptor)
	return descriptor
}
