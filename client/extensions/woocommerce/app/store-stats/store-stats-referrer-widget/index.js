/** @format */

/**
 * External dependencies
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { find } from 'lodash';
import { max as d3Max } from 'd3-array';
import { localize } from 'i18n-calypso';
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import { getSiteStatsNormalizedData } from 'state/stats/lists/selectors';
import Table from 'woocommerce/components/table';
import TableRow from 'woocommerce/components/table/table-row';
import TableItem from 'woocommerce/components/table/table-item';
import HorizontalBar from 'woocommerce/components/d3/horizontal-bar';
import Card from 'components/card';
import ErrorPanel from 'my-sites/stats/stats-error';
import { sortBySales } from 'woocommerce/app/store-stats/referrers/helpers';
import { getWidgetPath, getUnitPeriod } from 'woocommerce/app/store-stats/utils';
import Pagination from 'components/pagination';

class StoreStatsReferrerWidget extends Component {
	static propTypes = {
		data: PropTypes.array.isRequired,
		query: PropTypes.object.isRequired,
		siteId: PropTypes.number,
		statType: PropTypes.string.isRequired,
		selectedDate: PropTypes.string.isRequired,
		unit: PropTypes.string.isRequired,
		queryParams: PropTypes.object.isRequired,
		slug: PropTypes.string.isRequired,
		pageType: PropTypes.string.isRequired,
		paginate: PropTypes.bool,
		selectedIndex: PropTypes.number,
		selectedReferrer: PropTypes.string,
	};

	state = {
		page: 1,
		highlight: null,
	};

	isPreCollection( date ) {
		const { moment } = this.props;
		return moment( date ).isBefore( moment( '2018-02-01' ) );
	}

	hasNosaraJobRun( date ) {
		const { moment } = this.props;
		const nowUtc = moment().utc();
		const daysOffsetFromUtc = nowUtc.hour() >= 10 ? 1 : 2;
		const lastValidDay = nowUtc.subtract( daysOffsetFromUtc, 'days' );
		return lastValidDay.isAfter( moment( date ) );
	}

	getEmptyDataMessage( date ) {
		const { translate, slug, queryParams, pageType } = this.props;
		if ( ! this.hasNosaraJobRun( date ) ) {
			const href = `/store/stats/${ pageType }${ getWidgetPath( 'week', slug, queryParams ) }`;
			const primary = translate( 'Data is being processed – check back soon' );
			const secondary = translate(
				'Expand to a {{a}}wider{{/a}} view to see your latest referrers',
				{
					components: {
						a: <a href={ href } />,
					},
				}
			);
			return [ primary, <p key="link">{ secondary }</p> ];
		}
		return this.isPreCollection( date )
			? [ translate( 'Referral data isn’t available before Jetpack v5.9 (March 2018)' ) ]
			: [ translate( 'No referral activity on this date' ) ];
	}

	afterSelect = () => {
		const { afterSelect } = this.props;
		if ( afterSelect ) {
			afterSelect();
		}
	};

	paginate = data => {
		const { paginate, limit } = this.props;
		if ( ! paginate ) {
			const indexedLimit = limit ? limit - 1 : data.length;
			return data.slice( 0, indexedLimit );
		}
		const { page } = this.state;
		const start = ( page - 1 ) * ( limit - 1 );
		const end = start + limit;
		return data.slice( start, end );
	};

	onPageClick = pageNumber => {
		this.setState( {
			page: pageNumber,
		} );
	};

	setPage( { selectedIndex, limit } ) {
		if ( this.props.paginate ) {
			this.setState( {
				page: Math.floor( selectedIndex / limit ) + 1,
				highlight: selectedIndex % limit,
			} );
		}
	}

	componentWillMount() {
		this.setPage( this.props );
	}

	componentWillReceiveProps( nextProps ) {
		this.setPage( nextProps );
	}

	render() {
		const {
			data,
			selectedDate,
			translate,
			unit,
			slug,
			queryParams,
			limit,
			paginate,
			selectedReferrer,
		} = this.props;
		const { page } = this.state;
		const basePath = '/store/stats/referrers';
		if ( data.length === 0 ) {
			const messages = this.getEmptyDataMessage( selectedDate );
			return (
				<Card className="store-stats-referrer-widget stats-module is-showing-error has-no-data">
					<ErrorPanel message={ messages.shift() }>{ messages }</ErrorPanel>
				</Card>
			);
		}
		const paginatedData = this.paginate( data );
		const extent = [ 0, d3Max( paginatedData.map( d => d.sales ) ) ];
		const header = (
			<TableRow isHeader>
				<TableItem isHeader isTitle>
					{ translate( 'Source' ) }
				</TableItem>
				<TableItem isHeader>{ translate( 'Gross Sales' ) }</TableItem>
			</TableRow>
		);
		return (
			<Card className="store-stats-referrer-widget">
				<Table header={ header } compact>
					{ paginatedData.map( d => {
						const widgetPath = getWidgetPath(
							unit,
							slug,
							Object.assign( {}, queryParams, { referrer: d.referrer } )
						);
						const href = `${ basePath }${ widgetPath }`;
						return (
							<TableRow
								key={ d.referrer }
								href={ href }
								afterHref={ this.afterSelect }
								className={ classnames( { 'is-selected': selectedReferrer === d.referrer } ) }
							>
								<TableItem isTitle>{ d.referrer }</TableItem>
								<TableItem>
									<HorizontalBar
										extent={ extent }
										data={ d.sales }
										currency={ d.currency }
										height={ 20 }
									/>
								</TableItem>
							</TableRow>
						);
					} ) }
				</Table>
				{ paginate && (
					<Pagination
						compact
						page={ page }
						perPage={ limit }
						total={ data.length }
						pageClick={ this.onPageClick }
					/>
				) }
			</Card>
		);
	}
}

// @TODO: Do something better with this selector
function getData( state, props ) {
	const { siteId, statType, query, fetchedData, selectedDate, unit, limit, paginate } = props;
	if ( fetchedData ) {
		return fetchedData;
	}
	const rawData = getSiteStatsNormalizedData( state, siteId, statType, query );
	const unitSelectedDate = getUnitPeriod( selectedDate, unit );
	const selectedData = find( rawData, d => d.date === unitSelectedDate ) || { data: [] };
	return sortBySales( selectedData.data, limit && ! paginate ? limit : null );
}

export default connect( ( state, ownProps ) => {
	return {
		data: getData( state, ownProps ),
	};
} )( localize( StoreStatsReferrerWidget ) );
