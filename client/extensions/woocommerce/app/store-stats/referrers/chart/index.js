/** @format */

/**
 * External dependencies
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { findIndex, find } from 'lodash';
import page from 'page';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import Card from 'components/card';
import ElementChart from 'components/chart';
import Legend from 'components/chart/legend';
import Tabs from 'my-sites/stats/stats-tabs';
import Tab from 'my-sites/stats/stats-tabs/tab';
import { getWidgetPath, formatValue } from 'woocommerce/app/store-stats/utils';
import { recordTrack } from 'woocommerce/lib/analytics';
import { referrerChartTabs as tabs } from 'woocommerce/app/store-stats/constants';
import { getStoreReferrersByReferrer } from 'state/selectors';

class Chart extends Component {
	static propTypes = {
		data: PropTypes.array.isRequired,
		selectedDate: PropTypes.string,
		selectedReferrer: PropTypes.string,
		chartFormat: PropTypes.string,
	};

	state = {
		selectedTabIndex: 0,
		activeCharts: tabs[ 0 ].availableCharts,
	};

	barClick = bar => {
		const { unit, slug, selectedReferrer } = this.props;
		const query = { startDate: bar.date, referrer: selectedReferrer };
		const path = getWidgetPath( unit, slug, query );
		page( `/store/stats/referrers${ path }` );
	};

	tabClick = tab => {
		const tabData = tabs[ tab.index ];
		this.setState( {
			selectedTabIndex: tab.index,
			activeCharts: tabData.availableCharts,
		} );

		recordTrack( 'calypso_woocommerce_stats_referrers_chart_tab_click', {
			tab: tabData.attr,
		} );
	};

	legendClick = attr => {
		const activeCharts = this.state.activeCharts.indexOf( attr ) === -1 ? [ attr ] : [];
		this.setState( {
			activeCharts,
		} );
	};

	buildToolTipData = ( item, selectedTab ) => {
		const { selectedDate } = this.props;
		const { activeCharts } = this.state;
		const data = [
			{ className: 'is-date-label', value: null, label: selectedDate },
			{ value: item.data[ selectedTab.attr ] || 0, label: selectedTab.label },
		];
		activeCharts.forEach( attr => {
			data.push( {
				value: item.data[ attr ],
				label: find( tabs, tab => tab.attr === attr ).label,
			} );
		} );
		return data;
	};

	buildChartData = item => {
		const { selectedDate, chartFormat } = this.props;
		const { selectedTabIndex, activeCharts } = this.state;
		const selectedTab = tabs[ selectedTabIndex ];
		const className = classnames( item.classNames.join( ' ' ), {
			'is-selected': item.date === selectedDate,
		} );
		const nestedValue = item.data[ activeCharts[ 0 ] ] || 0;
		return {
			label: item[ chartFormat ],
			value: item.data[ selectedTab.attr ] || 0, // @TODO format this
			data: item.data,
			date: item.date,
			nestedValue,
			tooltipData: this.buildToolTipData( item, selectedTab ),
			className,
		};
	};

	formatTabValue = ( isSales, currency ) => {
		if ( isSales ) {
			return value => formatValue( value, 'currency', currency, { precision: 0 } );
		}
		return value => formatValue( value, 'number' );
	};

	renderLegend = selectedTabIndex => {
		const activeTab = tabs[ selectedTabIndex ];
		return (
			<Legend
				activeTab={ activeTab }
				availableCharts={ activeTab.availableCharts }
				activeCharts={ this.state.activeCharts }
				tabs={ tabs }
				clickHandler={ this.legendClick }
			/>
		);
	};

	render() {
		const { data, selectedDate } = this.props;
		const chartData = data.map( this.buildChartData );
		const { selectedTabIndex } = this.state;
		const selectedIndex = findIndex( data, d => d.date === selectedDate );
		return (
			<Card className="chart stats-module">
				{ this.renderLegend( selectedTabIndex ) }
				<ElementChart data={ chartData } barClick={ this.barClick } />
				{ data.length && (
					<Tabs data={ chartData }>
						{ tabs.map( ( tab, index ) => {
							const item = chartData[ selectedIndex ].data;
							const value = item[ tab.attr ];
							const isSales = tab.attr === 'sales';
							return (
								<Tab
									key={ tab.attr }
									index={ index }
									label={ tab.label }
									selected={ index === selectedTabIndex }
									tabClick={ this.tabClick }
									gridicon={ tab.gridicon }
									value={ value }
									format={ this.formatTabValue( isSales, item.currency ) }
								/>
							);
						} ) }
					</Tabs>
				) }
			</Card>
		);
	}
}

export default connect( ( state, { siteId, query, selectedReferrer } ) => {
	return {
		data: getStoreReferrersByReferrer( state, {
			siteId,
			statType: 'statsStoreReferrers',
			query,
			selectedReferrer,
		} ),
	};
} )( Chart );
