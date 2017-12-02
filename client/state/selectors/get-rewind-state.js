/** @format */

/**
 * External dependencies
 */

import { get } from 'lodash';

/**
 * Returns the state of the Rewind state machine.
 *
 * @param {Object} state Global state tree
 * @param {number|string} siteId the site ID
 * @return {string} rewind state key
 */
export default function getRewindState( state, siteId ) {
	return get( state.rewind, [ siteId, 'state' ], 'unknown' );
}
