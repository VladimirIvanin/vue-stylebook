export const normalizeCode = (code: string | { raw?: string }) =>
	typeof code === 'string' ? code : code?.raw || ''
