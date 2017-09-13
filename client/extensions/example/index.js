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

const render = ( context ) => {
	renderPage( context, <ExamplePage /> );
};

export default function() {
	page( '/extensions/example/:site?', siteSelection, navigation, render );
}
