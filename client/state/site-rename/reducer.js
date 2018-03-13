/** @format */
/**
 * External dependencies
 */
import { get } from 'lodash';

/**
 * Internal dependencies
 */
import { combineReducers, createReducer } from 'state/utils';
import {
	SITE_ADDRESS_AVAILABILITY_REQUEST,
	SITE_ADDRESS_AVAILABILITY_SUCCESS,
	SITE_ADDRESS_AVAILABILITY_ERROR,
	SITE_RENAME_REQUEST,
	SITE_RENAME_REQUEST_FAILURE,
	SITE_RENAME_REQUEST_SUCCESS,
} from 'state/action-types';

/**
 * Returns the updated request state after an action has been dispatched. The
 * state maps site ID keys to a boolean value. Each site is true if
 * a site-rename request is currently taking place, and false otherwise.
 *
 * @param  {Object} state  Current state
 * @param  {Object} action Action payload
 * @return {Object}        Updated rename request state
 */
export const requesting = createReducer(
	{},
	{
		[ SITE_RENAME_REQUEST ]: ( state, { siteId } ) => ( { ...state, [ siteId ]: true } ),
		[ SITE_RENAME_REQUEST_SUCCESS ]: ( state, { siteId } ) => ( {
			...state,
			[ siteId ]: false,
		} ),
		[ SITE_RENAME_REQUEST_FAILURE ]: ( state, { siteId } ) => ( {
			...state,
			[ siteId ]: false,
		} ),
	}
);

/**
 * Returns the updated site-rename state after an action has been dispatched.
 * Saving state tracks whether the settings for a site are currently being saved.
 *
 * @param  {Object} state 	Current rename requesting state
 * @param  {Object} action 	Action object
 * @return {Object} 		Updated rename request state
 */
export const status = createReducer(
	{},
	{
		[ SITE_RENAME_REQUEST ]: ( state, { siteId } ) => ( {
			...state,
			[ siteId ]: {
				status: 'pending',
				error: false,
			},
		} ),
		[ SITE_RENAME_REQUEST_SUCCESS ]: ( state, { siteId } ) => ( {
			...state,
			[ siteId ]: {
				status: 'success',
				error: false,
			},
		} ),
		[ SITE_RENAME_REQUEST_FAILURE ]: ( state, { siteId, error } ) => ( {
			...state,
			[ siteId ]: {
				status: 'error',
				error,
			},
		} ),
	}
);

export const availability = createReducer(
	{},
	{
		[ SITE_ADDRESS_AVAILABILITY_REQUEST ]: ( state, { siteId } ) => ( {
			...state,
			[ siteId ]: {
				...get( state, siteId, {} ),
				pending: true,
				error: null,
				validatedAddress: null,
				isValidatedAddressAvailable: null,
			},
		} ),
		[ SITE_ADDRESS_AVAILABILITY_SUCCESS ]: (
			state,
			{ siteId, siteAddress, isAddressAvailable }
		) => ( {
			...state,
			[ siteId ]: {
				...get( state, siteId, {} ),
				pending: false,
				error: null,
				validatedAddress: siteAddress,
				isValidatedAddressAvailable: isAddressAvailable,
			},
		} ),
		[ SITE_ADDRESS_AVAILABILITY_ERROR ]: ( state, { siteId, error } ) => ( {
			...state,
			[ siteId ]: {
				...get( state, siteId, {} ),
				pending: false,
				error,
				validatedAddress: null,
				isValidatedAddressAvailable: null,
			},
		} ),
	}
);

export default combineReducers( {
	availability,
	status,
	requesting,
} );
