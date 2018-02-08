/** @format */

/**
 * External dependencies
 */

import { get, filter } from 'lodash';

/**
 * Internal dependencies
 */
import { getSelectedSiteId } from 'state/ui/selectors';

/**
 * @param {Object} state Whole Redux state tree
 * @param {Number} [siteId] Site ID to check. If not provided, the Site ID selected in the UI will be used
 * @return {Array} The locations tree, as retrieved from the server. It can also be the string "LOADING"
 * if the locations are currently being fetched, or a "falsy" value if that haven't been fetched at all.
 */
export const getRawExtensionPOC = ( state, siteId = getSelectedSiteId( state ) ) => {
	return get( state, [ 'extensions', 'woocommerce', 'sites', siteId, 'extensionPOC' ] );
};

export const getGroups = ( state, siteId = getSelectedSiteId( state ) ) => {
	const groups = get( state, [ 'extensions', 'woocommerce', 'sites', siteId, 'extensionPOC' ] );
	return filter( groups, { type: 'group' } );
};
