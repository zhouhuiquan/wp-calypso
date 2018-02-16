/** @format */

/**
 * External dependencies
 */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';

/**
 * Constants
 */

/**
 * Defines whether the current browser supports CSS animations for SVG
 * elements. Specifically, this returns false for Internet Explorer and Edge.
 *
 * @type {Boolean} True if the browser supports CSS animations for SVG
 *                 elements, or false otherwise.
 */
const isSVGCSSAnimationSupported = ( () => {
	if ( ! global.window ) {
		return false;
	}

	return ! /(MSIE |Trident\/|Edge\/)/.test( global.window.navigator.userAgent );
} )();

export default class Spinner extends Component {
	static propTypes = {
		className: PropTypes.string,
		size: PropTypes.number,
		duration: PropTypes.number,
	};

	static instances = 0;

	static defaultProps = {
		size: 20,
		duration: 3000,
	};

	instanceId = ++Spinner.instances;
	rotLeft = [ 0, 180, 180, 360, 360 ];
	rotRight = [ 0, 0, 180, 180, 360 ];
	frames = 5;
	prevTime = null;
	rotationIndex = 0;

	state = {
		// We won't always have access to user-agent in server-side context, so
		// initialize the spinner with fallback animations and check for support
		// in componentDidMount()
		isSVGCSSAnimationSupported: false,
	};

	componentDidMount() {
		if ( isSVGCSSAnimationSupported ) {
			// Turning off eslint rule on this line as an exception — we want to trigger
			// a re-render if we're progressively enhancing with SVG animations.
			// eslint-disable-next-line react/no-did-mount-set-state
			this.setState( {
				isSVGCSSAnimationSupported: isSVGCSSAnimationSupported,
			} );
		}
		requestAnimationFrame( this.step );
	}

	step = timestamp => {
		if ( ! this.prevTime ) {
			this.prevTime = timestamp;
			return requestAnimationFrame( this.step );
		}

		const elapsedTime = timestamp - this.prevTime;
		const elapsedRotation = elapsedTime / this.props.duration * this.frames;
		this.rotationIndex = ( this.rotationIndex + elapsedRotation ) % this.frames;
		this.prevTime = timestamp;

		const frame = Math.floor( this.rotationIndex );
		const decimalpart = this.rotationIndex - frame;
		const lastLeft = this.rotLeft[ frame ];
		const nextLeft = this.rotLeft[ ( frame + 1 ) % this.frames ];
		const currentLeft = lastLeft === 360 ? 360 : ( nextLeft - lastLeft ) * decimalpart + lastLeft;

		const lastRight = this.rotRight[ frame ];
		const nextRight = this.rotRight[ ( frame + 1 ) % this.frames ];
		const currentRight =
			lastRight === 360 ? 360 : ( nextRight - lastRight ) * decimalpart + lastRight;

		const spinnerLeft = document.getElementById( `spinner-${ this.instanceId }-left` );
		const spinnerRight = document.getElementById( `spinner-${ this.instanceId }-right` );

		if ( spinnerLeft ) {
			spinnerLeft.setAttribute( 'transform', `rotate( ${ currentRight } 50 50 )` );
		}

		if ( spinnerRight ) {
			spinnerRight.setAttribute( 'transform', `rotate( ${ currentLeft } 50 50 )` );
		}

		requestAnimationFrame( this.step );
	};

	getClassName() {
		return classNames( 'spinner', this.props.className, {
			'is-fallback': ! this.state.isSVGCSSAnimationSupported,
		} );
	}

	renderFallback() {
		const style = {
			width: this.props.size,
			height: this.props.size,
		};

		return (
			<div className={ this.getClassName() } style={ style }>
				<span className="spinner__progress is-left" />
				<span className="spinner__progress is-right" />
			</div>
		);
	}

	render() {
		if ( ! this.state.isSVGCSSAnimationSupported ) {
			return this.renderFallback();
		}
		const instanceId = this.instanceId;

		return (
			<div className={ this.getClassName() }>
				<svg
					className="spinner__image"
					width={ this.props.size }
					height={ this.props.size }
					viewBox="0 0 100 100"
				>
					<defs>
						<mask id={ `maskBorder${ instanceId }` }>
							<rect x="0" y="0" width="100%" height="100%" fill="white" />
							<circle r="46%" cx="50%" cy="50%" fill="black" />
						</mask>
						<mask id={ `maskDonut${ instanceId }` }>
							<rect x="0" y="0" width="100%" height="100%" fill="black" />
							<circle r="46%" cx="50%" cy="50%" fill="white" />
							<circle r="30%" cx="50%" cy="50%" fill="black" />
						</mask>
						<mask id={ `maskLeft${ instanceId }` }>
							<rect x="0" y="0" width="50%" height="100%" fill="white" />
						</mask>
						<mask id={ `maskRight${ instanceId }` }>
							<rect x="50%" y="0" width="50%" height="100%" fill="white" />
						</mask>
					</defs>
					<circle
						className="spinner__border"
						r="50%"
						cx="50%"
						cy="50%"
						mask={ `url( #maskBorder${ instanceId } )` }
					/>
					<g mask={ `url( #maskDonut${ instanceId } )` }>
						<g mask={ `url( #maskLeft${ instanceId } )` }>
							<rect
								id={ `spinner-${ instanceId }-left` }
								className="spinner__progress is-left"
								x="0"
								y="0"
								width="50%"
								height="100%"
								transform={ `rotate( ${ 0 } 50 50 )` }
							/>
						</g>
						<g mask={ `url( #maskRight${ instanceId } )` }>
							<rect
								id={ `spinner-${ instanceId }-right` }
								className="spinner__progress is-right"
								x="50%"
								y="0"
								width="50%"
								height="100%"
								transform={ `rotate( ${ 0 } 50 50 )` }
							/>
						</g>
					</g>
				</svg>
			</div>
		);
	}
}
