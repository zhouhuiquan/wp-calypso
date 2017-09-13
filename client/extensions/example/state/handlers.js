/**
 * Internal dependencies
 */
import { mergeHandlers } from 'state/action-watchers/utils';
import likes from './likes/handlers';

export default mergeHandlers(
	likes,
);
