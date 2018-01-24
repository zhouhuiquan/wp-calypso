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
import QuerySitePlans from 'components/data/query-site-plans';
import Banner from 'components/banner';
import { getSelectedSiteSlug } from 'state/ui/selectors';

class ActivityLogUpgradeNotice extends Component {
	static propTypes = {
		siteId: PropTypes.number.isRequired,

		// Connected props
		siteSlug: PropTypes.string.isRequired,

		// localize
		translate: PropTypes.func.isRequired,
	};

	render() {
		const {
			siteId,
			siteSlug,
			translate,
		} = this.props;

		return [
			<QuerySitePlans siteId={ siteId } />,
			<Banner
				plan="personal-bundle"
				href={ `/plans/${ siteSlug }` }
				callToAction={ translate( 'Upgrade' ) }
				title={ translate( 'Upgrade your Jetpack plan to restore your site to events in the past.' ) }
			/>,
		];
	}
}

export default connect(
	( state, { siteId } ) => ( {
		siteSlug: getSelectedSiteSlug( state, siteId ),
	} )
)( localize( ActivityLogUpgradeNotice ) );
