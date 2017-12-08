/**
 * @format
 * @jest-environment jsdom
 */

/**
 * External dependencies
 */
import { expect } from 'chai';
import { mount } from 'enzyme';
import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';

/**
 * Internal dependencies
 */
import Button from 'components/button';
import PopoverMenuItem from 'components/popover/menu-item';
import MediaLibraryDataSource from 'my-sites/media-library/data-source';
import { createReduxStore } from 'state';

describe( 'MediaLibraryDataSource', () => {
	describe( 'render data sources', () => {
		test( 'excludes data sources listed in disabledSources', () => {
			const store = createReduxStore();
			const wrapper = mount(
				<ReduxProvider store={ store }>
					<MediaLibraryDataSource
						source={ '' }
						onSourceChange={ () => null }
					/>
				</ReduxProvider>
			);
			// this click works now!
			wrapper.find( 'button' ).simulate( 'click' );
			// but the new state doesn't propogate down to the children, so the PopoverMenuItems stay hidden :(
			wrapper.update();
			// should be more than 1!
			console.error( wrapper.find('button'));
		} );
	} );
} );
