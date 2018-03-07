/** @format */

/**
 * External dependencies
 */
import { get } from 'lodash';

/**
 * Internal dependencies
 */
import { combineReducers } from 'state/utils';
import { createReducer } from 'state/utils';

// maybes?
// POST_EDIT_START_EDITING,
// POST_EDIT_STOP_EDITING,

const posts = createReducer(
	{},
	{
		[ POST_EDIT_RAW_CONTENT_EMPTY ]: ( state, { siteId, postId } ) => ( {
			...state,
			[ siteId ]: {
				[ postId ]: {
					...get( state, [ siteId, postId ], {} ),
					rawContent: null,
				},
			},
		} ),
		[ POST_EDIT_RAW_CONTENT_SET ]: ( state, { siteId, postId, rawContent } ) => ( {
			...state,
			[ siteId ]: {
				[ postId ]: {
					...get( state, [ siteId, postId ], {} ),
					rawContent,
				},
			},
		} ),
		[ POST_EDIT_ATTRIBUTES_UPDATE ]: ( state, { siteId, postId, attributes } ) => ( {
			...state,
			[ siteId ]: {
				[ postId ]: {
					...get( state, [ siteId, postId ], {} ),
					updates: { // ???
						...attributes,
					}
				},
			},
		} ),
		[ POST_EDIT_AUTOSAVE_REQUEST ]: ( state, { siteId, postId } ) => ( {
			...state,
			[ siteId ]: {
				[ postId ]: {
					...get( state, [ siteId, postId ], {} ),
					autosave: { // ???
						// is there other autosave state to consider here?
						pending: true,

					}
				},
			},
		} ),
		[ POST_EDIT_AUTOSAVE_SUCCESS ]: ( state, { siteId, postId, autosave } ) => ( {
			...state,
			[ siteId ]: {
				[ postId ]: {
					...get( state, [ siteId, postId ], {} ),
					autosave: { // ???
						// is there other autosave state to consider here?
						pending: false,
						body: autosave, // Figure this out more, do better.

					}
				},
			},
		} ),
		[ POST_EDIT_AUTOSAVE_ERROR ]: ( state, { siteId, postId, error } ) => ( {
			...state,
			[ siteId ]: {
				[ postId ]: {
					...get( state, [ siteId, postId ], {} ),
					autosave: { // ???
						// is there other autosave state to consider here?
						pending: false,
						error,
					}
				},
			},
		} ),
	}
} );

const activePost = createReducer( {}, {
	[ POST_EDIT_ACTIVE_POST_SET ]: ( state, { siteId, postId } ) => ( {
		...state,
		[ siteId ]: postId,
	} )
} );

const loading = createReducer(
	{},
	{
		// actually, this state slice should be a result of other actions
		// rather than explicit 'loading' actions.
		// request
		[ POST_EDIT_LOADING_ERROR_SET ]:( state, { siteId, postId } ) => ( {
			...state,
			[ siteId ]: {
				[ postId ]: {
					pending: true,
					error: null,
				},
			},
		} ),
		// error
		[ POST_EDIT_LOADING_ERROR_SET ]:( state, { siteId, postId, error } ) => ( {
			...state,
			[ siteId ]: {
				[ postId ]: {
					pending: false,
					error, // does it even make sense to store the error on this slice?
						   // Lik
				},
			},
		} ),
		// success
		[ POST_EDIT_LOADING_ERROR_SET ]:( state, { siteId, postId } ) => ( {
			...state,
			[ siteId ]: {
				[ postId ]: {
					pending: false,
					error: null,
				},
			},
		} ),
	}
);

export default combineReducers( {
	activePost
	loading,
	posts,
} );


// state, siteId, postId,

// site, post