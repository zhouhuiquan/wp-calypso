/** @format */
// Initialize polyfills before any dependencies are loaded
import './polyfills';

/**
 * External dependencies
 */
import debugFactory from 'debug';
import { invoke } from 'lodash';
import page from 'page';

/**
 * Internal dependencies
 */
import detectHistoryNavigation from 'lib/detect-history-navigation';

const debug = debugFactory( 'calypso-login' );

function boot() {
	debug( "Starting Calypso. Let's do this." );

	detectHistoryNavigation.start();
	page.start( { decodeURLComponents: false } );
}

window.AppBoot = () => {
	boot();
};
