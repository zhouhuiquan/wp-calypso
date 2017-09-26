/**
 * External dependencies
 */
import debugFactory from 'debug';

/**
 * Internal dependencies
 */
import { SIGNUP_STEPS_JPO_CONTACT_FORM_SET } from 'state/action-types';

/**
 * Module constants
 */
const debug = debugFactory( 'calypso:jetpack-jpo:actions' );

export function setJpoContactForm( contactForm ) {
	debug( 'setJpoContactForm', contactForm );

	return {
		type: SIGNUP_STEPS_JPO_CONTACT_FORM_SET,
		contactForm
	};
}
