/**
 * External dependencies
 */
import page from 'page';
import React from 'react';

/**
 * Internal dependencies
 */
import ExamplePage from './example-page';
import { renderPage } from 'lib/react-helpers';
import { navigation, siteSelection } from 'my-sites/controller';
import { addHandlers } from 'state/data-layer/extensions-middleware';
import handlers from 'example/state/handlers';

// TODO: Remove this after handlers are brought in as part of the build.
addHandlers( 'example', handlers );

const render = ( context ) => {
	renderPage( context, <ExamplePage /> );
};

export default function() {
	page( '/extensions/example/:site?', siteSelection, navigation, render );
}
