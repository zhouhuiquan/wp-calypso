/** @format */
/**
 * External dependencies
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';

/**
 * internal dependencies
 */
import NestedSidebarLink from './nested-sidebar-link';
import { getRouteData } from './docs/access';

export class NestedSidebarParentLink extends Component {
	render() {
		const { route } = this.props;
		const routeData = getRouteData( route );
		const parentRoute = routeData.parent;

		// if ( ! parentRoute ) {
		// 	return null;
		// }

		return (
			<NestedSidebarLink route={ parentRoute || null } direction="left">
				{ this.props.children }
			</NestedSidebarLink>
		);
	}
}

export default connect( ( state, { route } ) => ( {
	route: route || get( state, 'sidebar.route' ),
} ) )( NestedSidebarParentLink );
