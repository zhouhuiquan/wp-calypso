/**
 * Internal dependencies
 */
import {
	EXAMPLE_FETCH_LIKES,
} from 'example/state/action-types';

export function fetchMyLikes( failureAction ) {
	return {
		type: EXAMPLE_FETCH_LIKES,
		failureAction,
	};
}

