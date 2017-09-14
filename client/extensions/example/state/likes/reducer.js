/**
 * External dependencies
 */
import { createReducer } from 'state/utils';
import {
	EXAMPLE_LIKES_UPDATED
} from 'example/state/action-types';

export default createReducer( null, {
	[ EXAMPLE_LIKES_UPDATED ]: handleLikesUpdated,
} );

function handleLikesUpdated( likes, action ) {
	return action.data;
}
