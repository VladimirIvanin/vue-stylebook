const rootFolder = process.cwd().replace(/\\/g, '/')

expect.addSnapshotSerializer({
	serialize(val) {
		return val.replace(/\\/g, '/').replaceAll(rootFolder, '')
	},
	test(val) {
		return typeof val === 'string' && val.replace(/\\/g, '/').includes(rootFolder)
	}
})
