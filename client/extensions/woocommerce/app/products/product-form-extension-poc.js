/** @format */

/**
 * External dependencies
 */

import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { filter, isNumber } from 'lodash';

/**
 * Internal dependencies
 */
import { fetchProductForm } from 'woocommerce/state/sites/extension-poc/actions';
import { getGroups, getRawExtensionPOC } from 'woocommerce/state/sites/extension-poc/selectors';
import Card from 'components/card';
import FormFieldSet from 'components/forms/form-fieldset';
import FormLabel from 'components/forms/form-label';
import FormTextInput from 'components/forms/form-text-input';

class ProductFormExtensionPOC extends Component {
	static propTypes = {
		siteId: PropTypes.number,
		product: PropTypes.shape( {
			id: PropTypes.isRequired,
		} ),
		editProduct: PropTypes.func.isRequired,
		fetchProductForm: PropTypes.func.isRequired,
	};

	componentDidMount() {
		const { siteId } = this.props;
		this.props.fetchProductForm( siteId );
	}

	componentWillReceiveProps( newProps ) {
		const { siteId, product } = this.props;
		const newProductId = ( newProps.product && newProps.product.id ) || null;
		const oldProductId = ( product && product.id ) || null;
		if ( oldProductId !== newProductId ) {
			const productId = isNumber( newProductId ) ? newProductId : null;
			this.props.fetchProductForm( siteId, productId );
		}
	}

	setValue( field, e ) {
		const { siteId, product, editProduct } = this.props;
		editProduct( siteId, product, { [ field ]: e.target.value } );
	}

	renderFields = group => {
		const { productForm, product } = this.props;
		// Should be a selector/helper

		const fields = filter( productForm, { parent: group.id } );

		const fieldsOutput =
			fields &&
			fields.map( field => {
				const setValue = e => this.setValue( field.id, e );

				// Support other input types
				return (
					<div>
						<FormFieldSet>
							<FormLabel>{ field.label }</FormLabel>
							<FormTextInput
								id="name"
								value={ product[ field.id ] || field.value }
								onChange={ setValue }
							/>
						</FormFieldSet>
					</div>
				);
			} );

		return <div>{ fieldsOutput }</div>;
	};

	render() {
		const { groups } = this.props;
		const groupOutput =
			groups &&
			groups.map( group => {
				// Should be a selector/helper
				const fieldOutput = this.renderFields( group );
				return (
					<Card>
						<p>
							<strong> { group.label }</strong>
						</p>
						{ fieldOutput }
					</Card>
				);
			} );

		return <div>{ groupOutput }</div>;
	}
}

function mapStateToProps( state ) {
	const groups = getGroups( state );
	const productForm = getRawExtensionPOC( state );

	return {
		groups,
		productForm,
	};
}

function mapDispatchToProps( dispatch ) {
	return bindActionCreators(
		{
			fetchProductForm,
		},
		dispatch
	);
}

export default connect( mapStateToProps, mapDispatchToProps )( ProductFormExtensionPOC );
