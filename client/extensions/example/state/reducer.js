/**
 * Internal dependencies
 */
import { combineReducers } from 'state/utils';
import likes from './likes/reducer';

export default combineReducers( {
	likes
} );
