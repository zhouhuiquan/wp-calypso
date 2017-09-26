/**
 * External dependencies
 */
import { get } from 'lodash';

export function getJpoContactForm( state ) {
	return get( state, 'signup.steps.jpoContactForm', '' );
}
