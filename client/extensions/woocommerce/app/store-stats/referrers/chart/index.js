/** @format */

/**
 * External dependencies
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import ElementChart from 'components/chart';

class Chart extends Component {
	static propTypes = {
		data: PropTypes.array.isRequired,
		unitSelectedDate: PropTypes.string,
		// unit: PropTypes.oneOf( [ 'day', 'week', 'month', 'year' ] ),
	};

	barClick() {}

	buildChartData = item => {
		const { unitSelectedDate } = this.props;
		const className = classnames( {
			'is-selected': item.date === unitSelectedDate,
		} );
		return {
			label: item.date,
			value: item.data.sales || 0,
			data: item.data,
			className,
		};
	};

	render() {
		const { data } = this.props;
		const chartData = data.map( this.buildChartData );
		return <ElementChart data={ chartData } barClick={ this.barClick } />;
	}
}

export default Chart;
