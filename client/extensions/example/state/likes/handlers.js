/**
 * Internal dependencies
 */
import { http } from 'state/data-layer/wpcom-http/actions';
import {
	EXAMPLE_FETCH_LIKES,
	EXAMPLE_LIKES_UPDATED,
} from 'example/state/action-types';

export default {
	[ EXAMPLE_FETCH_LIKES ]: [ fetchLikes ],
};

function fetchLikes( { dispatch }, action ) {
	const { failureAction } = action;

	dispatch( http( {
		method: 'GET',
		apiVersion: '1.1',
		path: '/me/likes/',
		onSuccess: {
			type: EXAMPLE_LIKES_UPDATED,
		},
		onFailure: failureAction,
	} ) );
}

