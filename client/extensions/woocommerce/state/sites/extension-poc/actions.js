/** @format */

/**
 * Internal dependencies
 */

import request from 'woocommerce/state/sites/request';
import { setError } from '../status/wc-api/actions';
import {
	WOOCOMMERCE_EXTENSION_POC_PRODUCT_FORM_REQUEST,
	WOOCOMMERCE_EXTENSION_POC_PRODUCT_FORM_REQUEST_SUCCESS,
} from 'woocommerce/state/action-types';

export const fetchProductForm = ( siteId, productId ) => dispatch => {
	const getAction = {
		type: WOOCOMMERCE_EXTENSION_POC_PRODUCT_FORM_REQUEST,
		siteId,
		productId,
	};

	dispatch( getAction );

	const path = ( productId && `post-form/${ productId }` ) || 'post-form';
	return request( siteId )
		.get( path, 'wc-ext/v1' )
		.then( data => {
			dispatch( {
				type: WOOCOMMERCE_EXTENSION_POC_PRODUCT_FORM_REQUEST_SUCCESS,
				siteId,
				data,
			} );
		} )
		.catch( err => {
			dispatch( setError( siteId, getAction, err ) );
		} );
};
