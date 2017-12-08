/**
 * @format
 * @jest-environment jsdom
 */

/**
 * External dependencies
 */
import { expect } from 'chai';
import { shallow } from 'enzyme';
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
			const wrapper = shallow(
				<ReduxProvider store={ store }>
					<MediaLibraryDataSource
						source={ '' }
						onSourceChange={ () => null }
						disabledSources={ [ 'google_photos' ] }
					/>
				</ReduxProvider>
			);
			// this complains there is no store, and says we should wrap the element in a provider. I have done.
			console.error( wrapper.html() );
			// this can't find a button to click
			wrapper.find( Button ).simulate( 'click' );
		} );
	} );
} );
