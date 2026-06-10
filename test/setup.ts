const rootFolder = process.cwd()

expect.addSnapshotSerializer({
	serialize(val) {
		// `printer` is a function that serializes a value using existing plugins.
		return val.replaceAll(rootFolder, '')
	},
	test(val) {
		return typeof val === 'string' && val.includes(rootFolder)
	}
})
