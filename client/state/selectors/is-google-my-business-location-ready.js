/** @format */

/**
 * Internal dependencies
 */
import { getSiteSettings } from 'state/site-settings/selectors';

export default function isGoogleMyBusinessLocationReady( state, siteId ) {
	const siteSettings = getSiteSettings( state, siteId );

	return siteSettings !== null;
}
