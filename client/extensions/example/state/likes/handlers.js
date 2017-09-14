/**
 * Internal dependencies
 */
import { http } from 'state/data-layer/wpcom-http/actions';
import { dispatchRequest } from 'state/data-layer/wpcom-http/utils';
import {
	EXAMPLE_FETCH_LIKES,
	EXAMPLE_LIKES_UPDATED,
} from 'example/state/action-types';

export default {
	[ EXAMPLE_FETCH_LIKES ]: [
		dispatchRequest(
			fetchLikes, likesFetched, likesFailure
		)
	],
};

function fetchLikes( { dispatch }, action ) {
	dispatch(
		http(
			{
				method: 'GET',
				apiVersion: '1.1',
				path: '/me/likes/',
			},
			action
		)
	);
}

function likesFetched( { dispatch }, action, data ) {
	dispatch( {
		type: EXAMPLE_LIKES_UPDATED,
		data,
	} );
}

function likesFailure( { dispatch }, action ) {
	const { failureAction } = action;

	dispatch( failureAction );
}

