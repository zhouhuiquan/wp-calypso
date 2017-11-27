/** @format */

/**
 * External dependencies
 */
import { expect } from 'chai';
import { assign, keyBy } from 'lodash';

const mergeNewRevisions = ( revisions, action ) => {
	return assign( revisions, keyBy( action.revisions, 'id' ), keyBy( revisions, 'id' ) );

}


describe( 'mergeNewRevisions', () => {
	const oldRevisions = { a: { id: 'a', x: 1 } }
	const newRevisions = [ { id: 'a', x: 2 }, { id: 'b', x: 4 } ]

	test( 'returns the original revisions object', () => {
		const actual = mergeNewRevisions( oldRevisions, { revisions: newRevisions } );
		const expected = oldRevisions;

		expect( actual ).to.equal( expected );
	} )

	test( 'merges new revisions in to existing revisions object', () => {
		const actual = mergeNewRevisions( oldRevisions, { revisions: newRevisions } ).a;
		const expected = oldRevisions.a;

		console.log( newRevisions, oldRevisions )

		expect( actual.x ).to.equal( 1 );
		// expect( actual ).to.equal( expected );
	} );
} );


// const oldRevisions = { a: { id: 'a', x: 1 } }
// const newRevisions = [ { id: 'a', x: 1 }, { id: 'a', x: 1 } ]



// assign( revisions, keyBy( action.revisions, 'id' ) )