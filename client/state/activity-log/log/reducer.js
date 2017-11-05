/** @format */
/**
 * External dependencies
 */
import { unionBy } from 'lodash';

/**
 * Internal dependencies
 */
import { ACTIVITY_LOG_UPDATE } from 'state/action-types';
import { keyedReducer } from 'state/utils';
import { logItemsSchema } from './schema';

export const logItem = ( state = null, { type, data } ) => {
	switch ( type ) {
		case ACTIVITY_LOG_UPDATE:
			return unionBy( data, state, 'activityId' );

		default:
			return state;
	}
};

export const logItems = keyedReducer( 'siteId', logItem );
logItems.schema = logItemsSchema;
