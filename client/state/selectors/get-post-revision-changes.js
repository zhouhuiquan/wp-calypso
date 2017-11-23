/** @format */

/**
 * External dependencies
 */

import { findIndex, get, isUndefined, map, omitBy, reduce } from 'lodash';

/**
 * Internal dependencies
 */
import { isEnabled } from 'config';
import createSelector from 'lib/create-selector';
import { countDiffWords, diffWords } from 'lib/text-utils';
import getPostRevisions from 'state/selectors/get-post-revisions';
import getPostRevision from 'state/selectors/get-post-revision';

const MAX_DIFF_CONTENT_LENGTH = 20000;

const diffKey = ( key, obj1, obj2 ) =>
	map( diffWords( get( obj1, key, '' ), get( obj2, key, '' ) ), change =>
		omitBy( change, isUndefined )
	);

const getCombinedLength = list =>
	reduce(
		list,
		( sum, r ) => ( sum += get( r, 'title.length', 0 ) + get( r, 'content.length', 0 ) ),
		0
	);


export function getSerializedQuery( state, siteId, postId, revisionId ) {
	const key = [ siteId, postId, revisionId ].join(':');

	console.log( { key } );

	return key;
}

let count = 0

const getPostRevisionChanges = createSelector(
	( state, siteId, postId, revisionId ) => {
		const noChanges = { content: [], summary: {}, title: [] };

		console.log( { revisionId } );

		count += 1

		if (count >= 20 ) {
			debugger;
		}

		if ( ! isEnabled( 'post-editor/revisions' ) ) {
			return noChanges;
		}

		const orderedRevisions = getPostRevisions( state, siteId, postId, 'display' );
		const revisionIndex = findIndex( orderedRevisions, { id: revisionId } );
		if ( revisionIndex === -1 ) {
			return noChanges;
		}

		const revision = orderedRevisions[ revisionIndex ];
		const previousRevision = get( orderedRevisions, [ revisionIndex + 1 ], {} );
		const combinedLength = getCombinedLength( [ previousRevision, revision ] );

		if ( combinedLength > MAX_DIFF_CONTENT_LENGTH ) {
			return { ...noChanges, tooLong: true };
		}
		const title = diffKey( 'title', previousRevision, revision );
		const content = diffKey( 'content', previousRevision, revision );
		const summary = countDiffWords( title.concat( content ) );

		return {
			content,
			summary,
			title,
		};
	},
	( state, x, y, z ) => {
		// console.log( x, y, z );
		console.log( state.posts.revisions.revisions );
		return [ get( state, [ 'posts', 'revisions', 'revisions', x, y, z ] ) ];
	},
	getSerializedQuery
);

export default getPostRevisionChanges;
