/** @format */

/**
 * External dependencies
 */
import page from 'page';

/**
 * Internal dependencies
 */
import config from 'config';
import { fetchGoogleMyBusinessLocation } from 'state/google-my-business/actions';
import { getSelectedSiteId, getSelectedSiteSlug } from 'state/ui/selectors';
import { isGoogleMyBusinessLocationConnected, isGoogleMyBusinessLocationReady } from 'state/selectors';
import { makeLayout, redirectLoggedOut } from 'controller';
import { navigation, sites, siteSelection } from 'my-sites/controller';
import { newAccount, selectBusinessType, selectLocation, stats } from './controller';

export function redirectToStatsPage( context, next ) {
	const state = context.store.getState();
	const siteId = getSelectedSiteId( state );

	if ( ! isGoogleMyBusinessLocationReady( state, siteId ) ) {
		context.store.dispatch( fetchGoogleMyBusinessLocation( siteId ) );
	}

	if ( isGoogleMyBusinessLocationConnected( state, siteId ) ) {
		const siteSlug = getSelectedSiteSlug( state );

		page.redirect( `/google-my-business/stats/${ siteSlug }` );

		return;
	}

	next();
}

export default function( router ) {
	router(
		'/google-my-business',
		'/google-my-business/select-business-type'
	);

	router(
		'/google-my-business/select-business-type',
		redirectLoggedOut,
		siteSelection,
		sites,
		makeLayout,
	);

	router(
		'/google-my-business/select-business-type/:site',
		redirectLoggedOut,
		siteSelection,
		redirectToStatsPage,
		selectBusinessType,
		navigation,
		makeLayout,
	);

	if ( config.isEnabled( 'google-my-business' ) ) {
		router(
			'/google-my-business/new',
			redirectLoggedOut,
			siteSelection,
			sites,
			makeLayout,
		);

		router(
			'/google-my-business/new/:site',
			redirectLoggedOut,
			siteSelection,
			redirectToStatsPage,
			newAccount,
			navigation,
			makeLayout,
		);

		router(
			'/google-my-business/select-location',
			redirectLoggedOut,
			siteSelection,
			sites,
			makeLayout,
		);

		router(
			'/google-my-business/select-location/:site',
			redirectLoggedOut,
			siteSelection,
			redirectToStatsPage,
			selectLocation,
			navigation,
			makeLayout,
		);

		router(
			'/google-my-business/stats',
			redirectLoggedOut,
			siteSelection,
			sites,
			makeLayout,
		);

		router(
			'/google-my-business/stats/:site',
			redirectLoggedOut,
			siteSelection,
			stats,
			navigation,
			makeLayout,
		);
	}

	router(
		'/google-my-business/:site',
		( context ) => {
			page.redirect( `/google-my-business/select-business-type/${ context.params.site }` );
		}
	);
}
