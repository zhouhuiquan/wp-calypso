/** @format */

/**
 * Internal dependencies
 */

import { createReducer } from 'state/utils';
import {
	WOOCOMMERCE_EXTENSION_POC_PRODUCT_FORM_REQUEST,
	WOOCOMMERCE_EXTENSION_POC_PRODUCT_FORM_REQUEST_SUCCESS,
} from 'woocommerce/state/action-types';

// TODO: Handle error

export default createReducer( null, {
	[ WOOCOMMERCE_EXTENSION_POC_PRODUCT_FORM_REQUEST ]: () => {
		return [];
	},

	[ WOOCOMMERCE_EXTENSION_POC_PRODUCT_FORM_REQUEST_SUCCESS ]: ( state, { data } ) => {
		return data;
	},
} );
