/** @format */

/**
 * External dependencies
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';
import page from 'page';
import { findIndex, find } from 'lodash';
import { moment } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import Card from 'components/card';
import Delta from 'woocommerce/components/delta';
import ElementChart from 'components/chart';
import formatCurrency from 'lib/format-currency';
import { getPeriodFormat } from 'state/stats/lists/utils';
import { getDelta } from '../utils';
import {
	getSiteStatsNormalizedData,
	isRequestingSiteStatsForQuery,
} from 'state/stats/lists/selectors';
import Legend from 'components/chart/legend';
import Tabs from 'my-sites/stats/stats-tabs';
import Tab from 'my-sites/stats/stats-tabs/tab';
import { UNITS, chartTabs as tabs } from 'woocommerce/app/store-stats/constants';
import { recordTrack } from 'woocommerce/lib/analytics';
import { formatValue } from 'woocommerce/app/store-stats/utils';

class StoreStatsChart extends Component {
	static propTypes = {
		data: PropTypes.array.isRequired,
		deltas: PropTypes.array.isRequired,
		isRequesting: PropTypes.bool.isRequired,
		path: PropTypes.string.isRequired,
		query: PropTypes.object.isRequired,
		selectedDate: PropTypes.string.isRequired,
		siteId: PropTypes.number,
		unit: PropTypes.string.isRequired,
	};

	state = {
		selectedTabIndex: 0,
		activeCharts: tabs[ 0 ].availableCharts,
	};

	barClick = bar => {
		page.redirect( `${ this.props.path }?startDate=${ bar.data.period }` );
	};

	tabClick = tab => {
		const tabData = tabs[ tab.index ];
		this.setState( {
			selectedTabIndex: tab.index,
			activeCharts: tabData.availableCharts,
		} );

		recordTrack( 'calypso_woocommerce_stats_chart_tab_click', {
			tab: tabData.attr,
		} );
	};

	legendClick = attr => {
		const activeCharts = this.state.activeCharts.indexOf( attr ) === -1 ? [ attr ] : [];
		this.setState( {
			activeCharts,
		} );
	};

	createTooltipDate = item => {
		const { unit } = this.props;
		const dateFormat = UNITS[ unit ].shortFormat;
		const date = moment( item.period );
		if ( unit === 'week' ) {
			return `${ date.subtract( 6, 'days' ).format( dateFormat ) } - ${ moment(
				item.period
			).format( dateFormat ) }`;
		}
		return date.format( dateFormat );
	};

	buildToolTipData = ( item, selectedTab ) => {
		const { activeCharts } = this.state;
		const value = formatValue( item[ selectedTab.attr ], selectedTab.type, item.currency );
		const data = [
			{ className: 'is-date-label', value: null, label: this.createTooltipDate( item ) },
			{
				value,
				label: selectedTab.label,
			},
		];
		activeCharts.forEach( attr => {
			data.push( {
				value: formatValue( item[ attr ], selectedTab.type, item.currency ),
				label: find( tabs, tab => tab.attr === attr ).label,
			} );
		} );
		return data;
	};

	buildChartData = ( item, selectedTab, chartFormat ) => {
		const { selectedDate } = this.props;
		const { activeCharts } = this.state;
		const className = classnames( item.classNames.join( ' ' ), {
			'is-selected': item.period === selectedDate,
		} );
		const nestedValue = item[ activeCharts[ 0 ] ] || 0;
		return {
			label: item[ chartFormat ],
			value: item[ selectedTab.attr ],
			nestedValue,
			data: item,
			tooltipData: this.buildToolTipData( item, selectedTab ),
			className,
		};
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
		const { data, deltas, selectedDate, unit } = this.props;
		const { selectedTabIndex } = this.state;
		const selectedTab = tabs[ selectedTabIndex ];
		const isLoading = ! data.length;
		const chartFormat = UNITS[ unit ].chartFormat;
		const chartData = data.map( item => this.buildChartData( item, selectedTab, chartFormat ) );
		const selectedIndex = findIndex( data, d => d.period === selectedDate );
		return (
			<Card className="store-stats-chart stats-module">
				{ this.renderLegend( selectedTabIndex ) }
				<ElementChart loading={ isLoading } data={ chartData } barClick={ this.barClick } />
				<Tabs data={ chartData }>
					{ tabs.map( ( tab, tabIndex ) => {
						if ( tab.isHidden ) {
							return null;
						}
						if ( ! isLoading ) {
							const itemChartData = this.buildChartData( data[ selectedIndex ], tabs[ tabIndex ] );
							const delta = getDelta( deltas, selectedDate, tab.attr );
							const deltaValue =
								delta.direction === 'is-undefined-increase'
									? '-'
									: Math.abs( Math.round( delta.percentage_change * 100 ) );
							const periodFormat = getPeriodFormat( unit, delta.reference_period );
							return (
								<Tab
									key={ tab.attr }
									index={ tabIndex }
									label={ tab.tabLabel || tab.label }
									selected={ tabIndex === selectedTabIndex }
									tabClick={ this.tabClick }
								>
									<span className="store-stats-chart__value value">
										{ tab.type === 'currency'
											? formatCurrency( itemChartData.value, data[ selectedIndex ].currency )
											: Math.round( itemChartData.value * 100 ) / 100 }
									</span>
									<Delta
										value={ `${ deltaValue }%` }
										className={ `${ delta.favorable } ${ delta.direction }` }
										suffix={ `since ${ moment( delta.reference_period, periodFormat ).format(
											UNITS[ unit ].shortFormat
										) }` }
									/>
								</Tab>
							);
						}
					} ) }
				</Tabs>
			</Card>
		);
	}
}

export default connect( ( state, { query, siteId } ) => {
	const statsData = getSiteStatsNormalizedData( state, siteId, 'statsOrders', query );
	return {
		data: statsData.data,
		deltas: statsData.deltas,
		isRequesting: isRequestingSiteStatsForQuery( state, siteId, 'statsOrders', query ),
	};
} )( StoreStatsChart );
