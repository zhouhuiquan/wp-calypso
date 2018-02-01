/** @format */
/**
 * Internal dependencies
 */
import {
	SIDEBAR_ROUTE_SET,
	SIDEBAR_ROUTE_TRANSITION_SET,
	SIDEBAR_ROUTE_TRANSITION_DONE,
} from 'state/action-types';

export const setSidebarRoute = route => dispatch => {
	dispatch( {
		type: SIDEBAR_ROUTE_SET,
		route,
	} );
};

export const startSidebarTransition = ( route, direction ) => dispatch => {
	dispatch( {
		type: SIDEBAR_ROUTE_TRANSITION_SET,
		direction,
		route,
	} );
};

export const endSidebarTransition = () => dispatch => {
	dispatch( {
		type: SIDEBAR_ROUTE_TRANSITION_DONE,
	} );
};
