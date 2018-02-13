/** @format */
/**
 * External dependencies
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import Button from 'components/button';
import { autoConfigCredentials } from 'state/jetpack/credentials/actions';
import { getSelectedSiteId } from 'state/ui/selectors';

class RewindAutoConfigButton extends Component {
	static propTypes = {
		// Connected props
		siteId: PropTypes.number.isRequired,
		autoConfigure: PropTypes.func.isRequired,

		// localize
		translate: PropTypes.func.isRequired,
	};

	handleAutoConfig = () => this.props.autoConfigure( this.props.siteId );

	render() {
		const { translate } = this.props;

		return (
			<Button primary onClick={ this.handleAutoConfig }>
				{ translate( 'Auto configure credentials' ) }
			</Button>
		);
	}
}

export default connect(
	state => ( {
		siteId: getSelectedSiteId( state ),
	} ),
	{
		autoConfigure: siteId => autoConfigCredentials( siteId ),
	}
)( localize( RewindAutoConfigButton ) );
