/** @format */
/**
 * External dependencies
 */
import { get, pick } from 'lodash';

/**
 * Internal dependencies
 */
import {
	SIDEBAR_ROUTE_SET,
	SIDEBAR_ROUTE_TRANSITION_SET,
	SIDEBAR_ROUTE_TRANSITION_DONE,
} from 'state/action-types';
import { createReducer, combineReducers } from 'state/utils';

export const route = createReducer( 'root', {
	[ SIDEBAR_ROUTE_SET ]: ( state, action ) => get( action, 'route', state ),
} );

export const parentRoute = createReducer( '', {
	[ SIDEBAR_ROUTE_SET ]: ( state, action ) => get( action, 'parentRoute', state ),
} );

export const transition = createReducer(
	{},
	{
		[ SIDEBAR_ROUTE_TRANSITION_SET ]: ( state, action ) => pick( action, 'route', 'direction' ),
		[ SIDEBAR_ROUTE_TRANSITION_DONE ]: () => ( {
			route: null,
			direction: null,
		} ),
	}
);

export default combineReducers( {
	route,
	parentRoute,
	transition,
} );
