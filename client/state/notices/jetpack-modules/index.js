/** @format */

/**
 * External dependencies
 */

import { translate } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import {
	JETPACK_MODULE_ACTIVATE_FAILURE,
	JETPACK_MODULE_ACTIVATE_SUCCESS,
	JETPACK_MODULE_DEACTIVATE_FAILURE,
	JETPACK_MODULE_DEACTIVATE_SUCCESS,
} from 'state/action-types';
import { MODULE_NOTICES } from './constants';
import { successNotice, errorNotice } from 'state/notices/actions';

export const onJetpackModuleActivationActionMessage = (
	dispatch,
	{ type, moduleSlug, silent }
) => {
	if ( silent ) {
		return;
	}

	const noticeSettings = { duration: 10000 };
	const message = ( MODULE_NOTICES[ moduleSlug ] || MODULE_NOTICES[ '*' ] )[ type ];
	let messageType;

	switch ( type ) {
		case JETPACK_MODULE_ACTIVATE_SUCCESS:
		case JETPACK_MODULE_DEACTIVATE_SUCCESS:
			messageType = 'success';
			break;
		case JETPACK_MODULE_ACTIVATE_FAILURE:
		case JETPACK_MODULE_DEACTIVATE_FAILURE:
			messageType = 'error';
			break;
	}

	if ( ! message ) {
		return;
	}

	if ( messageType === 'success' ) {
		dispatch( successNotice( message( translate ), noticeSettings ) );
	} else if ( messageType === 'error' ) {
		dispatch( errorNotice( message( translate ), noticeSettings ) );
	}
};
