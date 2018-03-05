/** @format */
/**
 * External dependencies
 */
import React, { PureComponent } from 'react';
import { noop } from 'lodash';
/**
 * Internal dependencies
 */
import Button from 'components/button';
import Popover from 'components/popover';
import PopoverMenu from 'components/popover/menu';
import PopoverMenuItem from 'components/popover/menu-item';

class PopoverExample extends PureComponent {
	constructor( props ) {
		super( props );

		this.state = {
			popoverPosition: 'bottom left',
			showPopover: false,
			showComplexPopover: false,
			showPopoverMenu: false,
		};
	}

	// set position for all popovers
	changePopoverPosition = event => {
		this.setState( { popoverPosition: event.target.value } );
	};

	togglePopover = () => {
		this.setState( { showPopover: ! this.state.showPopover } );
	};

	closePopover = () => {
		this.setState( { showPopover: false } );
	};

	toggleComplexPopover = () => {
		this.setState( { showComplexPopover: ! this.state.showComplexPopover } );
	};

	closeComplexPopover = () => {
		this.setState( { showComplexPopover: false } );
	};

	showPopoverMenu = () => {
		this.setState( {
			showPopoverMenu: ! this.state.showPopoverMenu,
		} );
	};

	closePopoverMenu = () => {
		this.setState( { showPopoverMenu: false } );
	};

	renderPopover() {
		return (
			<div>
				<button className="button" ref="popoverButton" onClick={ this.togglePopover }>
					Show Popover
				</button>

				<Popover
					id="popover__basic-example"
					isVisible={ this.state.showPopover }
					onClose={ this.closePopover }
					position={ this.state.popoverPosition }
					context={ this.refs && this.refs.popoverButton }
				>
					<div style={ { padding: '10px' } }>Simple Popover Instance</div>
				</Popover>
			</div>
		);
	}

	renderComplexPopover() {
		return (
			<div>
				<button className="button" ref="popoverComplexButton" onClick={ this.toggleComplexPopover }>
					Show Popover with actions
				</button>

				<Popover
					id="popover__actions-example"
					isVisible={ this.state.showComplexPopover }
					onClose={ this.closeComplexPopover }
					position={ this.state.popoverPosition }
					context={ this.refs && this.refs.popoverComplexButton }
				>
					<div style={ { padding: '10px' } }>
						<p>This is a more complex popover, which has actions inside.</p>
						<Button onClick={ noop } compact style={ { marginRight: '8px' } }>
							Cancel
						</Button>
						<Button onClick={ noop } primary compact>
							Save
						</Button>
					</div>
				</Popover>
			</div>
		);
	}

	renderMenuPopover() {
		return (
			<div>
				<button className="button" ref="popoverMenuButton" onClick={ this.showPopoverMenu }>
					Show Popover Menu
				</button>

				<br />

				<PopoverMenu
					id="popover__menu-example"
					isVisible={ this.state.showPopoverMenu }
					onClose={ this.closePopoverMenu }
					position={ this.state.popoverPosition }
					context={ this.refs && this.refs.popoverMenuButton }
				>
					<PopoverMenuItem onClick={ noop }>Item A</PopoverMenuItem>
					<PopoverMenuItem onClick={ noop }>Item B</PopoverMenuItem>
					<PopoverMenuItem onClick={ noop }>Item C</PopoverMenuItem>
				</PopoverMenu>
			</div>
		);
	}

	render() {
		return (
			<div>
				<label>
					Position
					<select value={ this.state.popoverPosition } onChange={ this.changePopoverPosition }>
						<option value="top">top</option>
						<option value="top left">top left</option>
						<option value="top right">top right</option>
						<option value="left">left</option>
						<option value="right">right</option>
						<option value="bottom">bottom</option>
						<option value="bottom left">bottom left</option>
						<option value="bottom right">bottom right</option>
					</select>
				</label>

				<hr />

				{ this.renderPopover() }

				<hr />

				{ this.renderComplexPopover() }

				<hr />

				{ this.renderMenuPopover() }
			</div>
		);
	}
}

PopoverExample.displayName = 'Popover';

export default PopoverExample;
