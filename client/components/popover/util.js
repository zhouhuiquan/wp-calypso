/** @format */

/**
 * External dependencies
 */

import getBoundingClientRect from 'bounding-client-rect';
import debugFactory from 'debug';

/**
 * Module variables
 */
const debug = debugFactory( 'calypso:popover:util' );

// inspired by https://github.com/jkroso/viewport
function updateViewport() {
	const viewport = {};
	viewport.top = window.scrollY;
	viewport.left = window.scrollX;
	viewport.width = window.innerWidth;
	viewport.height = window.innerHeight;
	viewport.right = viewport.left + viewport.width;
	viewport.bottom = viewport.top + viewport.height;

	debug( 'viewport: %o', viewport );
	return viewport;
}

const opposite = {
	top: 'bottom',
	bottom: 'top',
	left: 'right',
	right: 'left',
};

const adjacent = {
	top: 'right',
	left: 'top',
	bottom: 'left',
	right: 'bottom',
};

//let viewport;

let viewport = updateViewport();

function onViewportChange() {
	viewport = updateViewport();
}

let windowEventsBound = false;

const bindWindowListeners = () => {
	if ( windowEventsBound ) {
		return debug( 'window events already bound' );
	}

	windowEventsBound = true;

	debug( 'bind handlers to `resize` and `scroll` events' );
	// don't debounce these because they don't so any work that requires layout
	window.addEventListener( 'resize', onViewportChange, true );
	window.addEventListener( 'scroll', onViewportChange, true );
};

const unbindWindowListeners = () => {
	if ( ! windowEventsBound ) {
		return debug( 'window events are not bound' );
	}

	windowEventsBound = false;

	debug( 'unbind handlers to `resize` and `scroll` events' );
	window.removeEventListener( 'resize', onViewportChange, true );
	window.removeEventListener( 'scroll', onViewportChange, true );
};

const suggested = ( pos, el, target ) => {
	const targetPosition = getBoundingClientRect( target );
	const h = el.clientHeight;
	const w = el.clientWidth;

	// see where we have spare room
	const room = {
		top: targetPosition.top - h,
		bottom: viewport.height - targetPosition.bottom - h,
		left: targetPosition.left - w,
		right: viewport.width - targetPosition.right - w,
	};

	const arrayPositions = pos.split( /\s+/ );
	const [ pos0 ] = arrayPositions;
	let [ , pos1 ] = arrayPositions;

	const primary = choosePrimary( pos0, room );

	if ( pos1 === primary || pos1 === opposite[ primary ] ) {
		pos1 = null;
	}

	return chooseSecondary( primary, pos1, el, target, w, h ) || pos;
};

function choosePrimary( prefered, room ) {
	// top, bottom, left, right in order of preference
	const order = [
		prefered,
		opposite[ prefered ],
		adjacent[ prefered ],
		opposite[ adjacent[ prefered ] ],
	];

	let best = -Infinity;
	let bestPos;

	for ( let i = 0, len = order.length; i < len; i++ ) {
		const _prefered = order[ i ];
		const space = room[ _prefered ];
		// the first side it fits completely
		if ( space > 0 ) {
			return _prefered;
		}

		// less chopped of than other sides
		if ( space > best ) {
			( best = space ), ( bestPos = prefered );
		}
	}

	return bestPos;
}

function chooseSecondary( primary, prefered, el, target, w, h ) {
	// top, top left, top right in order of preference
	const isVertical = primary === 'top' || primary === 'bottom';

	const order = prefered
		? [
			isVertical ? `${ primary } ${ prefered }` : `${ prefered } ${ primary }`,
			primary,
			isVertical
				? `${ primary } ${ opposite[ prefered ] }`
				: `${ opposite[ prefered ] } ${ primary }`,
		]
		: [
			primary,
			isVertical
				? `${ primary } ${ adjacent[ primary ] }`
				: `${ adjacent[ primary ] } ${ primary }`,
			isVertical
				? `${ primary } ${ opposite[ adjacent[ primary ] ] }`
				: `${ opposite[ adjacent[ primary ] ] } ${ primary }`,
		];

	let bestPos;
	let best = 0;
	const max = w * h;

	for ( let i = 0, len = order.length; i < len; i++ ) {
		const pos = order[ i ];
		const off = offset( pos, el, target );
		const offRight = off.left + w;
		const offBottom = off.top + h;
		const yVisible = Math.min(
			off.top < viewport.top ? offBottom - viewport.top : viewport.bottom - off.top,
			h
		);

		const xVisible = Math.min(
			off.left < viewport.left ? offRight - viewport.left : viewport.right - off.left,
			w
		);

		const area = xVisible * yVisible;

		// the first position that shows all the tip
		if ( area === max ) {
			return pos;
		}

		// shows more of the tip than the other positions
		if ( area > best ) {
			( best = area ), ( bestPos = pos );
		}
	}

	return bestPos;
}

function offset( pos, el, target ) {
	const pad = 15;
	const tipRect = getBoundingClientRect( el );
	if ( ! tipRect ) {
		throw new Error( 'could not get bounding client rect of Tip element' );
	}

	const ew = tipRect.width;
	const eh = tipRect.height;

	const targetRect = getBoundingClientRect( target );
	if ( ! targetRect ) {
		throw new Error( 'could not get bounding client rect of `target`' );
	}

	const tw = targetRect.width;
	const th = targetRect.height;

	let _pos = {};

	switch ( pos ) {
		case 'top':
			_pos = {
				top: 0 - th - eh,
				left: tw / 2 - ew / 2,
			};
			break;

		case 'bottom':
			_pos = {
				top: 0,
				left: tw / 2 - ew / 2,
			};
			break;

		case 'right':
			_pos = {
				top: 0 - th / 2 - eh / 2,
				left: tw,
			};
			break;

		case 'left':
			_pos = {
				top: 0 - th / 2 - eh / 2,
				left: 0 - ew,
			};
			break;

		case 'top left':
			_pos = {
				top: 0 - th - eh,
				left: tw / 2 - ew + pad,
			};
			break;

		case 'top right':
			_pos = {
				top: 0 - th - eh,
				left: tw / 2 - pad,
			};
			break;

		case 'bottom left':
			_pos = {
				top: 0,
				left: tw / 2 - ew + pad,
			};
			break;

		case 'bottom right':
			_pos = {
				top: 0,
				left: tw / 2 - pad,
			};
			break;

		case 'left top':
			_pos = {
				top: 0 - th - eh,
				left: 0 - ew,
			};
			break;

		case 'left bottom':
			_pos = {
				top: 0,
				left: 0 - ew,
			};
			break;

		case 'right top':
			_pos = {
				top: 0 - th - eh,
				left: tw,
			};
			break;

		case 'right bottom':
			_pos = {
				top: 0,
				left: tw,
			};
			break;

		default:
			throw new Error( `invalid position "${ pos }"` );
	}

	return _pos;
}

/*
 * Constrain a left to keep the element in the window
 * @param  {Object} off offset object with left property
 * @param  {Object} el  popover element
 * @return {Number}     a new offset value constrained to not fall offscreen
 */
const constrainLeft = function( off, el ) {
	const bounds = getBoundingClientRect( el );
	off.left = Math.max( -1 * bounds.left, off.left );

	return off;
};

export { constrainLeft, bindWindowListeners, unbindWindowListeners, suggested, offset };
