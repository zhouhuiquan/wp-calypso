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
import { getRouteComponent } from './docs/access';
import Transitioner from 'components/transitioner';

export class NestedSidebar extends Component {
	render() {
		const { route, transition } = this.props;

		const transitioningRoute = get( transition, 'route' );
		const transitionDirection = get( transition, 'direction' );

		const TransitioningComponent = transitioningRoute && getRouteComponent( transitioningRoute );
		const SidebarComponent = getRouteComponent( route );

		return (
			<div className="nested-sidebar">
				{
					<Transitioner
						direction={ transitionDirection }
						IncomingComponent={ TransitioningComponent }
					>
						{ SidebarComponent && <SidebarComponent /> }
					</Transitioner>
				}
			</div>
		);
	}
}

export default connect( state => ( {
	// @TODO: Create/Use proper selectors for these.
	route: get( state, 'sidebar.route' ),
	transition: get( state, 'sidebar.transition' ) || {},
} ) )( NestedSidebar );
