/** @format */

/**
 * Internal dependencies
 */
import {
	JETPACK_MODULE_ACTIVATE_FAILURE as ACTIVATE_FAILURE,
	JETPACK_MODULE_ACTIVATE_SUCCESS as ACTIVATE_SUCCESS,
	JETPACK_MODULE_DEACTIVATE_FAILURE as DEACTIVATE_FAILURE,
	JETPACK_MODULE_DEACTIVATE_SUCCESS as DEACTIVATE_SUCCESS,
} from 'state/action-types';

export const MODULE_NOTICES = {
	'infinite-scroll': {
		[ ACTIVATE_SUCCESS ]: translate => translate( 'Infinite scroll is now on.' ),
		[ DEACTIVATE_SUCCESS ]: translate => translate( 'Infinite scroll is now off.' ),
		[ ACTIVATE_FAILURE ]: translate => translate( 'Infinite scroll could not be switched on.' ),
		[ DEACTIVATE_FAILURE ]: translate => translate( 'Infinite scroll could not be switched off.' ),
	},
	'*': {
		[ ACTIVATE_SUCCESS ]: translate => translate( 'Settings saved successfully!' ),
		[ DEACTIVATE_SUCCESS ]: translate => translate( 'Settings saved successfully!' ),
		[ ACTIVATE_FAILURE ]: translate =>
			translate( 'There was a problem saving your changes. Please try again.' ),
		[ DEACTIVATE_FAILURE ]: translate =>
			translate( 'There was a problem saving your changes. Please try again.' ),
	},
};
