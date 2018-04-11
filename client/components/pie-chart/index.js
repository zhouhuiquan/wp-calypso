/** @format */

/**
 * External dependencies
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { pie as d3Pie, arc as d3Arc } from 'd3-shape';
import { isEqual } from 'lodash';

/**
 * Internal dependencies
 */
import DataType from './data/type';
import { sortDataAndAssignSections } from './data';

const SVG_SIZE = 300;

class PieChart extends Component {
	static propTypes = {
		data: PropTypes.arrayOf( DataType ).isRequired,
		title: PropTypes.string,
	};

	shouldComponentUpdate( nextProps ) {
		return ! isEqual( this.props.data, nextProps.data );
	}

	render() {
		const { title, data } = this.props;

		const sortedData = sortDataAndAssignSections( data );

		const arcs = d3Pie()
			.startAngle( Math.PI )
			.startAngle( -Math.PI )
			.value( datum => datum.value )( sortedData );

		const arcGen = d3Arc()
			.innerRadius( 0 )
			.outerRadius( SVG_SIZE / 2 );

		const paths = arcs.map( arc => arcGen( arc ) );

		return (
			<div className={ 'pie-chart' }>
				<svg
					className={ 'pie-chart__chart-drawing' }
					viewBox={ `0 0 ${ SVG_SIZE } ${ SVG_SIZE }` }
					preserveAspectRatio={ 'xMidYMid meet' }
				>
					<g transform={ `translate(${ SVG_SIZE / 2 }, ${ SVG_SIZE / 2 })` }>
						{ sortedData.map( ( datum, index ) => {
							return (
								<path
									className={ `pie-chart__chart-section-${ datum.sectionNum }` }
									key={ index.toString() }
									d={ paths[ index ] }
								/>
							);
						} ) }
					</g>
				</svg>
				{ title && <h2 className={ 'pie-chart__title' }>{ title }</h2> }
			</div>
		);
	}
}

export default PieChart;
