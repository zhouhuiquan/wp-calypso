/** @format */

/**
 * Internal dependencies
 */

import { isBusiness, isPremium } from 'lib/products-values';

/**
 * Returns true if the site has WordAds access
 * @param  {Site} site Site object
 * @return {boolean}      true if site has WordAds access
 */
export function canAccessWordads( site, canUserManageOptions, canUserActivateWordads ) {
	if ( site ) {
		if ( isWordadsInstantActivationEligible( site, canUserActivateWordads ) ) {
			return true;
		}

		const jetpackPremium = site.jetpack && ( isPremium( site.plan ) || isBusiness( site.plan ) );
		return site.options && ( site.options.wordads || jetpackPremium ) && canUserManageOptions;
	}

	return false;
}

export function isWordadsInstantActivationEligible( site, canUserActivateWordads ) {
	if (
		( isBusiness( site.plan ) || isPremium( site.plan ) ) &&
		canUserActivateWordads &&
		! site.jetpack
	) {
		return true;
	}

	return false;
}
