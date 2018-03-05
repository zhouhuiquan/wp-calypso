/** @format */

/**
 * External dependencies
 */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ReactDom from 'react-dom';
import { connect } from 'react-redux';
import debugFactory from 'debug';
import classNames from 'classnames';
import Modal from 'react-modal';
import { uniqueId } from 'lodash';

/**
 * Internal dependencies
 */
import RootChild from 'components/root-child';
import {
	bindWindowListeners,
	unbindWindowListeners,
	suggested as suggestPosition,
	constrainLeft,
	offset,
} from './util';
import { isRtl as isRtlSelector } from 'state/selectors';

/**
 * Module variables
 */
const noop = () => {};
const debug = debugFactory( 'calypso:popover' );
const __popovers = new Set();

class Popover extends Component {
	static propTypes = {
		autoPosition: PropTypes.bool,
		autoRtl: PropTypes.bool,
		className: PropTypes.string,
		id: PropTypes.string,
		ignoreContext: PropTypes.shape( { getDOMNode: PropTypes.function } ),
		isRtl: PropTypes.bool,
		isVisible: PropTypes.bool,
		position: PropTypes.oneOf( [
			'top',
			'top right',
			'right',
			'bottom right',
			'bottom',
			'bottom left',
			'left',
			'top left',
		] ),
		rootClassName: PropTypes.string,
		showDelay: PropTypes.number,
		onClose: PropTypes.func,
		onShow: PropTypes.func,
	};

	static defaultProps = {
		autoPosition: true,
		autoRtl: true,
		className: '',
		closeOnEsc: true,
		isRtl: false,
		isVisible: false,
		position: 'top',
		showDelay: 0,
		onClose: noop,
		onShow: noop,
	};

	/**
	 * Flag to determine if we're currently repositioning the Popover
	 * @type {boolean} True if the Popover is being repositioned.
	 */
	isUpdatingPosition = false;

	constructor( props ) {
		super( props );

		this.setPopoverId( props.id );

		this.state = {
			show: props.isVisible,
			left: -99999,
			top: -99999,
			positionClass: this.getPositionClass( props.position ),
		};
	}

	componentDidMount() {
		if ( this.state.show ) {
			this.bindDebouncedReposition();
			bindWindowListeners();
		}
	}

	componentWillReceiveProps( nextProps ) {
		// update context (target) reference into a property
		this.domContext = ReactDom.findDOMNode( nextProps.context );

		if ( ! nextProps.isVisible ) {
			return null;
		}

		this.setPosition( nextProps );
	}

	componentDidUpdate( prevProps, prevState ) {
		const { isVisible } = this.props;

		if ( ! prevState.show && this.state.show ) {
			this.bindDebouncedReposition();
			bindWindowListeners();
		}

		if ( isVisible !== prevProps.isVisible ) {
			if ( isVisible ) {
				this.show();
			} else {
				this.hide();
			}
		}

		if ( ! this.domContainer || ! this.domContext ) {
			return null;
		}

		if ( ! isVisible ) {
			return null;
		}

		if ( ! this.isUpdatingPosition ) {
			// update our position even when only our children change, use `isUpdatingPosition` to guard against a loop
			// see https://github.com/Automattic/wp-calypso/commit/38e779cfebf6dd42bb30d8be7127951b0c531ae2
			this.debug( 'requesting to update position after render completes' );
			requestAnimationFrame( () => {
				// Prevent updating Popover position if it's already unmounted.
				if (
					! __popovers.has( this.id ) ||
					! this.domContainer ||
					! this.domContext ||
					! isVisible
				) {
					return;
				}

				this.setPosition();
				this.isUpdatingPosition = false;
			} );
			this.isUpdatingPosition = true;
		}
	}

	componentWillUnmount() {
		this.debug( 'unmounting .... ' );

		this.unbindDebouncedReposition();
		unbindWindowListeners();

		__popovers.delete( this.id );
		debug( 'current popover instances: ', __popovers.size );
	}

	// --- window `scroll` and `resize` ---
	bindDebouncedReposition = () => {
		window.addEventListener( 'scroll', this.onWindowChange, true );
		window.addEventListener( 'resize', this.onWindowChange, true );
	};

	unbindDebouncedReposition = () => {
		if ( this.willReposition ) {
			window.cancelAnimationFrame( this.willReposition );
			this.willReposition = null;
		}

		window.removeEventListener( 'scroll', this.onWindowChange, true );
		window.removeEventListener( 'resize', this.onWindowChange, true );
		this.debug( 'unbinding `debounce reposition` ...' );
	};

	onWindowChange = () => {
		this.willReposition = window.requestAnimationFrame( this.setPosition );
	};

	setDOMBehavior = domContainer => {
		if ( ! domContainer ) {
			return null;
		}

		this.debug( 'setting DOM behavior' );

		// store DOM element referencies
		this.domContainer = domContainer;

		// store context (target) reference into a property
		this.domContext = ReactDom.findDOMNode( this.props.context );

		this.setPosition();
	};

	getPositionClass( position = this.props.position ) {
		return `is-${ position.replace( /\s+/g, '-' ) }`;
	}

