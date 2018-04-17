/** @format */

/**
 * Internal dependencies
 */
import { getSiteSettings } from 'state/site-settings/selectors';

export default function isGoogleMyBusinessLocationConnected( state, siteId ) {
	const siteSettings = getSiteSettings( state, siteId );

	return siteSettings !== null && siteSettings.hasOwnProperty( 'google_my_business_location_id' );
}
