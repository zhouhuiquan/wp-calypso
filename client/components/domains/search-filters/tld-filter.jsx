/** @format */

/**
 * External dependencies
 */
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { localize } from 'i18n-calypso';
import Gridicon from 'gridicons';
// import { pick, noop } from 'lodash';

/**
 * Internal dependencies
 */
import FormLabel from 'components/forms/form-label';
import FormFieldset from 'components/forms/form-fieldset';
import Popover from 'components/popover';
import Button from 'components/button';
import TokenField from 'components/token-field';

export class TldFilterControl extends Component {
	static propTypes = {
		onChange: PropTypes.func.isRequired,
		onFiltersReset: PropTypes.func.isRequired,
		onFiltersSubmit: PropTypes.func.isRequired,
		availableTlds: PropTypes.arrayOf( PropTypes.string ).isRequired,
		tlds: PropTypes.arrayOf( PropTypes.string ).isRequired,
	};

	state = {
		showPopover: false,
	};

	togglePopover = () => {
		this.setState( {
			showPopover: ! this.state.showPopover,
		} );
	};

	handleFiltersReset = () => {
		this.togglePopover();
		this.props.onFiltersReset( 'tlds' );
	};
	handleFiltersSubmit = () => {
		this.togglePopover();
		this.props.onFiltersSubmit();
	};
	handleOnChange = newTlds => {
		this.props.onChange(
			'tlds',
			newTlds.filter( tld => this.props.availableTlds.includes( tld ) )
		);
	};

	render() {
		const { tlds, translate } = this.props;
		const hasFilterValue = tlds.length > 0;
		return (
			<div className="search-filters__filter search-filters__tld-filter">
				<Button
					className={ classNames( { 'is-active': hasFilterValue } ) }
					// primary={ hasFilterValues }
					ref={ button => ( this.button = button ) } // eslint-disable-line react/jsx-no-bind
					onClick={ this.togglePopover }
				>
					{ translate( 'Extensions', {
						context: 'Refers to top level domain name extension, such as ".com"',
					} ) }
					<Gridicon icon="chevron-down" size={ 24 } />
				</Button>

				{ this.state.showPopover && this.renderPopover() }
			</div>
		);
	}

	renderPopover() {
		const { tlds, translate } = this.props;

		return (
			<Popover
				autoPosition={ false }
				className="search-filters__popover"
				context={ this.button }
				isVisible={ this.state.showPopover }
				onClose={ this.togglePopover }
				position="bottom right"
			>
				<FormFieldset className="search-filters__token-field-fieldset">
					<FormLabel
						className="search-filters__label"
						htmlFor="search-filters-show-exact-matches-only"
					>
						<TokenField
							isExpanded
							onChange={ this.handleOnChange }
							placeholder=".com"
							suggestions={ this.props.availableTlds }
							tokenizeOnSpace
							value={ tlds }
						/>
						{ /*
						<FormInputCheckbox
							className="search-filters__checkbox"
							checked={ tlds }
							id="search-filters-show-exact-matches-only"
							name="showExactMatchesOnly"
							onChange={ this.handleOnChange }
							value="showExactMatchesOnly"
						/>
						<span className="search-filters__checkbox-label">
							{ translate( 'Show exact matches only' ) }
						</span>
						*/ }
					</FormLabel>
				</FormFieldset>
				<FormFieldset className="search-filters__buttons-fieldset">
					<div className="search-filters__buttons">
						<Button onClick={ this.handleFiltersReset }>{ translate( 'Reset' ) }</Button>
						<Button primary onClick={ this.handleFiltersSubmit }>
							{ translate( 'Apply' ) }
						</Button>
					</div>
				</FormFieldset>
			</Popover>
		);
	}
}

export default localize( TldFilterControl );
