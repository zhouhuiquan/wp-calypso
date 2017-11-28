/** @format */
/**
 * External dependencies
 */
import { get } from 'lodash';

const getPostRevisionsCount = state => {
	// console.log( 'getPostRevisionsCount called' );
	return get( state, 'posts.revisions.count' );
};
export default getPostRevisionsCount;
