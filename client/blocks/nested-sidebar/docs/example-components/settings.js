/** @format */
/**
 * External dependencies
 */
import React from 'react';

import NestedSidebarLink from '../../nested-sidebar-link';
import NestedSidebarParentLink from '../../nested-sidebar-parent-link';

import Sidebar from 'layout/sidebar';
import SidebarFooter from 'layout/sidebar/footer';
import SidebarHeading from 'layout/sidebar/heading';
import SidebarItem from 'layout/sidebar/item';
import SidebarMenu from 'layout/sidebar/menu';

export const SettingsExample = () => (
	<div style={ { xbackground: 'rgba(200,0,0,0.5)' } }>
		<h4>Settings</h4>
		<NestedSidebarParentLink>Back</NestedSidebarParentLink>
		<NestedSidebarLink route="settings/domains">Domains</NestedSidebarLink>
		<NestedSidebarLink route="settings/discussion">Discussion</NestedSidebarLink>

		<SidebarMenu>
			<ul>
				<SidebarItem
					selected={ false }
					link={ '/me'
					}
					label={ 'General' }
					icon="user"
				/>

				<SidebarItem
					selected={ false }
					link={'/me/account'}
					label={ 'Writing' }
					icon="cog"
				/>

				<SidebarItem
					selected={ false }
					link={'/me/account'}
					label={ 'Discussion' }
					icon="cog"
				/>

				<SidebarItem
					selected={ false }
					link={'/me/account'}
					label={ 'Traffic' }
					icon="cog"
				/>

			</ul>
		</SidebarMenu>
	</div>
);

export default SettingsExample;
