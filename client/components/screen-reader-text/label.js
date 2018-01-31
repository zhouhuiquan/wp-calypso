/** @format */

/**
 * External dependencies
 */
import React from 'react';
import PropTypes from 'prop-types';

function ScreenReaderLabel( { htmlFor, children } ) {
	/* eslint-disable wpcalypso/jsx-classname-namespace */
	return (
		<label className="screen-reader-text" htmlFor={ htmlFor }>
			{ children }
		</label>
	);
	/* eslint-enable wpcalypso/jsx-classname-namespace */
}

ScreenReaderLabel.propTypes = {
	htmlFor: PropTypes.string.isRequired,
};

export default ScreenReaderLabel;
