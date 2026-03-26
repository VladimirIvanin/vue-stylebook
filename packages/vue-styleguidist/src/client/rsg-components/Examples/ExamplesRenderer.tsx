import React from 'react'
import PropTypes from 'prop-types'
import Styled, { JssInjectedProps } from 'rsg-components/Styled'

const styles = () => ({
	// Keep default isolate rules from Styled.
	root: {}
})

interface ExamplesRendererProps extends JssInjectedProps {
	name: string
	children?: React.ReactNode
}

export const ExamplesRenderer: React.FC<ExamplesRendererProps> = ({ classes, name, children }) => {
	return (
		<article className={classes.root} data-testid={`${name}-examples`}>
			{children}
		</article>
	)
}

ExamplesRenderer.propTypes = {
	classes: PropTypes.objectOf(PropTypes.string.isRequired).isRequired,
	name: PropTypes.string.isRequired,
	children: PropTypes.node
}

export default Styled<ExamplesRendererProps>(styles)(ExamplesRenderer)
