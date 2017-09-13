/**
 * Internal dependencies
 */
import { http } from 'state/data-layer/wpcom-http/actions';
import {
	EXAMPLE_LIKES_UPDATED,
} from 'example/state/action-types';

export function fetchMyLikes( failureAction ) {
	return http( {
		method: 'GET',
		apiVersion: '1.1',
		path: '/me/likes/',
		onSuccess: {
			type: EXAMPLE_LIKES_UPDATED,
		},
		onFailure: failureAction,
	} );
}

