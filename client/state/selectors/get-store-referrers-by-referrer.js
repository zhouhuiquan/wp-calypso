/** @format */

/**
 * External dependencies
 */
import { find } from 'lodash';

/**
 * Internal dependencies
 */

import { getSiteStatsNormalizedData } from 'state/stats/lists/selectors';

export default function( state, { siteId, statType, query, selectedReferrer } ) {
	const rawData = getSiteStatsNormalizedData( state, siteId, statType, query );
	if ( ! selectedReferrer ) {
		return [];
	}
	return rawData.map( d => {
		return Object.assign( {}, d, {
			data: find( d.data, r => r.referrer === selectedReferrer ) || {},
		} );
	} );
}
