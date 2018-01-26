/** @format */
/**
 * External dependencies
 */
import { get } from 'lodash';

/**
 * @param {Object} state Global app state
 * @return {Object} An object that represents the current status for site rename requests.
 */
export default ( state, siteId ) => get( state, [ 'siteRename', 'status', siteId ], {} );
