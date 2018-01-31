/** @format */

/**
 * External dependencies
 */

import React from 'react';

/**
 * Internal dependencies
 */
import ScreenReaderText from 'components/screen-reader-text';
import ScreenReaderLabel from 'components/screen-reader-text/label';

export default function ScreenReaderTextExample() {
	const srText = "I'm visible for screen readers";
	const srLabel = "I'm a label for screen readers";
	return (
		<div>
			<p>
				This text is followed by the JSX &lt;ScreenReaderText&gt;{ srText }&lt;/ScreenReaderText&gt;.
				It's invisible on normal displays but "visible" to screen readers. Inspect to see the
				example.
			</p>
			<ScreenReaderText>{ srText }</ScreenReaderText>
			<p>
				This text is followed by an example of a ScreenReaderLabel. The input is preceeded by an
				invisible label, read out for screen readers. This gives more context to screen reader users
				for forms with visual cues.
			</p>
			<ScreenReaderLabel htmlFor="sr-example-input">{ srLabel }</ScreenReaderLabel>
			<input type="text" id="sr-example-input" />
		</div>
	);
}
ScreenReaderTextExample.displayName = 'ScreenReaderTextExample';
