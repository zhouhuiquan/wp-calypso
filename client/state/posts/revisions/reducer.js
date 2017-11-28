/** @format */

/**
 * External dependencies
 */

import { get, differenceBy, uniqBy, keyBy, merge, assign } from 'lodash';

/**
 * Internal dependencies
 */
import {
	POST_EDIT,
	POST_REVISIONS_RECEIVE,
	POST_REVISIONS_REQUEST,
	POST_REVISIONS_REQUEST_FAILURE,
	POST_REVISIONS_REQUEST_SUCCESS,
	POST_REVISIONS_SELECT,
	POST_REVISIONS_DIALOG_CLOSE,
	POST_REVISIONS_DIALOG_OPEN,
	SELECTED_SITE_SET,
} from 'state/action-types';

import { combineReducers } from 'state/utils';

export function requesting( state = {}, action ) {
	switch ( action.type ) {
		case POST_REVISIONS_REQUEST:
		case POST_REVISIONS_REQUEST_FAILURE:
		case POST_REVISIONS_REQUEST_SUCCESS:
			return merge( {}, state, {
				[ action.siteId ]: {
					[ action.postId ]: action.type === POST_REVISIONS_REQUEST,
				},
			} );
	}

	return state;
}

export const mergeNewRevisions = ( revisions, newRevisions ) =>
	assign( revisions, keyBy( newRevisions, 'id' ), keyBy( revisions, 'id' ) );

export function revisions( state = {}, action ) {
	if ( action.type === POST_REVISIONS_RECEIVE ) {
		const { siteId, postId } = action;

		// console.log( { revisionsState: state } );
		// const uniqueRevisions = uniqBy( action.revisions, get( state, [ siteId, postId ]) );

		const revisions = get( state, [ siteId, postId ] );

		// if ( revisions && action.revisions ) {
		// 	forEach( action.revisions, r => revisions[ r.id ] = r );
		// } else {
		// 	revisions = keyBy( action.revisions, 'id' );
		// }
		// console.log( 'before return' );

		const merged = mergeNewRevisions( revisions, action.revisions );

		// const merged = assign(
		// revisions,
		// keyBy( action.revisions, 'id' ),
		// keyBy( revisions, 'id' )
		// {}
		// );

		// console.log( { merged } );
		// console.log( 'before return 2', { merged } );

		return {
			...state,
			[ siteId ]: {
				...state[ siteId ],
				[ postId ]: merged,
			},
		};
	}

	return state;
}

export function selection( state = {}, action ) {
	switch ( action.type ) {
		case POST_REVISIONS_SELECT: {
			return { ...state, revisionId: action.revisionId };
		}
		case POST_EDIT:
		case SELECTED_SITE_SET: {
			return { ...state, revisionId: null };
		}
		default:
			return state;
	}
}

export function ui( state = {}, action ) {
	switch ( action.type ) {
		case POST_REVISIONS_DIALOG_CLOSE:
			return { ...state, isDialogVisible: false };
		case POST_REVISIONS_DIALOG_OPEN:
			return { ...state, isDialogVisible: true };
		default:
			return state;
	}
}

export function count( state = 0, action ) {
	switch ( action.type ) {
		case POST_REVISIONS_RECEIVE:
			console.log( POST_REVISIONS_RECEIVE,  get( action, 'revisions.length' ) )
			return get( action, 'revisions.length', 0 );
		case 'POST_REVISIONS_COUNT_SET':
			return action.count;
		default:
			return state;
	}
}

export default combineReducers( {
	requesting,
	revisions,
	selection,
	ui,
	count,
} );
