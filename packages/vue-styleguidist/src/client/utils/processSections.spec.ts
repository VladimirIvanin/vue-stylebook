import processSections from './processSections'

const getUrlMock = vi.fn(() => '/mock-url')

vi.mock('react-styleguidist/lib/client/utils/getUrl', () => ({
	default: (options: any) => getUrlMock(options)
}))

describe('processSections', () => {
	beforeEach(() => {
		getUrlMock.mockClear()
	})

	it('keeps legacy component links with ?id strategy by default', () => {
		processSections(
			{
				exampleFileNames: [],
				sections: [
					{
						name: 'Components',
						slug: 'components',
						sectionDepth: 0,
						sections: [],
						components: [
							{
								slug: 'button',
								props: {
									displayName: 'Button',
									examples: []
								}
							}
						]
					}
				] as any
			},
			{ useRouterLinks: true }
		)

		expect(getUrlMock.mock.calls[1][0]).toMatchObject({
			name: 'Button',
			useSlugAsIdParam: true
		})
	})

	it('uses dedicated component route when componentPagePerSection is enabled', () => {
		processSections(
			{
				exampleFileNames: [],
				sections: [
					{
						name: 'Components',
						slug: 'components',
						sectionDepth: 0,
						componentPagePerSection: true,
						sections: [],
						components: [
							{
								slug: 'button',
								props: {
									displayName: 'Button',
									examples: []
								}
							}
						]
					}
				] as any
			},
			{ useRouterLinks: true }
		)

		expect(getUrlMock.mock.calls[1][0]).toMatchObject({
			name: 'Button',
			useSlugAsIdParam: false
		})
	})
})