	/**
	 * Adjusts positition swapping left and right values
	 * when right-to-left directionality is found.
	 *
	 * @param  {String} position Original position
	 * @return {String}          Adjusted position
	 */
	adjustRtlPosition = position => {
		if ( this.props.isRtl ) {
			switch ( position ) {
				case 'top right':
				case 'right top':
					return 'top left';

				case 'right':
					return 'left';

				case 'bottom right':
				case 'right bottom':
					return 'bottom left';

				case 'bottom left':
				case 'left bottom':
					return 'bottom right';

				case 'left':
					return 'right';

				case 'top left':
				case 'left top':
					return 'top right';
			}
		}
		return position;
	};

	/**
	 * Computes the position of the Popover in function
	 * of its main container and the target.
	 *
	 * @param  {Object} props the props to be used, might be nextProps
	 * @return {Object} reposition parameters
	 */
	computePosition = props => {
		if ( ! props.isVisible ) {
			this.debug( '[WARN] Not visible, not computing…' );
			return null;
		}

		const { domContainer, domContext } = this;
		const { position } = props;

		if ( ! domContainer || ! domContext ) {
			this.debug( '[WARN] no DOM elements to work' );
			return null;
		}

		let suggestedPosition = position;

		this.debug( 'position: %o', suggestedPosition );

		if ( props.autoRtl ) {
			suggestedPosition = this.adjustRtlPosition( suggestedPosition );
			this.debug( 'RTL adjusted position: %o', suggestedPosition );
		}

		if ( props.autoPosition ) {
			suggestedPosition = suggestPosition( suggestedPosition, domContainer, domContext );
			this.debug( 'suggested position: %o', suggestedPosition );
		}

		const reposition = Object.assign(
			{},
			constrainLeft( offset( suggestedPosition, domContainer, domContext ), domContainer ),
			{ positionClass: this.getPositionClass( suggestedPosition ) }
		);

		this.debug( 'updating reposition: ', reposition );

		return reposition;
	};

	debug = ( string, ...args ) => {
		debug( `[%s] ${ string }`, this.id, ...args );
	};

	setPopoverId = id => {
		this.id = id || `pop__${ uniqueId() }`;
		__popovers.add( this.id );

		this.debug( 'creating ...' );
		debug( 'current popover instances: ', __popovers.size );
	};

	setPosition = ( props = false ) => {
		if ( ! props ) {
			props = this.props;
		}
		this.debug( 'updating position' );
		const position = this.computePosition( props );
		if ( ! position ) {
			return null;
		}

		this.willReposition = null;
		this.setState( position );
	};

	getStylePosition = () => {
		const { left, top } = this.state;
		return { left, top };
	};

	show = () => {
		if ( ! this.props.showDelay ) {
			this.debug( 'show popover' );
			this.setState( { show: true } );
			this.props.onShow();
			return null;
		}

		this.debug( 'showing in %o', `${ this.props.showDelay }ms` );
		this.clearShowTimer();

		this._openDelayTimer = setTimeout( () => {
			this.setState( { show: true } );
			this.props.onShow();
		}, this.props.showDelay );
	};

	hide = () => {
		this.unbindDebouncedReposition();
		unbindWindowListeners();

		this.setState( { show: false } );
		this.clearShowTimer();
	};

	clearShowTimer = () => {
		if ( ! this._openDelayTimer ) {
			return null;
		}

		clearTimeout( this._openDelayTimer );
		this._openDelayTimer = null;
	};

	close = () => {
		if ( ! this.props.isVisible ) {
			this.debug( 'popover should be already closed' );
			return null;
		}

		this.props.onClose( false );
	};

	render() {
		if ( ! this.state.show ) {
			this.debug( 'is hidden. return no render' );
			return null;
		}

		if ( ! this.props.context ) {
			this.debug( 'No `context` to tie. return no render' );
			return null;
		}

		const classes = classNames( 'popover', this.props.className, this.state.positionClass );

		this.debug( 'rendering ...' );

		const styles = this.getStylePosition();
		const { height } = document.getElementById( 'content' ).getBoundingClientRect();
		const positionStyle = {
			overlay: {
				right: 'auto',
				bottom: 'auto',
				height: `${ height }px`,
				width: '100%',
			},
			content: {
				top: styles.top,
				left: styles.left,
				right: 'auto',
				bottom: 'auto',
			},
		};

		return (
			<RootChild className={ this.props.rootClassName }>
				<Modal
					isOpen={ this.state.show }
					onRequestClose={ this.close }
					contentLabel={ this.props.label }
					appElement={ document.getElementById( 'wpcom' ) }
					overlayClassName="popover__backdrop"
					className={ classes }
					role="dialog"
					shouldCloseOnEsc={ true }
					shouldCloseOnOverlayClick={ true }
					style={ positionStyle }
				>
					<div className="popover__arrow" />
					<div className="popover__inner" ref={ this.setDOMBehavior }>
						{ this.props.children }
					</div>
				</Modal>
			</RootChild>
		);
	}
}

export default connect( state => ( {
	isRtl: isRtlSelector( state ),
} ) )( Popover );
